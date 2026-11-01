-- PRAVAAH Profile Auto-Creation Trigger
-- Run AFTER the initial schema migration and consolidated RLS migration
-- Creates a profile row for every new Supabase auth.user sign-up
-- Safe to rerun — handles duplicate events idempotently.

-- ============================================================
-- FUNCTION: Create profile on signup
-- ============================================================

create or replace function public.handle_new_user()
returns trigger language sql stable as $$
begin
  -- Idempotent: only create profile if one does not already exist
  if not exists (
    select 1 from public.profiles where id = auth.uid()
  ) then
    insert into public.profiles (
      id,
      full_name,
      institution,
      role,
      department,
      created_at,
      updated_at
    ) values (
      auth.uid(),                              -- id from auth.users
      null::text,                              -- full_name — set later via onboarding
      null::text,                              -- institution — set later via onboarding
      'representative'::text,                  -- safe default role — NEVER admin from signup
      null::text,                              -- department — set later via onboarding
      timezone('utc'::now, now()),           -- created_at
      timezone('utc'::now, now())            -- updated_at
    );
  end if;
  return new;
end;
$$;

-- ============================================================
-- TRIGGER: Attach to auth.users on INSERT
-- ============================================================

create trigger on_auth_user_insert
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();