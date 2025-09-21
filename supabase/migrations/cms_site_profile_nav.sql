-- Bucket para imágenes del sitio
insert into storage.buckets (id, name, public)
values ('site', 'site', true)
on conflict (id) do nothing;

create policy if not exists "public_read_site"
  on storage.objects for select
  to public
  using (bucket_id = 'site');

create policy if not exists "staff_upsert_site"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'site' and public.is_staff(auth.uid()));

create policy if not exists "staff_update_site"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'site' and public.is_staff(auth.uid()));

create policy if not exists "admin_delete_site"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'site' and exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));

-- Tabla de perfil del sitio
create table if not exists public.site_profile (
  id uuid primary key default gen_random_uuid(),
  name_es text,
  name_en text,
  role_es text,
  role_en text,
  university_es text,
  university_en text,
  avatar_url text,
  sidebar_avatar_url text,
  updated_at timestamptz default now()
);

alter table public.site_profile enable row level security;

create policy if not exists "site_profile_public_select"
  on public.site_profile for select using (true);

create policy if not exists "site_profile_staff_update"
  on public.site_profile for update
  using (public.is_staff(auth.uid()))
  with check (public.is_staff(auth.uid()));

create or replace function public.touch_site_profile()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists trg_touch_site_profile on public.site_profile;
create trigger trg_touch_site_profile
before update on public.site_profile
for each row execute procedure public.touch_site_profile();

-- Ai seed si no existe fila
insert into public.site_profile (name_es, role_es, university_es)
select 'Dr. Nombre Apellido', 'Profesor Investigador', 'Universidad Autónoma de Baja California'
where not exists (select 1 from public.site_profile);

-- Menú
create table if not exists public.nav_items (
  id uuid primary key default gen_random_uuid(),
  position int not null default 0,
  key text not null,
  label_es text not null,
  label_en text not null,
  href text not null,
  icon text not null,
  visible boolean default true
);

alter table public.nav_items enable row level security;

create index if not exists nav_items_pos_idx on public.nav_items(position);

create policy if not exists "nav_public_select" on public.nav_items for select using (true);
create policy if not exists "nav_staff_insert" on public.nav_items for insert with check (public.is_staff(auth.uid()));
create policy if not exists "nav_staff_update" on public.nav_items for update using (public.is_staff(auth.uid()));
create policy if not exists "nav_admin_delete" on public.nav_items for delete using (exists (
  select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'
));

-- Seed
insert into public.nav_items (position, key, label_es, label_en, href, icon)
select * from (
  values
    (1,'home','Inicio','Home','#/home','home'),
    (2,'eventos','Eventos','Events','#/eventos','calendar'),
    (3,'publicaciones','Publicaciones','Publications','#/publicaciones','book'),
    (4,'investigacion','Investigación','Research','#/investigacion','search'),
    (5,'docencia','Docencia','Teaching','#/docencia','book-open'),
    (6,'blog','Blog Académico','Academic Blog','#/blog','edit'),
    (7,'galeria','Galería','Gallery','#/galeria','image'),
    (8,'contacto','Contacto','Contact','#/contacto','mail')
) as t(position,key,label_es,label_en,href,icon)
where not exists (select 1 from public.nav_items);
