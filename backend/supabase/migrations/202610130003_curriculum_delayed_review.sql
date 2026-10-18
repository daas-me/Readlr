-- Pilot delayed-review schedule for the approved ENG-01 m-a-t vertical slice.
-- One and three day intervals are product hypotheses, not DepEd requirements or mastery rules.

drop function if exists public.get_curriculum_evidence_summary(bigint);
create function public.get_curriculum_evidence_summary(p_learner bigint)
returns table (
  curriculum_version text,
  skill_id text,
  attempt_count bigint,
  correct_count bigint,
  helped_count bigint,
  independent_candidate_count bigint,
  delayed_review_count bigint,
  delayed_review_correct_count bigint,
  best_evidence_class text,
  latest_result text,
  latest_mode text,
  latest_activity_id text,
  latest_at timestamptz,
  latest_review_result text,
  latest_review_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  with ranked as (
    select
      attempt.*,
      row_number() over (
        partition by attempt.curriculum_version, attempt.skill_id
        order by attempt.completed_at desc, attempt.id desc
      ) as latest_rank
    from public.curriculum_attempts attempt
    where attempt.learner_id = p_learner
  )
  select
    ranked.curriculum_version,
    ranked.skill_id,
    count(*) as attempt_count,
    count(*) filter (where ranked.result = 'correct') as correct_count,
    count(*) filter (where ranked.evidence_class = 'completed_with_help') as helped_count,
    count(*) filter (where ranked.evidence_class = 'independent_candidate' and ranked.activity_mode = 'independent_check') as independent_candidate_count,
    count(*) filter (where ranked.activity_mode = 'delayed_review') as delayed_review_count,
    count(*) filter (where ranked.activity_mode = 'delayed_review' and ranked.result = 'correct') as delayed_review_correct_count,
    case max(case ranked.evidence_class
      when 'independent_candidate' then 3
      when 'completed_with_help' then 2
      when 'practiced' then 1
      else 0
    end)
      when 3 then 'independent_candidate'
      when 2 then 'completed_with_help'
      when 1 then 'practiced'
      else 'not_assessed'
    end as best_evidence_class,
    max(ranked.result) filter (where ranked.latest_rank = 1) as latest_result,
    max(ranked.activity_mode) filter (where ranked.latest_rank = 1) as latest_mode,
    max(ranked.activity_id) filter (where ranked.latest_rank = 1) as latest_activity_id,
    max(ranked.completed_at) filter (where ranked.latest_rank = 1) as latest_at,
    (array_agg(ranked.result order by ranked.completed_at desc, ranked.id desc)
      filter (where ranked.activity_mode = 'delayed_review'))[1] as latest_review_result,
    max(ranked.completed_at) filter (where ranked.activity_mode = 'delayed_review') as latest_review_at
  from ranked
  group by ranked.curriculum_version, ranked.skill_id
  order by max(ranked.completed_at) desc, ranked.skill_id;
$$;

comment on function public.get_curriculum_evidence_summary(bigint) is
  'Aggregates immediate and delayed evidence separately for one backend-resolved learner. No row is a mastery award.';
revoke all on function public.get_curriculum_evidence_summary(bigint) from public, anon, authenticated;
grant execute on function public.get_curriculum_evidence_summary(bigint) to service_role;

create or replace function public.get_curriculum_review_status(p_learner bigint, p_curriculum text)
returns table (
  review_status text,
  independent_completed_at timestamptz,
  due_at timestamptz,
  latest_review_at timestamptz,
  review_count bigint,
  interval_days integer
)
language sql
stable
security definer
set search_path = public
as $$
  with required(skill_id) as (
    values ('eng01.letter.m'), ('eng01.letter.a'), ('eng01.letter.t'), ('eng01.decode.mat')
  ), independent_sessions as (
    select attempt.session_id, max(attempt.completed_at) as completed_at
    from public.curriculum_attempts attempt
    join required on required.skill_id = attempt.skill_id
    where attempt.learner_id = p_learner
      and attempt.curriculum_version = p_curriculum
      and attempt.activity_mode = 'independent_check'
    group by attempt.session_id
    having count(distinct attempt.skill_id) = 4
  ), completed_reviews as (
    select
      attempt.session_id,
      max(attempt.completed_at) as completed_at,
      bool_and(attempt.result = 'correct') as all_correct
    from public.curriculum_attempts attempt
    join required on required.skill_id = attempt.skill_id
    where attempt.learner_id = p_learner
      and attempt.curriculum_version = p_curriculum
      and attempt.activity_mode = 'delayed_review'
      and attempt.activity_id = 'ENG01-MAT-R01'
    group by attempt.session_id
    having count(distinct attempt.skill_id) = 4
  ), anchors as (
    select
      (select max(completed_at) from independent_sessions) as independent_at,
      (select completed_at from completed_reviews order by completed_at desc limit 1) as review_at,
      coalesce((select all_correct from completed_reviews order by completed_at desc limit 1), false) as last_review_correct,
      (select count(*) from completed_reviews) as completed_review_count
  ), schedule as (
    select
      independent_at,
      review_at,
      completed_review_count,
      case when review_at is not null and last_review_correct then 3 else 1 end as days,
      coalesce(review_at, independent_at) +
        make_interval(days => case when review_at is not null and last_review_correct then 3 else 1 end) as next_due
    from anchors
  )
  select
    case
      when independent_at is null then 'not_scheduled'
      when now() >= next_due then 'due'
      else 'waiting'
    end,
    independent_at,
    next_due,
    review_at,
    completed_review_count,
    days
  from schedule;
$$;

comment on function public.get_curriculum_review_status(bigint, text) is
  'Schedules delayed m-a-t review after a complete independent session. Intervals are pilot hypotheses and never award mastery.';

revoke all on function public.get_curriculum_review_status(bigint, text) from public, anon, authenticated;
grant execute on function public.get_curriculum_review_status(bigint, text) to service_role;
