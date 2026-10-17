begin;

alter table public.scans
    add column if not exists image_path text,
    add column if not exists is_healthy boolean not null default false,
    add column if not exists top_candidates jsonb not null default '[]'::jsonb;

do $$
begin
    if exists (
        select 1
          from information_schema.columns
         where table_schema = 'public'
           and table_name = 'scans'
           and column_name = 'image_url'
    ) then
        execute $statement$
            update public.scans
               set image_path = image_url::text
             where image_path is null
               and image_url is not null
        $statement$;
    end if;
end
$$;

do $$
declare
    legacy_column text;
begin
    foreach legacy_column in array array[
        'image_url',
        'heatmap_url',
        'epistemic_uncertainty',
        'entropy',
        'is_out_of_distribution',
        'treatment_plan',
        'embedding'
    ]
    loop
        if exists (
            select 1
              from information_schema.columns
             where table_schema = 'public'
               and table_name = 'scans'
               and column_name = legacy_column
               and is_nullable = 'NO'
        ) then
            execute format(
                'alter table public.scans alter column %I drop not null',
                legacy_column
            );
        end if;
    end loop;
end
$$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'crop-scans',
    'crop-scans',
    false,
    10485760,
    array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
    name = excluded.name,
    public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Verdant users can upload crop scans" on storage.objects;
create policy "Verdant users can upload crop scans"
    on storage.objects for insert
    to authenticated
    with check (
        bucket_id = 'crop-scans'
        and (storage.foldername(name))[1] = (select auth.uid())::text
    );

drop policy if exists "Verdant users can read crop scans" on storage.objects;
create policy "Verdant users can read crop scans"
    on storage.objects for select
    to authenticated
    using (
        bucket_id = 'crop-scans'
        and (storage.foldername(name))[1] = (select auth.uid())::text
    );

drop policy if exists "Verdant users can delete crop scans" on storage.objects;
create policy "Verdant users can delete crop scans"
    on storage.objects for delete
    to authenticated
    using (
        bucket_id = 'crop-scans'
        and (storage.foldername(name))[1] = (select auth.uid())::text
    );

commit;
