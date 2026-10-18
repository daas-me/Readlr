-- Canonical account-backed state for the ten-book reading journey.
create table if not exists public.learner_curriculum_state (
  learner_id bigint primary key references public.learner_profiles(id) on delete cascade,
  schema_version smallint not null default 1 check (schema_version = 1),
  camp_orientation_step smallint not null default 0 check (camp_orientation_step between 0 and 3),
  guided_stops text[] not null default '{}',
  guided_activities jsonb not null default '{}',
  guided_rounds jsonb not null default '{}',
  carousel_focus smallint not null default 0 check (carousel_focus between 0 and 9),
  sticker_book_opened boolean not null default false,
  sound_recordings jsonb not null default '[]',
  updated_at timestamptz not null default now()
);

alter table public.learner_curriculum_state enable row level security;
revoke all on public.learner_curriculum_state from public, anon, authenticated;
grant all on public.learner_curriculum_state to service_role;

-- Corrected repeats are new evidence, but they may repair an earlier result
-- after the learner completes the intervening challenges.
create or replace function public.retry_reading_checkpoint(
  p_learner bigint,p_session uuid,p_item integer,p_result text)
returns jsonb language plpgsql security invoker set search_path=public as $$
declare current_epoch integer; s reading_checkpoints; updated jsonb; n integer; matched integer;
begin
  if p_result not in ('matched','different','uncertain','unavailable') or p_result is null then
    raise exception 'Invalid recognition result';
  end if;
  select epoch into strict current_epoch from learner_stage_state
    where learner_id=p_learner and stage_number=3 for update;
  select * into strict s from reading_checkpoints where id=p_session and learner_id=p_learner for update;
  if s.epoch<>current_epoch or s.expires_at<now() then raise exception 'Checkpoint unavailable'; end if;
  if p_item is null or p_item<0 or p_item>=cardinality(s.words) then raise exception 'Invalid item'; end if;
  if s.results->>p_item::text not in ('different','uncertain','unavailable') then return to_jsonb(s); end if;
  updated:=jsonb_set(s.results,array[p_item::text],to_jsonb(p_result));
  select count(*) filter(where key~'^[0-9]+$' and value in ('matched','different','skipped')),
    count(*) filter(where key~'^[0-9]+$' and value='matched') into n,matched from jsonb_each_text(updated);
  update reading_checkpoints set results=updated,
    passed=(n=cardinality(words) and not exists(select 1 from jsonb_each_text(updated) where value='skipped')
      and case when chapter_id='gate' then matched=cardinality(words) and updated->>'meaning'='matched'
        else matched>=ceil(cardinality(words)*0.8) end),
    completed_at=case when n=cardinality(words) and (chapter_id<>'gate' or updated->>'meaning' in ('matched','different','skipped')) then now() else null end
    where id=p_session returning * into s;
  insert into curriculum_attempts(learner_id,client_attempt_id,session_id,curriculum_version,media_manifest_version,
    activity_id,skill_id,content_id,activity_mode,response_type,result,evidence_class,started_at,completed_at,payload_hash)
  values(p_learner,gen_random_uuid(),s.id,s.curriculum_version,s.media_manifest_version,
    'aral.'||s.chapter_id||'.check.retry','aral.read.'||s.words[p_item+1],'aral.word.'||s.words[p_item+1],
    'practice','speech_prediction',case p_result when 'matched' then 'correct' when 'different' then 'incorrect' when 'unavailable' then 'unavailable' else 'unclear' end,
    case p_result when 'matched' then 'completed_with_help' when 'different' then 'practiced' else 'not_assessed' end,
    s.created_at,now(),encode(sha256(convert_to(s.id::text||':retry:'||p_item::text||':'||p_result||':'||clock_timestamp()::text,'UTF8')),'hex'));
  return to_jsonb(s);
end $$;
revoke all on function public.retry_reading_checkpoint(bigint,uuid,integer,text) from public,anon,authenticated;
grant execute on function public.retry_reading_checkpoint(bigint,uuid,integer,text) to service_role;
