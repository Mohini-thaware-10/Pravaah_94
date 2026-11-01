-- PRAVAAH Document Storage Bucket Policies
-- Prerequisite: Create a private bucket named "documents" in the Supabase dashboard
-- (Storage → Buckets → New bucket → Name: documents → Public bucket: No)
-- Then run these policies via the Supabase SQL Editor.

-- ============================================================
-- UPLOAD POLICY: Users can upload documents to their own applications
-- Only authenticated users. Validates application ownership.
-- ============================================================

create policy "documents_upload_own"
  on storage.objects for insert
  with check (
    bucket_id = 'documents'
    and auth.role() = 'authenticated'
    and exists (
      select 1 from public.applications
      where id = storage.foldername(key)[1]::uuid  -- application_id from upload path
      and (
        user_id = auth.uid()
        or exists (
          select 1 from public.user_roles
          where user_id = auth.uid()
          and organization_id = public.applications.organization_id
        )
      )
    )
  );

-- ============================================================
-- DOWNLOAD POLICY: Users can download documents they own or org members can access
-- Organization-aware: users can download docs from their own org's applications
-- ============================================================

create policy "documents_download_org"
  on storage.objects for select
  using (
    bucket_id = 'documents'
    and auth.role() = 'authenticated'
    and (
      -- Owner can always download
      owner = auth.uid()
      -- Or user has a role in the application's organization
      or exists (
        select 1 from public.applications
        where id = storage.foldername(key)[1]::uuid
        and (
          user_id = auth.uid()
          or exists (
            select 1 from public.user_roles
            where user_id = auth.uid()
            and organization_id = public.applications.organization_id
          )
        )
      )
    )
  );

-- ============================================================
-- ADMIN POLICY: Admins can manage all documents in the bucket
-- ============================================================

create policy "documents_all_admin"
  on storage.objects for all
  using (
    bucket_id = 'documents'
    and exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  )
  with check (
    bucket_id = 'documents'
    and exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  );

-- ============================================================
-- FILE SIZE AND MIME TYPE RESTRICTIONS
-- These are typically set via the Supabase dashboard bucket settings,
-- but can also be enforced at the application level.
-- The policies below guard against unauthorized access regardless.
-- ============================================================

-- Comment: Supabase dashboard bucket settings should have:
-- - Maximum file size: 10MB (adjust as needed)
-- - Allowed MIME types: application/pdf, image/*, application/msword,
--   application/vnd.openxmlformats-officedocument.*,
--   application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
--   application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation
-- - Public bucket: No (private bucket)

-- ============================================================
-- HELPING FUNCTION: Extract application_id from upload path
-- Supabase storage foldername(key) returns path parts separated by /
-- If files are stored as: {application_id}/{filename}, then foldername(key)[1] = application_id
-- Adjust index if your path structure differs.
-- ============================================================