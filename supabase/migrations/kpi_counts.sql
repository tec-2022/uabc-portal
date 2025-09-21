-- RPC for dashboard KPIs (America/Tijuana aware)
create or replace function public.kpi_counts()
returns json
language sql
stable
as $$
  with tz as (select now() at time zone 'America/Tijuana' as now_tj)
  select json_build_object(
    'publications',      (select count(*) from public.publications),
    'events_upcoming',   (select count(*) from public.events, tz where starts_at >= tz.now_tj),
    'events_past',       (select count(*) from public.events, tz where starts_at <  tz.now_tj),
    'blog_published',    (select count(*) from public.blog_posts where status='published'),
    'albums',            (select count(*) from public.gallery_albums),
    'photos',            (select count(*) from public.gallery_images),
    'projects_active',   (select count(*) from public.research_projects where is_active is true),
    'members',           (select count(*) from public.research_members),
    'courses_active',    (select count(*) from public.courses where is_active is true)
  );
$$;
