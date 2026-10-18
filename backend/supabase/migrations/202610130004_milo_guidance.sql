alter table public.learner_settings
  add column if not exists narration_mode text not null default 'concise'
  check (narration_mode in ('full', 'concise'));
