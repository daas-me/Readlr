-- Guardian consent for new learner accounts and an admin-set research participation flag.
-- Apply before deploying the guardian-consent backend (registration writes these columns).
alter table public.users add column if not exists consent_at timestamptz;
alter table public.users add column if not exists consent_version text;
alter table public.learner_profiles add column if not exists study_participant boolean not null default false;

-- Match later migrations: only the server role reads these tables.
revoke all on public.users, public.learner_profiles from anon, authenticated;
grant all on public.users, public.learner_profiles to service_role;
