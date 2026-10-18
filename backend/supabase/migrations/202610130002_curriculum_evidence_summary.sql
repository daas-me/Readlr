-- Server-only learner evidence aggregation. This reports attempt context, never mastery.
create or replace function public.get_curriculum_evidence_summary(p_learner bigint)
returns table (
  curriculum_version text,
  skill_id text,
  attempt_count bigint,
  correct_count bigint,
  helped_count bigint,
  independent_candidate_count bigint,
  best_evidence_class text,
  latest_result text,
  latest_mode text,
  latest_activity_id text,
  latest_at timestamptz
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
    count(*) filter (where ranked.evidence_class = 'independent_candidate') as independent_candidate_count,
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
    max(ranked.completed_at) filter (where ranked.latest_rank = 1) as latest_at
  from ranked
  group by ranked.curriculum_version, ranked.skill_id
  order by max(ranked.completed_at) desc, ranked.skill_id;
$$;

comment on function public.get_curriculum_evidence_summary(bigint) is
  'Aggregates server-derived attempt context for one backend-resolved learner. independent_candidate is not mastery.';

revoke all on function public.get_curriculum_evidence_summary(bigint) from public, anon, authenticated;
grant execute on function public.get_curriculum_evidence_summary(bigint) to service_role;
