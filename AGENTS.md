<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Required SQL (run in Supabase SQL Editor)

```sql
-- Add view_count column if not exists
ALTER TABLE landing_pages ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload avatars (requires Supabase Auth)
CREATE POLICY "Avatar Upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars');

-- Allow authenticated users to update their avatar
CREATE POLICY "Avatar Update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars');

-- Allow public read access to avatars
CREATE POLICY "Avatar Public Read" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'avatars');
```
<!-- END:nextjs-agent-rules -->
