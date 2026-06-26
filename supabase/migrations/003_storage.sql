-- Storage: 제출 파일(private) + 양식 다운로드(public)
-- Supabase Dashboard > SQL Editor 에서 실행

-- 제출 파일 (Edge Function service_role만 업로드)
insert into storage.buckets (id, name, public, file_size_limit)
values ('submissions-2026', 'submissions-2026', false, 10485760)
on conflict (id) do nothing;

-- 접수 양식 다운로드 (공개 읽기)
insert into storage.buckets (id, name, public, file_size_limit)
values ('form-templates', 'form-templates', true, 52428800)
on conflict (id) do nothing;

-- form-templates: 누구나 읽기
create policy "public_read_templates"
  on storage.objects for select
  using (bucket_id = 'form-templates');
