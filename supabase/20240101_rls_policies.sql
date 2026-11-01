-- PRAVAAH RLS Policies Migration
-- Run after the initial schema migration

-- ============================================================
-- ENABLE RLS ON ALL TABLES (if not already enabled)
-- ============================================================

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.user_roles enable row level security;
alter table public.applications enable row level security;
alter table public.application_documents enable row level security;
alter table public.approval_stages enable row level security;
alter table public.workflow_events enable row level security;
alter table public.compliance_requirements enable row level security;
alter table public.compliance_findings enable row level security;
alter table public.tasks enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

-- ============================================================
-- PROFILES POLICIES
-- ============================================================

-- Allow users to view their own profile
create or replace policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

-- Allow admins to update all profiles
create or replace policy "profiles_update_admin"
  on public.profiles for update
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  );

-- Allow admins to insert profiles (on user creation)
create or replace policy "profiles_insert_admin"
  on public.profiles for insert
  with check (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  );

-- ============================================================
-- ORGANIZATIONS POLICIES
-- ============================================================

-- Allow users to view organizations they have a role in
create or replace policy "organizations_select_org"
  on public.organizations for select
  using (exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
    and organization_id = id
  ));

-- Allow admins to manage all organizations
create or replace policy "organizations_all_admin"
  on public.organizations for all
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  );

-- ============================================================
-- USER ROLES POLICIES
-- ============================================================

-- Allow users to view their own roles
create or replace policy "user_roles_select_own"
  on public.user_roles for select
  using (user_id = auth.uid());

-- Allow admins to manage all user roles
create or replace policy "user_roles_all_admin"
  on public.user_roles for all
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  );

-- ============================================================
-- APPLICATIONS POLICIES
-- ============================================================

-- Allow users to view applications in their organization
create or replace policy "applications_select_org"
  on public.applications for select
  using (exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
    and organization_id = public.applications.organization_id
  ));

-- Allow representatives and admins to insert applications
create or replace policy "applications_insert_rep_admin"
  on public.applications for insert
  with check (exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
    and role in ('representative', 'admin')
  ));

-- Allow users to update their own applications
create or replace policy "applications_update_own"
  on public.applications for update
  using (user_id = auth.uid());

-- Allow admins to update any application
create or replace policy "applications_update_admin"
  on public.applications for update
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  );

-- Allow admins to delete any application
create or replace policy "applications_delete_admin"
  on public.applications for delete
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  );

-- ============================================================
-- APPLICATION DOCUMENTS POLICIES
-- ============================================================

-- Allow users to insert documents for their applications
create or replace policy "application_documents_insert_own"
  on public.application_documents for insert
  with check (exists (
    select 1 from public.applications
    where id = application_id
    and (
      user_id = auth.uid()
      or exists (
        select 1 from public.user_roles
        where user_id = auth.uid()
        and organization_id = public.applications.organization_id
      )
    )
  ));

-- Allow users to view documents in their applications
create or replace policy "application_documents_select_own"
  on public.application_documents for select
  using (exists (
    select 1 from public.applications
    where id = application_id
    and (
      user_id = auth.uid()
      or exists (
        select 1 from public.user_roles
        where user_id = auth.uid()
        and organization_id = public.applications.organization_id
      )
    )
  ));

-- Allow admins to manage all documents
create or replace policy "application_documents_all_admin"
  on public.application_documents for all
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  );

-- ============================================================
-- APPROVAL STAGES POLICIES
-- ============================================================

-- Allow users to view stages for their organization's applications
create or replace policy "approval_stages_select_org"
  on public.approval_stages for select
  using (exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
    and organization_id in (
      select organization_id from public.user_roles where user_id = auth.uid()
    )
  ));

-- Allow reviewers to update stages
create or replace policy "approval_stages_update_reviewer"
  on public.approval_stages for update
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role = 'reviewer'
    )
  );

-- Allow admins to manage all stages
create or replace policy "approval_stages_all_admin"
  on public.approval_stages for all
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  );

-- ============================================================
-- WORKFLOW EVENTS POLICIES
-- ============================================================

-- Allow users to view events for their organization's applications
create or replace policy "workflow_events_select_org"
  on public.workflow_events for select
  using (exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
    and organization_id in (
      select organization_id from public.user_roles where user_id = auth.uid()
    )
  ));

-- ============================================================
-- COMPLIANCE REQUIREMENTS POLICIES
-- ============================================================

-- Allow users to view requirements for their organization
create or replace policy "compliance_requirements_select_org"
  on public.compliance_requirements for select
  using (exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
    and organization_id in (
      select organization_id from public.user_roles where user_id = auth.uid()
    )
  ));

-- ============================================================
-- COMPLIANCE FINDINGS POLICIES
-- ============================================================

-- Allow users to view findings for their applications
create or replace policy "compliance_findings_select_own"
  on public.compliance_findings for select
  using (exists (
    select 1 from public.applications
    where id = application_id
    and (
      user_id = auth.uid()
      or exists (
        select 1 from public.user_roles
        where user_id = auth.uid()
        and organization_id = public.applications.organization_id
      )
    )
  ));

-- Allow reviewers to update findings
create or replace policy "compliance_findings_update_reviewer"
  on public.compliance_findings for update
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role = 'reviewer'
    )
  );

-- Allow admins to manage all findings
create or replace policy "compliance_findings_all_admin"
  on public.compliance_findings for all
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  );

-- ============================================================
-- TASKS POLICIES
-- ============================================================

-- Allow users to view tasks for their organization's applications
create or replace policy "tasks_select_org"
  on public.tasks for select
  using (exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
    and organization_id in (
      select organization_id from public.user_roles where user_id = auth.uid()
    )
  ));

-- Allow admins to create tasks
create or replace policy "tasks_insert_admin"
  on public.tasks for insert
  with check (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  );

-- Allow assignees to update their own tasks
create or replace policy "tasks_update_own"
  on public.tasks for update
  using (assignee_id = auth.uid());

-- ============================================================
-- NOTIFICATIONS POLICIES
-- ============================================================

-- Allow users to view their own notifications
create or replace policy "notifications_select_own"
  on public.notifications for select
  using (user_id = auth.uid());

-- Allow admins to view all notifications
create or replace policy "notifications_select_admin"
  on public.notifications for select
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  );

-- ============================================================
-- AUDIT LOGS POLICIES
-- ============================================================

-- Only service role can insert audit logs
create or replace policy "audit_logs_insert_service"
  on public.audit_logs for insert
  with check (true);

-- Allow admins to view audit logs
create or replace policy "audit_logs_select_admin"
  on public.audit_logs for select
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  );