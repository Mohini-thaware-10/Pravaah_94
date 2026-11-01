-- PRAVAAH Supabase Initial Schema Migration
-- Run this in the Supabase SQL Editor

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================
-- AUTH & USER MANAGEMENT
-- ============================================================

-- Profiles table extends auth.users
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  institution text,
  role text not null default 'representative', -- representative, reviewer, admin
  department text,
  created_at timestamp with time zone default timezone('utc'::now, now()),
  updated_at timestamp with time zone default timezone('utc'::now, now()),
  constraint profiles_role_check check (role in ('representative', 'reviewer', 'admin'))
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Create indexes for profiles
create index idx_profiles_institution on public.profiles (institution);
create index idx_profiles_role on public.profiles (role);

-- ============================================================
-- ORGANIZATIONS
-- ============================================================

create table public.organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::now, now()),
  updated_at timestamp with time zone default timezone('utc'::now, now())
);

-- Enable RLS on organizations
alter table public.organizations enable row level security;

-- Create indexes for organizations
create index idx_organizations_name on public.organizations (name);

-- ============================================================
-- USER ROLES (RBAC)
-- ============================================================

create table public.user_roles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  organization_id uuid references organizations on delete set null,
  role text not null, -- 'representative', 'reviewer', 'admin'
  assigned_by uuid references auth.users,
  assigned_at timestamp with time zone default timezone('utc'::now, now()),
  constraint user_roles_role_check check (role in ('representative', 'reviewer', 'admin')),
  constraint uq_user_organization_role unique (user_id, organization_id)
);

-- Enable RLS on user_roles
alter table public.user_roles enable row level security;

-- Create indexes for user_roles
create index idx_user_roles_user on public.user_roles (user_id);
create index idx_user_roles_org on public.user_roles (organization_id);
create index idx_user_roles_role on public.user_roles (role);

-- ============================================================
-- APPLICATIONS
-- ============================================================

create table public.applications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade,
  organization_id uuid references organizations on delete set null,
  application_id text not null unique, -- e.g., 2025-AICTE-001
  program text not null,
  current_stage text not null default 'submitted', -- submitted, under-scrutiny, under-review, approved, rejected, needs-review
  status text not null default 'pending', -- pending, verified, rejected, needs_review
  due_date timestamp with time zone,
  compliance_status text not null default 'pending', -- pending, compliant, non-compliant
  submission_date timestamp with time zone default timezone('utc'::now, now()),
  created_at timestamp with time zone default timezone('utc'::now, now()),
  updated_at timestamp with time zone default timezone('utc'::now, now())
);

-- Enable RLS on applications
alter table public.applications enable row level security;

-- Create indexes for applications
create index idx_applications_org on public.applications (organization_id);
create index idx_applications_status on public.applications (status);
create index idx_applications_stage on public.applications (current_stage);
create index idx_applications_user on public.applications (user_id);
create index idx_applications_due on public.applications (due_date);

-- ============================================================
-- APPLICATION DOCUMENTS
-- ============================================================

create table public.application_documents (
  id uuid primary key default uuid_generate_v4(),
  application_id uuid references public.applications on delete cascade not null,
  user_id uuid references auth.users on delete cascade,
  storage_path text not null, -- path in Supabase Storage
  file_name text not null,
  file_type text,
  file_size integer,
  verification_status text not null default 'pending', -- pending, verified, rejected, needs_review
  uploaded_at timestamp with time zone default timezone('utc'::now, now()),
  verified_at timestamp with time zone,
  verification_notes text,
  created_at timestamp with time zone default timezone('utc'::now, now())
);

-- Enable RLS on application_documents
alter table public.application_documents enable row level security;

-- Create indexes for application_documents
create index idx_documents_application on public.application_documents (application_id);
create index idx_documents_user on public.application_documents (user_id);
create index idx_documents_status on public.application_documents (verification_status);

-- ============================================================
-- APPROVAL STAGES
-- ============================================================

create table public.approval_stages (
  id uuid primary key default uuid_generate_v4(),
  application_id uuid references public.applications on delete cascade not null,
  stage text not null, -- e.g., 'document-submission', 'document-review', 'compliance-check', 'final-approval'
  stage_order integer not null default 0,
  status text not null default 'pending', -- pending, in-progress, completed, failed
  reviewer_id uuid references auth.users,
  reviewed_at timestamp with time zone,
  comments text,
  created_at timestamp with time zone default timezone('utc'::now, now()),
  updated_at timestamp with time zone default timezone('utc'::now, now())
);

-- Enable RLS on approval_stages
alter table public.approval_stages enable row level security;

-- Create indexes for approval_stages
create index idx_stages_application on public.approval_stages (application_id);
create index idx_stages_order on public.approval_stages (stage_order);

-- ============================================================
-- WORKFLOW EVENTS (Audit Trail)
-- ============================================================

create table public.workflow_events (
  id uuid primary key default uuid_generate_v4(),
  application_id uuid references public.applications on delete cascade,
  user_id uuid references auth.users, -- who performed the action
  event_type text not null, -- 'stage-change', 'document-upload', 'compliance-check', 'approval', 'reject'
  description text not null,
  metadata jsonb default '{}'::jsonb, -- additional context
  created_at timestamp with time zone default timezone('utc'::now, now())
);

-- Enable RLS on workflow_events
alter table public.workflow_events enable row level security;

-- Create indexes for workflow_events
create index idx_events_application on public.workflow_events (application_id);
create index idx_events_user on public.workflow_events (user_id);
create index idx_events_type on public.workflow_events (event_type);

-- ============================================================
-- COMPLIANCE REQUIREMENTS
-- ============================================================

create table public.compliance_requirements (
  id uuid primary key default uuid_generate_v4(),
  institution text not null,
  requirement text not null, -- the specific requirement text
  category text not null, -- 'documentation', 'deadline', 'format', 'content'
  is_mandatory boolean default true,
  severity text default 'medium', -- 'low', 'medium', 'high', 'critical'
  deadline timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::now, now()),
  updated_at timestamp with time zone default timezone('utc'::now, now())
);

-- Enable RLS on compliance_requirements
alter table public.compliance_requirements enable row level security;

-- Create indexes for compliance_requirements
create index idx_req_institution on public.compliance_requirements (institution);
create index idx_req_category on public.compliance_requirements (category);
create index idx_req_mandatory on public.compliance_requirements (is_mandatory);

-- ============================================================
-- COMPLIANCE FINDINGS
-- ============================================================

create table public.compliance_findings (
  id uuid primary key default uuid_generate_v4(),
  application_id uuid references public.applications on delete cascade not null,
  requirement_id uuid references public.compliance_requirements on delete set null,
  finding text not null, -- description of the finding
  severity text not null default 'medium', -- 'low', 'medium', 'high', 'critical'
  status text not null default 'open', -- open, resolved, waived
  evidence_path text, -- path to evidence document
  resolved_at timestamp with time zone,
  resolved_by uuid references auth.users,
  created_at timestamp with time zone default timezone('utc'::now, now()),
  updated_at timestamp with time zone default timezone('utc'::now, now())
);

-- Enable RLS on compliance_findings
alter table public.compliance_findings enable row level security;

-- Create indexes for compliance_findings
create index idx_findings_application on public.compliance_findings (application_id);
create index idx_findings_requirement on public.compliance_findings (requirement_id);
create index idx_findings_status on public.compliance_findings (status);

-- ============================================================
-- TASKS
-- ============================================================

create table public.tasks (
  id uuid primary key default uuid_generate_v4(),
  application_id uuid references public.applications on delete cascade,
  assignee_id uuid references auth.users, -- user tasked to complete this
  assigned_by uuid references auth.users,
  title text not null,
  description text,
  status text not null default 'open', -- open, in-progress, completed, deferred
  priority text not null default 'medium', -- 'low', 'medium', 'high', 'critical'
  due_date timestamp with time zone,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::now, now()),
  updated_at timestamp with time zone default timezone('utc'::now, now())
);

-- Enable RLS on tasks
alter table public.tasks enable row level security;

-- Create indexes for tasks
create index idx_tasks_application on public.tasks (application_id);
create index idx_tasks_assignee on public.tasks (assignee_id);
create index idx_tasks_priority on public.tasks (priority);
create index idx_tasks_status on public.tasks (status);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  type text not null, -- 'application-status', 'document-required', 'deadline-approaching', 'compliance-finding'
  title text not null,
  message text not null,
  related_id uuid, -- references application_id, document_id, etc.
  related_type text, -- 'application', 'document', 'compliance'
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::now, now())
);

-- Enable RLS on notifications
alter table public.notifications enable row level security;

-- Create indexes for notifications
create index idx_notifications_user on public.notifications (user_id);
create index idx_notifications_read on public.notifications (is_read);
create index idx_notifications_type on public.notifications (type);

-- ============================================================
-- AUDIT LOGS (Immutable)
-- ============================================================

create table public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users,
  action text not null, -- 'create', 'update', 'delete', 'login', 'logout', 'permission-change'
  entity text not null, -- 'application', 'profile', 'user_role', etc.
  entity_id uuid,
  old_values jsonb default '{}'::jsonb,
  new_values jsonb default '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::now, now())
);

-- Enable RLS on audit_logs
alter table public.audit_logs enable row level security;

-- Create indexes for audit_logs
create index idx_audit_entity on public.audit_logs (entity);
create index idx_audit_entity_id on public.audit_logs (entity_id);
create index idx_audit_created on public.audit_logs (created_at desc);

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- 1. PROFILES policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins can update profiles"
  on public.profiles for update
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  );

-- 2. ORGANIZATIONS policies
create policy "Users can view organizations they belong to"
  on public.organizations for select
  using (exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
    and organization_id = id
  ));

create policy "Admins can manage organizations"
  on public.organizations for all
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  );

-- 3. USER ROLES policies
create policy "Users can view own roles"
  on public.user_roles for select
  using (user_id = auth.uid());

create policy "Admins can manage user roles"
  on public.user_roles for all
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  );

-- 4. APPLICATIONS policies
-- Users can view applications in their organization
create policy "Users can view org applications"
  on public.applications for select
  using (exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
    and organization_id = public.applications.organization_id
  ));

-- Users can create applications (representatives)
create policy "Representatives can create applications"
  on public.applications for insert
  with check (exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
    and role in ('representative', 'admin')
  ));

-- Users can update their own applications
create policy "Users can update own applications"
  on public.applications for update
  using (user_id = auth.uid());

-- Admins can update any application
create policy "Admins can update any application"
  on public.applications for update
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  );

-- 5. APPLICATION DOCUMENTS policies
-- Users can upload documents to their applications
create policy "Users can upload documents to own applications"
  on public.application_documents for insert
  with check (exists (
    select 1 from public.applications
    where id = application_id
    and (user_id = auth.uid() or organization_id in (
      select organization_id from public.user_roles where user_id = auth.uid()
    ))
  ));

-- Users can view documents in their applications
create policy "Users can view own application documents"
  on public.application_documents for select
  using (exists (
    select 1 from public.applications
    where id = application_id
    and (user_id = auth.uid() or organization_id in (
      select organization_id from public.user_roles where user_id = auth.uid()
    ))
  ));

-- Admins can manage all documents
create policy "Admins can manage all documents"
  on public.application_documents for all
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  );

-- 6. APPROVAL STAGES policies
create policy "Users can view stages for org applications"
  on public.approval_stages for select
  using (exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
    and organization_id in (
      select organization_id from public.user_roles where user_id = auth.uid()
    )
  ));

-- Reviewers can update stages for assigned applications
create policy "Reviewers can update stages"
  on public.approval_stages for update
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role = 'reviewer'
    )
  );

-- Admins can manage all stages
create policy "Admins can manage all stages"
  on public.approval_stages for all
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  );

-- 7. WORKFLOW EVENTS policies
create policy "Users can view events for org applications"
  on public.workflow_events for select
  using (exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
    and organization_id in (
      select organization_id from public.user_roles where user_id = auth.uid()
    )
  ));

-- 8. COMPLIANCE REQUIREMENTS policies
create policy "Users can view requirements for org"
  on public.compliance_requirements for select
  using (exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
    and organization_id in (
      select organization_id from public.user_roles where user_id = auth.uid()
    )
  ));

-- 9. COMPLIANCE FINDINGS policies
create policy "Users can view findings for own applications"
  on public.compliance_findings for select
  using (exists (
    select 1 from public.applications
    where id = application_id
    and (user_id = auth.uid() or organization_id in (
      select organization_id from public.user_roles where user_id = auth.uid()
    ))
  ));

-- Reviewers can update findings
create policy "Reviewers can update findings"
  on public.compliance_findings for update
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role = 'reviewer'
    )
  );

-- Admins can manage all findings
create policy "Admins can manage all findings"
  on public.compliance_findings for all
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  );

-- 10. TASKS policies
create policy "Users can view tasks for org applications"
  on public.tasks for select
  using (exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
    and organization_id in (
      select organization_id from public.user_roles where user_id = auth.uid()
    )
  ));

-- Users can create tasks
create policy "Admins can create tasks"
  on public.tasks for insert
  with check (exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
    and role = 'admin'
  ));

-- Users can update own tasks
create policy "Users can update own tasks"
  on public.tasks for update
  using (assignee_id = auth.uid());

-- 11. NOTIFICATIONS policies
create policy "Users can view own notifications"
  on public.notifications for select
  using (user_id = auth.uid());

-- Admins can view all notifications
create policy "Admins can view all notifications"
  on public.notifications for select
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  );

-- 12. AUDIT LOGS policies
create policy "System can insert audit logs"
  on public.audit_logs for insert
  with check (true); -- Only service role can insert

create policy "Admins can view audit logs"
  on public.audit_logs for select
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  );

-- ============================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================

-- View: Application with full stage information
create or replace view public.vw_application_full as
select
  a.*,
  json_agg(
    json_build_object(
      'stage', s.stage,
      'status', s.status,
      'reviewer', u.full_name,
      'reviewed_at', s.reviewed_at
    ) order by s.stage_order
  ) as stages,
  count(s.id) as total_stages
from public.applications a
left join public.approval_stages s on a.id = s.application_id
left join public.profiles u on s.reviewer_id = u.id
group by a.id, a.application_id, a.program, a.current_stage, a.status, a.due_date, a.compliance_status, a.submission_date, a.created_at, a.updated_at;

-- View: User with role information
create or replace view public.vw_user_full as
select
  u.*,
  r.role,
  o.name as organization_name
from auth.users u
left join public.user_roles r on u.id = r.user_id
left join public.organizations o on r.organization_id = o.id;

-- View: Dashboard summary for KPIs
create or replace view public.vw_dashboard_kpis as
select
  count(*) filter (where status = 'pending') as pending,
  count(*) filter (where current_stage = 'under-scrutiny') as under_scrutiny,
  count(*) filter (where status = 'verified') as verified,
  count(*) filter (where current_stage = 'under-review') as "under-review",
  count(*) filter (where status = 'rejected') as rejected,
  count(*) filter (where due_date < now() and status != 'verified') as overdue,
  count(*) as total
from public.applications;

-- Grant public access to views (read-only for authenticated users)
grant select on public.vw_application_full to authenticated;
grant select on public.vw_user_full to authenticated;
grant select on public.vw_dashboard_kpis to authenticated;