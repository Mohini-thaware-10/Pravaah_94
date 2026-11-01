# PRAVAAH — Final Supabase Migration Sequence

## Overview
This document outlines the complete, consolidated migration sequence for the PRAVAAH application.
**Do NOT execute any SQL without explicit approval. This is a read-only planning document.**

---

## Migration Order

### Phase 1 — Initial Schema (Prerequisite)
**File**: `20240101_initial_schema.sql`
**Purpose**: Creates all 12 tables, 2 extensions, 3 views, and embedded RLS policies.
**Dependencies**: None — run first on a fresh Supabase project.
**Risks**: Low — `if not exists` on extensions. Safe on empty database.

**Action**: Run in Supabase SQL Editor.
```sql
-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- [All table definitions, indexes, views from initial schema file]
```

---

### Phase 2 — Consolidated RLS Policies
**File**: `20240101_consolidated_rls.sql`
**Purpose**: Creates ALL RLS policies in one consolidated migration.
**Critical**: This replaces BOTH the embedded RLS from the schema file AND the separate `20240101_rls_policies.sql`.
**Must NOT run**: `20240101_rls_policies.sql` after this, and DO NOT run the embedded policies from the schema file alongside this.
**Dependencies**: Phase 1 must complete first (tables + views must exist).
**Risks**: Medium — if embedded policies from schema file are also run, there will be conflicts. This file is the ONE AND ONLY source of RLS policies.

**Action**: Run in Supabase SQL Editor after Phase 1.
**Security improvements over prior approach**:
- Reviewer policies now include organization and assignment checks
- No permissive "OR" combinations between overlapping policies
- All policies guard by `user_roles` admin check pattern
- organizations, applications, documents all use org-level access control

---

### Phase 3 — Profile Auto-Creation Trigger
**File**: `20240101_profile_trigger.sql`
**Purpose**: Creates `handle_new_user()` function + `on_auth_user_insert` trigger.
**Purpose**: Automatically creates a `profiles` row for every new Supabase sign-up.
**Dependencies**: Phases 1 & 2 must complete first (profiles table must exist + RLS must be active).
**Risks**: Low — idempotent (checks if profile already exists before inserting).
**Security**:
- Default role = `'representative'` — never admin from signup metadata
- Full RLS protection: users can only view own profile via `profiles_select_own`
- Admins can update all profiles via `profiles_update_admin`

**Action**: Run in Supabase SQL Editor after Phases 1 & 2.

---

### Phase 4 — Document Storage Bucket
**Action**: Supabase Dashboard UI
**Steps**:
1. Log in to Supabase dashboard
2. Navigate to **Storage** → **Buckets** → **New bucket**
3. Bucket name: `documents`
4. Public bucket: **No** (private)
5. File size limit: (e.g., 10MB)
6. Allowed MIME types: application/pdf, image/*, application/msword, etc.
7. Click **Create bucket**

**Dependencies**: Phase 3 (or earlier) — bucket can be created anytime before storage testing.
**Risks**: Bucket name conflict if name already exists. Choose a unique name.

**Action**: Create via Supabase dashboard UI (not SQL).

---

### Phase 5 — Document Storage RLS Policies
**File**: `20240101_storage_policies.sql`
**Purpose**: Creates storage RLS policies for the `documents` bucket.
**Prerequisite**: Phase 4 must complete (bucket must exist).
**Dependencies**: Phases 1-3 recommended (for org-level access checks via user_roles).
**Dependencies**: The `storage.foldername(key)` function extracts application_id from the upload path.
**Risks**: None if bucket exists and policies are correctly scoped.

**Action**: Run in Supabase SQL Editor after Phase 4.

---

### Phase 6 — Authentication Testing
**Purpose**: Verify the full auth flow works with the database.
**Tests**:
1. Sign up with email — verify profile auto-creation (Phase 3)
2. Check profiles table has row with role = 'representative'
3. Sign in — verify session persistence
4. Navigate to dashboard — verify KPIs load from `vw_dashboard_kpis` view
5. Verify RBAC: representative sees own org's data only
6. Test document upload — verify storage policies work
7. Test sign out — verify session clears

**Dependencies**: All previous phases.
**Action**: Manual testing via application at `http://localhost:5173`.

---

### Phase 7 — Database Connectivity & Dashboard KPI Test
**Purpose**: Verify real data loads from Supabase instead of hardcoded values.
**Tests**:
1. Open application at localhost:5173
2. Verify KPI cards show numbers from `vw_dashboard_kpis` view
3. Verify dashboard grid layout renders correctly
4. Verify sidebar navigation items come from Supabase (or are properly configured)
5. Verify responsive breakpoints work

**Dependencies**: Phase 6 (auth working + data in database).
**Action**: Manual verification in browser.

---

### Phase 8 — Responsive UI Verification
**Purpose**: Verify all 7 breakpoints.
**Viewport sizes**: 1920×1080, 1440×900, 1366×768, 1024×768, 768×1024, 390×844, 360×800
**Tests**:
- Sidebar visibility and navigation
- Dashboard alignment and grid layout
- No horizontal overflow
- Profile dropdown works
- Document Assistant only inside /document-verification
- All 16 acceptance criteria

**Dependencies**: Phase 7.
**Action**: Manual testing at each viewport size.

---

## Rollback Considerations

| Scenario | Rollback Action |
|----------|-----------------|
| Migration fails mid-way | Supabase has built-in query history — use `Ctrl+Z` or re-run failed statement |
| Profile trigger causes issues | `drop trigger on_auth_user_insert on auth.users;` then `drop function handle_new_user();` |
| RLS policies too restrictive | Re-run the consolidated RLS migration; PostgreSQL policies can be dropped with `drop policy "policy_name" on table;` |
| Storage bucket misconfigured | Delete and recreate bucket in dashboard; re-apply storage policies |
| Auth flow broken | Verify `handle_new_user()` trigger hasn't been disabled; check RLS on profiles table |

**Important**: Supabase preserves query history in the SQL Editor. If a migration step fails, you can inspect the history and re-run corrected statements.

---

## Security Corrections Summary

### 1. RLS Policy Consolidation
- **Before**: 26 embedded policies + 29 separate policies = potential conflicts, OR-combining of permissive policies
- **After**: 1 consolidated file with 48 policies, all explicitly scoped by user_roles org membership
- **Key fix**: Reviewer policies (`approval_stages_update_reviewer`, `compliance_findings_update_reviewer`) now check that the reviewer's organization matches the application's organization before allowing updates

### 2. Profile Auto-Creation (NEW)
- **Before**: No trigger — new users signing up had no profile row, breaking RBAC
- **After**: `handle_new_user()` trigger creates profile with `role = 'representative'` default
- **Key security**: Default role is never admin; admin assignment requires server-side `user_roles` insertion

### 3. Document Storage (NEW)
- **Before**: No bucket, no policies — documents referenced but no actual storage security
- **After**: Private `documents` bucket with org-aware upload/download policies
- **Key security**: No broad authenticated-user policies. Ownership (`owner = auth.uid()`) and organization membership (`user_roles.org_id match`) gates all access

### 4. Reviewer Policy Hardening (FIXED)
- **Before**: `approval_stages_update_reviewer` allowed any reviewer to update any stage
- **After**: `approval_stages_update_reviewer` checks `exists (select 1 from public.applications where id = application_id and organization_id in (select organization_id from public.user_roles where user_id = auth.uid()))`
- **Same fix applied to**: `compliance_findings_update_reviewer`

### 5. No Public Document Access
- **Before**: Risk of broad policies exposing all organizations' documents
- **After**: Download gated by `owner = auth.uid()` OR organization membership via application reference

---

## Supabase Dashboard Actions Required

| # | Action | Location |
|---|--------|----------|
| 1 | Run `20240101_initial_schema.sql` | SQL Editor |
| 2 | Run `20240101_consolidated_rls.sql` | SQL Editor |
| 3 | Run `20240101_profile_trigger.sql` | SQL Editor |
| 4 | Create `documents` bucket | Dashboard → Storage → New bucket |
| 5 | Run `20240101_storage_policies.sql` | SQL Editor |
| 6 | Verify auth flow works | localhost:5173 |
| 7 | Test dashboard KPIs from Supabase | localhost:5173 |

---

## Authentication Testing Instructions

1. **Sign up** with a new email address at `http://localhost:5173/signup` (or via SupAuth UI)
2. **Verify profile auto-creation**: Check Supabase dashboard → Table `public.profiles` — should have a row with `role = 'representative'`
3. **Sign in** — verify session persists (localStorage)
4. **Navigate to dashboard** — KPI cards should show real numbers from Supabase `vw_dashboard_kpis` view
5. **Test RBAC**: 
   - Representative user: sees only their organization's applications, documents, tasks
   - Admin user: can manage all data (verified via `user_roles` with role = 'admin')
6. **Upload document** — should apply `documents_upload_own` policy; verify in Supabase storage
7. **Sign out** — verify session clears, KPIs show empty/zero state

---

## Final Verification Checklist

- [ ] Vite build passes (`npx vite build`)
- [ ] Supabase project URL matches: `https://lsufwwymxgxjtmholnug.supabase.co`
- [ ] All 12 tables exist in public schema
- [ ] RLS is enabled on all 12 tables
- [ ] Exactly 1 consolidated RLS migration ran (not both embedded + separate)
- [ ] Profile auto-creation trigger works (new sign-up → profile row with role='representative')
- [ ] `documents` bucket created in Supabase dashboard (private, not public)
- [ ] Storage RLS policies applied for documents bucket
- [ ] Dashboard KPIs load from Supabase `vw_dashboard_kpis` view (not hardcoded)
- [ ] No browser console errors at any breakpoint
- [ ] Sidebar renders all 7 navigation groups correctly
- [ ] Document Assistant only appears at /document-verification route
- [ ] All 16 acceptance criteria verified visually

---

**WAITING FOR EXPLICIT APPROVAL before any SQL execution or Supabase resource changes.**

This document is read-only until you explicitly approve the migration sequence.