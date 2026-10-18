-- Server-issued checkpoints, separate from legacy completion and client evidence.
-- Requires curriculum releases and learner_stage_state migrations first.
create table if not exists public.reading_checkpoints (
  id uuid primary key,
  learner_id bigint not null references public.learner_profiles(id) on delete cascade,
  curriculum_version text not null,
  media_manifest_version text not null,
  chapter_id text not null,
  epoch integer not null check (epoch >= 0),
  words text[] not null check (cardinality(words) between 1 and 5),
  results jsonb not null default '{}',
  passed boolean not null default false,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '2 hours',
  completed_at timestamptz,
  foreign key (curriculum_version,media_manifest_version)
    references public.curriculum_releases(curriculum_version,media_manifest_version)
);
create index if not exists reading_checkpoints_progress_idx
  on public.reading_checkpoints(learner_id,curriculum_version,epoch,passed);
alter table public.reading_checkpoints enable row level security;
revoke all on public.reading_checkpoints from public,anon,authenticated;
grant all on public.reading_checkpoints to service_role;

-- The API supplies a recognition result, never a browser-supplied score. First
-- terminal outcome wins, so network retries cannot improve an answered item.
create or replace function public.record_reading_checkpoint(
  p_learner bigint,p_session uuid,p_item integer,p_result text)
returns jsonb language plpgsql security invoker set search_path=public as $$
declare current_epoch integer; s reading_checkpoints; updated jsonb; n integer; matched integer;
begin
  if p_result not in ('matched','different','uncertain','unavailable','skipped') or p_result is null then
    raise exception 'Invalid recognition result';
  end if;
  select epoch into strict current_epoch from learner_stage_state
    where learner_id=p_learner and stage_number=3 for update;
  select * into strict s from reading_checkpoints where id=p_session and learner_id=p_learner for update;
  if s.epoch <> current_epoch then raise exception 'Checkpoint was reset'; end if;
  if p_item is null or p_item < 0 or p_item >= cardinality(s.words) then raise exception 'Invalid item'; end if;
  if not exists(select 1 from curriculum_releases where curriculum_version=s.curriculum_version
    and media_manifest_version=s.media_manifest_version and status='approved') then raise exception 'Release unavailable'; end if;
  if s.results->>p_item::text in ('matched','different','skipped') then return to_jsonb(s); end if;
  if s.expires_at < now() then raise exception 'Checkpoint expired'; end if;
  updated := jsonb_set(s.results,array[p_item::text],to_jsonb(p_result));
  select count(*) filter (where key ~ '^[0-9]+$' and value in ('matched','different','skipped')),
    count(*) filter (where key ~ '^[0-9]+$' and value='matched') into n,matched from jsonb_each_text(updated);
  update reading_checkpoints set results=updated,
    passed=(n=cardinality(words) and not exists(select 1 from jsonb_each_text(updated) where value='skipped')
      and case when chapter_id='gate' then matched=cardinality(words) and updated->>'meaning'='matched'
        else matched>=ceil(cardinality(words)*0.8) end),
    completed_at=case when n=cardinality(words) and (chapter_id<>'gate' or updated->>'meaning' in ('matched','different','skipped')) then now() else null end
    where id=p_session returning * into s;
  insert into curriculum_attempts(learner_id,client_attempt_id,session_id,curriculum_version,media_manifest_version,
    activity_id,skill_id,content_id,activity_mode,response_type,result,evidence_class,started_at,completed_at,payload_hash)
  values(p_learner,gen_random_uuid(),s.id,s.curriculum_version,s.media_manifest_version,
    'aral.'||s.chapter_id||'.check','aral.read.'||s.words[p_item+1],'aral.word.'||s.words[p_item+1],
    'independent_check','speech_prediction',
    case p_result when 'matched' then 'correct' when 'different' then 'incorrect' when 'skipped' then 'no_response' when 'unavailable' then 'unavailable' else 'unclear' end,
    case p_result when 'matched' then 'independent_candidate' when 'different' then 'practiced' else 'not_assessed' end,
    s.created_at,now(),encode(sha256(convert_to(s.id::text||':'||p_item::text||':'||p_result||':'||clock_timestamp()::text,'UTF8')),'hex'));
  return to_jsonb(s);
end $$;
revoke all on function public.record_reading_checkpoint(bigint,uuid,integer,text) from public,anon,authenticated;
grant execute on function public.record_reading_checkpoint(bigint,uuid,integer,text) to service_role;

create or replace function public.record_reading_checkpoint_meaning(
  p_learner bigint,p_session uuid,p_response text)
returns jsonb language plpgsql security invoker set search_path=public as $$
declare current_epoch integer; s reading_checkpoints; updated jsonb; outcome text; n integer; matched integer;
begin
  if p_response not in ('mat','tin','mango','skipped') or p_response is null then raise exception 'Invalid meaning response'; end if;
  select epoch into strict current_epoch from learner_stage_state where learner_id=p_learner and stage_number=3 for update;
  select * into strict s from reading_checkpoints where id=p_session and learner_id=p_learner for update;
  if s.epoch<>current_epoch or s.chapter_id<>'gate' then raise exception 'Checkpoint unavailable'; end if;
  if s.expires_at<now() then raise exception 'Checkpoint expired'; end if;
  if s.results->>'meaning' in ('matched','different','skipped') then return to_jsonb(s); end if;
  outcome:=case when p_response='mat' then 'matched' when p_response='skipped' then 'skipped' else 'different' end;
  updated:=jsonb_set(s.results,'{meaning}',to_jsonb(outcome));
  select count(*) filter(where key ~ '^[0-9]+$' and value in ('matched','different','skipped')),
    count(*) filter(where key ~ '^[0-9]+$' and value='matched') into n,matched from jsonb_each_text(updated);
  update reading_checkpoints set results=updated,
    passed=(n=cardinality(words) and matched=cardinality(words) and outcome='matched'
      and not exists(select 1 from jsonb_each_text(updated) where value='skipped')),
    completed_at=case when n=cardinality(words) then now() else null end
    where id=p_session returning * into s;
  insert into curriculum_attempts(learner_id,client_attempt_id,session_id,curriculum_version,media_manifest_version,
    activity_id,skill_id,content_id,activity_mode,response_type,response_value,result,evidence_class,
    hint_count,model_exposed,answer_exposed,reduced_choices,started_at,completed_at,payload_hash)
  values(p_learner,gen_random_uuid(),s.id,s.curriculum_version,s.media_manifest_version,
    'aral.gate.meaning','aral.meaning.mat','aral.word.mat','independent_check','selection',p_response,
    case outcome when 'matched' then 'correct' when 'different' then 'incorrect' else 'no_response' end,
    case outcome when 'matched' then 'independent_candidate' when 'different' then 'practiced' else 'not_assessed' end,
    0,false,false,false,s.created_at,now(),encode(sha256(convert_to(s.id::text||':meaning:'||outcome||':'||clock_timestamp()::text,'UTF8')),'hex'));
  return to_jsonb(s);
end $$;
revoke all on function public.record_reading_checkpoint_meaning(bigint,uuid,text) from public,anon,authenticated;
grant execute on function public.record_reading_checkpoint_meaning(bigint,uuid,text) to service_role;

create or replace function public.start_reading_checkpoint(
  p_learner bigint,p_epoch integer,p_chapter text,p_words text[],p_version text,p_media text)
returns jsonb language plpgsql security invoker set search_path=public as $$
declare current_epoch integer; s reading_checkpoints;
begin
  select epoch into strict current_epoch from learner_stage_state
    where learner_id=p_learner and stage_number=3 for update;
  if current_epoch <> p_epoch then raise exception 'Checkpoint was reset'; end if;
  if not exists(select 1 from curriculum_releases where curriculum_version=p_version
    and media_manifest_version=p_media and status='approved') then raise exception 'Release unavailable'; end if;
  select * into s from reading_checkpoints where learner_id=p_learner and epoch=p_epoch
    and chapter_id=p_chapter and curriculum_version=p_version and completed_at is null
    and expires_at>now() order by created_at desc limit 1;
  if found then return to_jsonb(s); end if;
  insert into reading_checkpoints(id,learner_id,epoch,chapter_id,words,curriculum_version,media_manifest_version)
    values(gen_random_uuid(),p_learner,p_epoch,p_chapter,p_words,p_version,p_media) returning * into s;
  return to_jsonb(s);
end $$;
revoke all on function public.start_reading_checkpoint(bigint,integer,text,text[],text,text) from public,anon,authenticated;
grant execute on function public.start_reading_checkpoint(bigint,integer,text,text[],text,text) to service_role;

create or replace function public.reading_checkpoint_overview(p_learners bigint[])
returns table(learner_id bigint,chapters bigint,last_checkpoint timestamptz)
language sql stable security invoker set search_path=public as $$
  select s.learner_id,count(distinct s.chapter_id) filter(where s.passed),max(s.completed_at)
  from reading_checkpoints s join learner_stage_state g on g.learner_id=s.learner_id
    and g.stage_number=3 and g.epoch=s.epoch
  where s.learner_id=any(p_learners) and s.curriculum_version='readlr-aral-english-1'
  group by s.learner_id;
$$;
revoke all on function public.reading_checkpoint_overview(bigint[]) from public,anon,authenticated;
grant execute on function public.reading_checkpoint_overview(bigint[]) to service_role;
