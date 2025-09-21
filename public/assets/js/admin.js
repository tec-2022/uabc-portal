// ===========================
    //  ESQUEMA SUGERIDO (Supabase)
    // ===========================
    // Tablas con RLS (owner/admin):
    // posts(id uuid, title text, category text, content text, tags text[], status text, created_at timestamptz default now(), author uuid)
    // events(id uuid, title text, date timestamptz, location text, desc text, created_at timestamptz default now())
    // publications(id uuid, title text, year int, venue text, link text, authors text, created_at timestamptz default now())
    // research_projects(id uuid, title text, status text, lead text, desc text, created_at timestamptz default now())
    // courses(id uuid, title text, code text, modality text, desc text, created_at timestamptz default now())
    // blog_posts(id uuid, title text, body text, cover text, created_at timestamptz default now(), status text)
    // messages(id uuid, name text, email text, subject text, body text, status text default 'new', starred bool default false, created_at timestamptz default now())
    // profiles(id uuid primary key references auth.users, full_name text, role text default 'editor', active bool default true, avatar_url text)
    // Storage: bucket 'media' (público). Paths libres (ej: userId/filename)

    // RLS idea:
    // - Lectura pública donde aplique (p.ej. posts published desde index), pero en admin: permitir CRUD solo si auth.role='authenticated' y profile.role='admin' o 'editor' según acción.
    // - messages: solo admin puede leer/actualizar.

    AOS.init({ duration:600, once:true });
    feather.replace();

    // ========= Helpers
    const $ = (s,ctx=document)=>ctx.querySelector(s);
    const $$ = (s,ctx=document)=>Array.from(ctx.querySelectorAll(s));
    const toast = (msg,type='ok')=>{
      const el=document.createElement('div');
      el.className='fixed bottom-6 right-6 z-[60] bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 shadow-lg';
      el.textContent=msg;
      document.body.appendChild(el);
      setTimeout(()=>el.remove(), 2400);
    };

    // ========= Env + Supabase
    const { SUPABASE_URL, SUPABASE_ANON_KEY } = (window.__ENV||{});
    if(!SUPABASE_URL || !SUPABASE_ANON_KEY){
      alert('Faltan variables SUPABASE_URL / SUPABASE_ANON_KEY. Crea public/env.js.');
    }
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      global: { headers: { 'x-client-info':'uabc-admin' } }
    });

    // ========= Auth UI
    const authModal = $('#auth-modal');
    $('#auth-login').addEventListener('click', async ()=>{
      $('#auth-error').textContent='';
      const email = $('#auth-email').value.trim();
      const password = $('#auth-password').value;
      if(!email || !password){ $('#auth-error').textContent='Completa correo y contraseña.'; return; }
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if(error){ $('#auth-error').textContent = error.message; return; }
      await afterLogin();
    });
    $('#btn-logout').addEventListener('click', async ()=>{
      await supabase.auth.signOut();
      location.reload();
    });

    supabase.auth.onAuthStateChange(async (ev) => {
      if(ev === 'SIGNED_OUT'){ authModal.classList.remove('hidden'); }
      if(ev === 'SIGNED_IN'){ await afterLogin(); }
    });

    async function afterLogin(){
      const { data:{ user } } = await supabase.auth.getUser();
      if(!user){ return authModal.classList.remove('hidden'); }
      // Cargar perfil + check rol
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      const fullName = profile?.full_name || user.email;
      const role = profile?.role || 'editor';
      $('#topbar-name').textContent = fullName;
      $('#topbar-role').textContent = (role==='admin'?'Administrador': (role==='editor'?'Editor':'Estudiante'));
      if(profile?.avatar_url) $('#topbar-avatar').src = profile.avatar_url;
      // Solo admin puede entrar aquí
      if(role!=='admin' && role!=='editor'){
        $('#auth-error').textContent = 'Acceso restringido. Necesitas rol de administrador/editor.';
        await supabase.auth.signOut(); return;
      }
      authModal.classList.add('hidden');
      startApp();
    }

    // ========= Navegación
    const SECTION_MAP = {
      dashboard: 'dashboard-section',
      content: 'content-section',
      media: 'media-section',
      events: 'events-section',
      publications: 'publications-section',
      research: 'research-section',
      courses: 'courses-section',
      blog: 'blog-section',
      messages: 'messages-section',
      users: 'users-section',
      settings: 'settings-section'
    };
    function showSection(key){
      $$('main > section').forEach(s=>s.classList.add('hidden'));
      const id = SECTION_MAP[key] || 'dashboard-section';
      const section = document.getElementById(id);
      if(section) section.classList.remove('hidden');
      $$('#sidebar-nav a').forEach(a=>a.classList.remove('bg-white/10','text-accent-300'));
      const activeLink = $(`#sidebar-nav a[href="#${key}"]`); if(activeLink) activeLink.classList.add('bg-white/10','text-accent-300');
      $('#breadcrumb').textContent = key[0].toUpperCase()+key.slice(1);
      window.scrollTo({ top:0, behavior:'smooth' });
    }
    $$('#sidebar-nav a').forEach(link=>{
      link.addEventListener('click', (e)=>{
        e.preventDefault();
        const target = link.getAttribute('href').replace('#','');
        showSection(target);
        history.replaceState(null,'',`#${target}`);
      });
    });

    window.addEventListener('load', async ()=>{
      const { data:{ session } } = await supabase.auth.getSession();
      if(!session){ authModal.classList.remove('hidden'); }
      else{ await afterLogin(); }
      const key = location.hash.replace('#','') || 'dashboard';
      showSection(key);
    });

    // ========= Dashboard
    async function loadDashboard(){
      const monthRangeStart = new Date(new Date().getFullYear(), new Date().getMonth()-5, 1).toISOString();
      const [postsRes, eventsRes, coursesRes, unreadRes, postsRecentRes] = await Promise.all([
        supabase.from('posts').select('id', { count:'exact', head:true }).eq('status','Published'),
        supabase.from('events').select('id', { count:'exact', head:true }),
        supabase.from('courses').select('id', { count:'exact', head:true }),
        supabase.from('messages').select('id', { count:'exact', head:true }).eq('status','new'),
        supabase.from('posts').select('id, created_at').gte('created_at', monthRangeStart).order('created_at')
      ]);
      $('#stats-posts').textContent = postsRes.count||0;
      $('#stats-events').textContent = eventsRes.count||0;
      $('#stats-courses').textContent = coursesRes.count||0;
      $('#stats-unread').textContent = unreadRes.count||0;
      const badge = $('#badge-unread'); const dot = $('#notif-dot');
      if((unreadRes.count||0)>0){ badge.classList.remove('hidden'); badge.textContent = unreadRes.count; dot.classList.remove('hidden'); } else { badge.classList.add('hidden'); dot.classList.add('hidden'); }

      // Distribución
      $('#dist-posts').textContent = postsRes.count||0;
      $('#dist-events').textContent = eventsRes.count||0;
      $('#dist-courses').textContent = coursesRes.count||0;

      // Barras por mes (últimos 6)
      const months = [];
      const counts = new Array(6).fill(0);
      const now = new Date();
      for(let i=5;i>=0;i--){
        const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
        months.push(d.toLocaleString(undefined,{ month:'short'}));
      }
      postsRecentRes.data?.forEach(row=>{
        const d = new Date(row.created_at);
        const diff = (now.getFullYear()-d.getFullYear())*12 + (now.getMonth()-d.getMonth());
        if(diff>=0 && diff<6){ counts[5-diff]++; }
      });
      const chart = $('#chart-posts'); chart.innerHTML='';
      const max = Math.max(1, ...counts);
      counts.forEach(c=>{
        const h = 10 + Math.round((c/max)*90);
        const bar = document.createElement('div');
        bar.className='flex-1 bg-primary-600 rounded-t'; bar.style.height = h+'%';
        chart.appendChild(bar);
      });
      const labels = $('#chart-posts-labels'); labels.innerHTML = months.map(m=>`<span>${m}</span>`).join('');

      // Actividad reciente: 5 últimos registros de varias tablas
      const [recentPosts, recentEvents, recentMsgs] = await Promise.all([
        supabase.from('posts').select('title, created_at').order('created_at',{ascending:false}).limit(5),
        supabase.from('events').select('title, created_at').order('created_at',{ascending:false}).limit(5),
        supabase.from('messages').select('subject, created_at, status').order('created_at',{ascending:false}).limit(5)
      ]);
      const box = $('#recent-activities'); box.innerHTML='';
      const addItem = (icon, text, when)=> {
        const li=document.createElement('li');
        li.className='p-4 bg-slate-800/60 rounded flex gap-3 items-start';
        li.innerHTML=`<div class="p-2 bg-accent-500 rounded"><i data-feather="${icon}" class="w-4 h-4 text-slate-900"></i></div>
          <div class="flex-1"><p class="font-medium">${text}</p><p class="text-sm text-slate-400">${new Date(when).toLocaleString()}</p></div>`;
        box.appendChild(li);
      };
      recentPosts.data?.forEach(p=> addItem('file-text', `Publicación: "${p.title}"`, p.created_at));
      recentEvents.data?.forEach(e=> addItem('calendar', `Evento: "${e.title}"`, e.created_at));
      recentMsgs.data?.forEach(m=> addItem('inbox', `Mensaje: "${m.subject}" (${m.status})`, m.created_at));
      feather.replace();
    }

    // ========= Contenido (posts)
    async function renderPosts(filter=''){
      const { data, error } = await supabase.from('posts').select('*').order('created_at',{ascending:false});
      const tbody = $('#posts-tbody'); if(error){ tbody.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-red-400">${error.message}</td></tr>`; return; }
      const rows = (data||[]).filter(p => (p.title+' '+(p.category||'')+' '+(p.status||'')).toLowerCase().includes(filter.toLowerCase()))
        .map(p=>`<tr>
          <td class="p-4">${p.title}</td>
          <td class="p-4"><span class="tag px-2 py-1 rounded text-xs">${p.category||'-'}</span></td>
          <td class="p-4"><span class="${p.status==='Published'?'text-green-400':'text-yellow-400'}">${p.status||'-'}</span></td>
          <td class="p-4">${new Date(p.created_at).toLocaleDateString()}</td>
          <td class="p-4">
            <div class="flex gap-2">
              <button data-edit="${p.id}" class="text-blue-400 hover:text-blue-300" title="Editar"><i data-feather="edit" class="w-4 h-4"></i></button>
              <button data-del="${p.id}" class="text-red-400 hover:text-red-300" title="Eliminar"><i data-feather="trash-2" class="w-4 h-4"></i></button>
            </div>
          </td>
        </tr>`).join('');
      tbody.innerHTML = rows || `<tr><td colspan="5" class="p-6 text-center text-slate-400">Sin contenidos.</td></tr>`;
      feather.replace();
    }
    async function savePost(status){
      const id=$('#post-id').value||null;
      const title=$('#post-title').value.trim(); if(!title){ return alert('Coloca un título.'); }
      const category=$('#post-category').value;
      const content=$('#post-content').value.trim();
      const tags=($('#post-tags').value||'').split(',').map(s=>s.trim()).filter(Boolean);
      if(id){
        const { error } = await supabase.from('posts').update({ title, category, content, tags, status }).eq('id', id);
        if(error) return alert(error.message);
      }else{
        const { error } = await supabase.from('posts').insert({ title, category, content, tags, status });
        if(error) return alert(error.message);
      }
      $('#post-id').value=''; $('#post-title').value=''; $('#post-category').value=''; $('#post-tags').value=''; $('#post-content').value='';
      toast('Guardado'); renderPosts(); loadDashboard();
    }
    $('#btn-draft').addEventListener('click', ()=> savePost('Draft'));
    $('#btn-publish').addEventListener('click', ()=> savePost('Published'));
    $('#search-posts').addEventListener('input', (e)=> renderPosts(e.target.value));
    $('#posts-tbody').addEventListener('click', async (e)=>{
      const del = e.target.closest('button[data-del]'); const ed = e.target.closest('button[data-edit]');
      if(del){ if(!confirm('¿Eliminar?')) return; const { error } = await supabase.from('posts').delete().eq('id', del.dataset.del); if(error) alert(error.message); renderPosts(); loadDashboard(); }
      if(ed){ const { data } = await supabase.from('posts').select('*').eq('id', ed.dataset.edit).maybeSingle(); if(!data) return;
        $('#post-id').value=data.id; $('#post-title').value=data.title; $('#post-category').value=data.category||''; $('#post-tags').value=(data.tags||[]).join(', '); $('#post-content').value=data.content||''; showSection('content');
      }
    });

    // ========= Multimedia (Storage)
    let uploadFiles = [];
    $('#btn-select-files').addEventListener('click', ()=> $('#file-input').click());
    $('#upload-area').addEventListener('click', ()=> $('#file-input').click());
    $('#file-input').addEventListener('change', (e)=>{ uploadFiles = Array.from(e.target.files||[]); $('#upload-info').textContent = uploadFiles.length? `${uploadFiles.length} archivo(s) listos.` : ''; });
    $('#btn-upload-files').addEventListener('click', async ()=>{
      if(!uploadFiles.length) return;
      const { data:{ user } } = await supabase.auth.getUser();
      const bucket = supabase.storage.from('media');
      for(const f of uploadFiles){
        const ext = f.name.split('.').pop(); const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await bucket.upload(path, f, { upsert:false });
        if(error){ alert(error.message); return; }
      }
      uploadFiles=[]; $('#file-input').value=''; $('#upload-info').textContent='Subida completa.';
      renderMedia(); loadMediaStats();
    });

    async function listMedia(){
      const { data:{ user } } = await supabase.auth.getUser();
      const bucket = supabase.storage.from('media');
      // list recursively (prefix user.id)
      const { data: files, error } = await bucket.list(user.id, { limit: 100, offset: 0, sortBy:{column:'created_at', order:'desc'} });
      if(error && error.message.includes('not found')) return [];
      return files||[];
    }
    async function renderMedia(){
      const filter = $('#media-filter').value; const q = ($('#media-search').value||'').toLowerCase();
      const grid = $('#media-grid'); grid.innerHTML = '<p class="text-slate-400">Cargando...</p>';
      const files = await listMedia();
      const items = files.map(f=>{
        const ext = (f.name.split('.').pop()||'').toLowerCase();
        const type = ['jpg','jpeg','png','gif','webp','svg','bmp','avif'].includes(ext)?'image': (['mp4','mov','avi','webm'].includes(ext)?'video':'document');
        return {...f, type };
      }).filter(m=> (filter==='all' || m.type===filter) && (m.name.toLowerCase().includes(q)));
      if(items.length===0){ grid.innerHTML = '<p class="text-slate-400">Sin archivos.</p>'; return; }
      const bucket = supabase.storage.from('media');
      const cards = await Promise.all(items.map(async (m,i)=>{
        const { data } = bucket.getPublicUrl(`${m.id? m.id: ''}`); // fallback; we will build path manually
        // m has name only; full path is userId/name. We don't have prefix returned here; build manual url:
      }));
      // Build with signed URLs (valid 1 día) para bucket privado; si lo configuraste público puedes usar getPublicUrl.
      const { data:{ user } } = await supabase.auth.getUser();
      const bucketRef = supabase.storage.from('media');
      const fragments = await Promise.all(items.map(async (m, i)=>{
        const path = `${user.id}/${m.name}`;
        let url = '';
        try{
          const { data } = await bucketRef.createSignedUrl(path, 60*60*24);
          url = data?.signedUrl || '';
        }catch(e){ /* ignore */ }
        const isImg = m.type==='image';
        return `<div class="relative group">
          ${isImg ? `<img src="${url}" alt="${m.name}" class="w-full h-24 object-cover rounded-lg">`
                  : `<div class="w-full h-24 bg-slate-700 rounded-lg flex items-center justify-center"><i data-feather="${m.type==='video'?'film':'file-text'}" class="w-8 h-8 text-accent-500"></i></div>`}
          <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
            ${url? `<a href="${url}" target="_blank" class="p-1 bg-white/20 rounded hover:bg-white/30"><i data-feather="eye" class="w-4 h-4"></i></a>`:''}
            <button data-delm="${path}" class="p-1 bg-red-500/80 rounded hover:bg-red-600"><i data-feather="trash-2" class="w-4 h-4"></i></button>
          </div>
          <p class="text-xs text-slate-400 mt-1 truncate" title="${m.name}">${m.name}</p>
        </div>`;
      }));
      grid.innerHTML = fragments.join('');
      feather.replace();
    }
    $('#media-filter').addEventListener('change', renderMedia);
    $('#media-search').addEventListener('input', renderMedia);
    $('#media-grid').addEventListener('click', async (e)=>{
      const del = e.target.closest('button[data-delm]');
      if(!del) return;
      if(!confirm('¿Eliminar archivo?')) return;
      const path = del.dataset.delm;
      const { error } = await supabase.storage.from('media').remove([path]);
      if(error) alert(error.message);
      renderMedia(); loadMediaStats();
    });
    async function loadMediaStats(){
      const files = await listMedia();
      $('#media-total').textContent = files.length;
      const sizes = files.map(f=> f.metadata?.size || 0);
      const totalMB = (sizes.reduce((a,b)=>a+b,0)/1024/1024).toFixed(1);
      $('#media-space').textContent = `${totalMB} MB`;
      const thisMonth = new Date().getMonth();
      $('#media-month').textContent = files.filter(f=> (new Date(f.created_at)).getMonth() === thisMonth).length;
      const exts = {}; files.forEach(f=>{ const e=(f.name.split('.').pop()||'').toUpperCase(); exts[e]=(exts[e]||0)+1; });
      const top = Object.entries(exts).sort((a,b)=>b[1]-a[1])[0];
      $('#media-top').textContent = top? top[0] : '–';
    }

    // ========= Eventos
    async function renderEvents(filter=''){
      const { data } = await supabase.from('events').select('*').order('date');
      const rows = (data||[]).filter(e=> (e.title+' '+(e.location||'')).toLowerCase().includes(filter.toLowerCase()))
        .map(e=>`<tr>
          <td class="p-4">${new Date(e.date).toLocaleString()}</td>
          <td class="p-4">${e.title}</td>
          <td class="p-4">${e.location||'-'}</td>
          <td class="p-4">
            <div class="flex gap-2">
              <button data-evedit="${e.id}" class="text-blue-400 hover:text-blue-300"><i data-feather="edit" class="w-4 h-4"></i></button>
              <button data-evdel="${e.id}" class="text-red-400 hover:text-red-300"><i data-feather="trash-2" class="w-4 h-4"></i></button>
            </div>
          </td>
        </tr>`).join('');
      $('#ev-tbody').innerHTML = rows || `<tr><td colspan="4" class="p-6 text-center text-slate-400">Sin eventos.</td></tr>`;
      feather.replace();
      renderCalendar();
    }
    async function renderCalendar(){
      const cal = $('#ev-calendar'); cal.innerHTML='';
      const now = new Date();
      const { data } = await supabase.from('events').select('date').gte('date', new Date(now.getFullYear(),now.getMonth(),now.getDate()).toISOString()).lte('date', new Date(now.getFullYear(),now.getMonth(),now.getDate()+13).toISOString());
      for(let i=0;i<14;i++){
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate()+i);
        const count = (data||[]).filter(e=> new Date(e.date).toDateString()===d.toDateString()).length;
        const cell=document.createElement('div'); cell.className='p-3 bg-slate-800 rounded text-sm';
        cell.innerHTML = `<div class="font-semibold">${d.toLocaleDateString(undefined,{weekday:'short'})}</div><div class="text-xl">${d.getDate()}</div><div class="text-xs text-slate-400">${count} ev.</div>`;
        cal.appendChild(cell);
      }
    }
    $('#ev-save').addEventListener('click', async ()=>{
      const id=$('#ev-id').value||null; const title=$('#ev-title').value.trim(); const date=new Date($('#ev-date').value).toISOString();
      if(!title || !date){ return alert('Título y fecha son obligatorios.'); }
      const payload = { title, date, location:$('#ev-location').value.trim(), desc:$('#ev-desc').value.trim() };
      let error;
      if(id){ ({ error } = await supabase.from('events').update(payload).eq('id', id)); }
      else{ ({ error } = await supabase.from('events').insert(payload)); }
      if(error) return alert(error.message);
      $('#ev-id').value=''; $('#ev-title').value=''; $('#ev-date').value=''; $('#ev-location').value=''; $('#ev-desc').value='';
      renderEvents(); loadDashboard();
    });
    $('#ev-clear').addEventListener('click', ()=>{ $('#ev-id').value=''; $('#ev-title').value=''; $('#ev-date').value=''; $('#ev-location').value=''; $('#ev-desc').value=''; });
    $('#ev-search').addEventListener('input', (e)=> renderEvents(e.target.value));
    $('#ev-table').addEventListener('click', async (e)=>{
      const del=e.target.closest('button[data-evdel]'); const ed=e.target.closest('button[data-evedit]');
      if(del){ if(!confirm('¿Eliminar evento?')) return; const { error } = await supabase.from('events').delete().eq('id', del.dataset.evdel); if(error) alert(error.message); renderEvents(); loadDashboard(); }
      if(ed){ const { data } = await supabase.from('events').select('*').eq('id', ed.dataset.evedit).maybeSingle(); if(!data) return; $('#ev-id').value=data.id; $('#ev-title').value=data.title; $('#ev-date').value=new Date(data.date).toISOString().slice(0,16); $('#ev-location').value=data.location||''; $('#ev-desc').value=data.desc||''; showSection('events'); }
    });

    // ========= Publicaciones académicas
    async function renderPubs(filter=''){
      const { data } = await supabase.from('publications').select('*').order('year',{ascending:false});
      $('#pub-list').innerHTML = (data||[]).filter(p=>(p.title+' '+(p.venue||'')+' '+(p.authors||'')).toLowerCase().includes(filter.toLowerCase()))
        .map(p=>`<li class="p-4 bg-slate-800/60 rounded flex items-start gap-3">
          <div class="p-2 bg-accent-500 rounded"><i data-feather="book-open" class="w-4 h-4 text-slate-900"></i></div>
          <div class="flex-1">
            <p class="font-semibold">${p.title} <span class="text-slate-400">(${p.year||'—'})</span></p>
            <p class="text-sm text-slate-300">${p.authors||''}</p>
            <p class="text-sm text-slate-400">${p.venue||''}${p.link?` — <a href="${p.link}" target="_blank" class="underline">Enlace</a>`:''}</p>
          </div>
          <div class="flex gap-2">
            <button data-pubedit="${p.id}" class="text-blue-400 hover:text-blue-300"><i data-feather="edit" class="w-4 h-4"></i></button>
            <button data-pubdel="${p.id}" class="text-red-400 hover:text-red-300"><i data-feather="trash-2" class="w-4 h-4"></i></button>
          </div>
        </li>`).join('') || '<p class="text-slate-400">Sin publicaciones.</p>';
      feather.replace();
    }
    $('#pub-save').addEventListener('click', async ()=>{
      const id=$('#pub-id').value||null;
      const payload = { title:$('#pub-title').value.trim(), year:+$('#pub-year').value||null, venue:$('#pub-venue').value.trim(), link:$('#pub-link').value.trim(), authors:$('#pub-authors').value.trim() };
      if(!payload.title || !payload.year) return alert('Título y año obligatorios.');
      let error; if(id){ ({ error } = await supabase.from('publications').update(payload).eq('id', id)); } else { ({ error } = await supabase.from('publications').insert(payload)); }
      if(error) return alert(error.message);
      $('#pub-id').value=''; $('#pub-title').value=''; $('#pub-year').value=''; $('#pub-venue').value=''; $('#pub-link').value=''; $('#pub-authors').value='';
      renderPubs();
    });
    $('#pub-clear').addEventListener('click', ()=>{ $('#pub-id').value=''; $('#pub-title').value=''; $('#pub-year').value=''; $('#pub-venue').value=''; $('#pub-link').value=''; $('#pub-authors').value=''; });
    $('#pub-search').addEventListener('input', (e)=> renderPubs(e.target.value));
    $('#publications-section').addEventListener('click', async (e)=>{
      const del=e.target.closest('button[data-pubdel]'); const ed=e.target.closest('button[data-pubedit]');
      if(del){ if(!confirm('¿Eliminar?')) return; const { error } = await supabase.from('publications').delete().eq('id', del.dataset.pubdel); if(error) alert(error.message); renderPubs(); }
      if(ed){ const { data } = await supabase.from('publications').select('*').eq('id', ed.dataset.pubedit).maybeSingle(); if(!data) return;
        $('#pub-id').value=data.id; $('#pub-title').value=data.title; $('#pub-year').value=data.year||''; $('#pub-venue').value=data.venue||''; $('#pub-link').value=data.link||''; $('#pub-authors').value=data.authors||''; }
    });

    // ========= Investigación
    async function renderRes(){
      const { data } = await supabase.from('research_projects').select('*').order('created_at',{ascending:false});
      $('#res-grid').innerHTML = (data||[]).map(r=>`<div class="p-4 bg-slate-800/60 rounded">
        <div class="flex items-center justify-between mb-2"><h4 class="font-semibold">${r.title}</h4><span class="text-xs px-2 py-1 rounded bg-slate-700">${r.status}</span></div>
        <p class="text-sm text-slate-300 mb-2">${r.desc||''}</p>
        <p class="text-xs text-slate-400">Responsable: ${r.lead||'-'}</p>
        <div class="mt-3 flex gap-2">
          <button data-resedit="${r.id}" class="text-blue-400 hover:text-blue-300"><i data-feather="edit" class="w-4 h-4"></i></button>
          <button data-resdel="${r.id}" class="text-red-400 hover:text-red-300"><i data-feather="trash-2" class="w-4 h-4"></i></button>
        </div>
      </div>`).join('') || '<p class="text-slate-400">Agrega tu primer proyecto.</p>';
      feather.replace();
    }
    $('#res-save').addEventListener('click', async ()=>{
      const id=$('#res-id').value||null;
      const payload = { title:$('#res-title').value.trim(), status:$('#res-status').value, lead:$('#res-lead').value.trim(), desc:$('#res-desc').value.trim() };
      if(!payload.title) return alert('Título requerido.');
      let error; if(id){ ({ error } = await supabase.from('research_projects').update(payload).eq('id', id)); } else { ({ error } = await supabase.from('research_projects').insert(payload)); }
      if(error) return alert(error.message);
      $('#res-id').value=''; $('#res-title').value=''; $('#res-lead').value=''; $('#res-desc').value='';
      renderRes();
    });
    $('#res-clear').addEventListener('click', ()=>{ $('#res-id').value=''; $('#res-title').value=''; $('#res-lead').value=''; $('#res-desc').value=''; });
    $('#research-section').addEventListener('click', async (e)=>{
      const del=e.target.closest('button[data-resdel]'); const ed=e.target.closest('button[data-resedit]');
      if(del){ if(!confirm('¿Eliminar?')) return; const { error } = await supabase.from('research_projects').delete().eq('id', del.dataset.resdel); if(error) alert(error.message); renderRes(); }
      if(ed){ const { data } = await supabase.from('research_projects').select('*').eq('id', ed.dataset.resedit).maybeSingle(); if(!data) return;
        $('#res-id').value=data.id; $('#res-title').value=data.title; $('#res-status').value=data.status||'En curso'; $('#res-lead').value=data.lead||''; $('#res-desc').value=data.desc||''; showSection('research'); }
    });

    // ========= Cursos
    async function renderCourses(){
      const { data } = await supabase.from('courses').select('*').order('created_at',{ascending:false});
      $('#crs-grid').innerHTML = (data||[]).map(c=>`<div class="p-4 bg-slate-800/60 rounded">
        <div class="flex items-center justify-between mb-1"><h4 class="font-semibold">${c.title}</h4><span class="text-xs px-2 py-1 rounded bg-slate-700">${c.modality}</span></div>
        <p class="text-sm text-slate-300">${c.desc||''}</p>
        <p class="text-xs text-slate-400 mt-2">Clave: ${c.code||'-'}</p>
        <div class="mt-3 flex gap-2">
          <button data-crsedit="${c.id}" class="text-blue-400 hover:text-blue-300"><i data-feather="edit" class="w-4 h-4"></i></button>
          <button data-crsdel="${c.id}" class="text-red-400 hover:text-red-300"><i data-feather="trash-2" class="w-4 h-4"></i></button>
        </div>
      </div>`).join('') || '<p class="text-slate-400">Aún no hay cursos.</p>';
      feather.replace();
    }
    $('#crs-save').addEventListener('click', async ()=>{
      const id=$('#crs-id').value||null;
      const payload = { title:$('#crs-title').value.trim(), code:$('#crs-code').value.trim(), modality:$('#crs-modality').value, desc:$('#crs-desc').value.trim() };
      if(!payload.title) return alert('Nombre del curso requerido.');
      let error; if(id){ ({ error } = await supabase.from('courses').update(payload).eq('id', id)); } else { ({ error } = await supabase.from('courses').insert(payload)); }
      if(error) return alert(error.message);
      $('#crs-id').value=''; $('#crs-title').value=''; $('#crs-code').value=''; $('#crs-desc').value='';
      renderCourses();
    });
    $('#crs-clear').addEventListener('click', ()=>{ $('#crs-id').value=''; $('#crs-title').value=''; $('#crs-code').value=''; $('#crs-desc').value=''; });
    $('#courses-section').addEventListener('click', async (e)=>{
      const del=e.target.closest('button[data-crsdel]'); const ed=e.target.closest('button[data-crsedit]');
      if(del){ if(!confirm('¿Eliminar?')) return; const { error } = await supabase.from('courses').delete().eq('id', del.dataset.crsdel); if(error) alert(error.message); renderCourses(); }
      if(ed){ const { data } = await supabase.from('courses').select('*').eq('id', ed.dataset.crsedit).maybeSingle(); if(!data) return;
        $('#crs-id').value=data.id; $('#crs-title').value=data.title; $('#crs-code').value=data.code||''; $('#crs-modality').value=data.modality||'Presencial'; $('#crs-desc').value=data.desc||''; showSection('courses'); }
    });

    // ========= Blog
    async function renderBlog(){
      const { data } = await supabase.from('blog_posts').select('*').order('created_at',{ascending:false});
      $('#blog-list').innerHTML = (data||[]).map((b,i)=>`<article class="p-4 bg-slate-800/60 rounded flex gap-4">
        <img src="${b.cover||'https://picsum.photos/seed/'+i+'/160/100'}" class="w-40 h-24 object-cover rounded" alt="cover"/>
        <div class="flex-1">
          <h4 class="font-semibold">${b.title}</h4>
          <p class="text-sm text-slate-300">${b.body||''}</p>
          <div class="mt-2 flex gap-2 text-xs text-slate-400">
            <span>${new Date(b.created_at).toLocaleDateString()}</span>
            <button data-bedit="${b.id}" class="text-blue-400 hover:text-blue-300">Editar</button>
            <button data-bdel="${b.id}" class="text-red-400 hover:text-red-300">Eliminar</button>
          </div>
        </div>
      </article>`).join('') || '<p class="text-slate-400">Sin entradas.</p>';
    }
    $('#blog-save').addEventListener('click', async ()=>{
      const id=$('#blog-id').value||null;
      const payload = { title:$('#blog-title').value.trim(), body:$('#blog-body').value.trim(), cover:$('#blog-cover').value.trim(), status:'Published' };
      if(!payload.title || !payload.body) return alert('Título y contenido requeridos.');
      let error; if(id){ ({ error } = await supabase.from('blog_posts').update(payload).eq('id', id)); } else { ({ error } = await supabase.from('blog_posts').insert(payload)); }
      if(error) return alert(error.message);
      $('#blog-id').value=''; $('#blog-title').value=''; $('#blog-body').value=''; $('#blog-cover').value='';
      renderBlog();
    });
    $('#blog-clear').addEventListener('click', ()=>{ $('#blog-id').value=''; $('#blog-title').value=''; $('#blog-body').value=''; $('#blog-cover').value=''; });
    $('#blog-section').addEventListener('click', async (e)=>{
      const del=e.target.closest('button[data-bdel]'); const ed=e.target.closest('button[data-bedit]');
      if(del){ if(!confirm('¿Eliminar entrada?')) return; const { error } = await supabase.from('blog_posts').delete().eq('id', del.dataset.bdel); if(error) alert(error.message); renderBlog(); }
      if(ed){ const { data } = await supabase.from('blog_posts').select('*').eq('id', ed.dataset.bedit).maybeSingle(); if(!data) return;
        $('#blog-id').value=data.id; $('#blog-title').value=data.title; $('#blog-cover').value=data.cover||''; $('#blog-body').value=data.body||''; showSection('blog'); }
    });

    // ========= Mensajes (Contacto)
    async function renderMessages(){
      const filter = $('#msg-filter').value; const q = ($('#msg-search').value||'').toLowerCase();
      let query = supabase.from('messages').select('*').order('created_at',{ascending:false});
      if(filter==='new') query = query.eq('status','new');
      if(filter==='read') query = query.eq('status','read');
      if(filter==='archived') query = query.eq('status','archived');
      if(filter==='starred') query = query.eq('starred', true);
      const { data } = await query;
      const rows = (data||[]).filter(m=> (m.name+' '+m.email+' '+(m.subject||'')).toLowerCase().includes(q))
        .map(m=>`<tr>
          <td class="p-4">${new Date(m.created_at).toLocaleString()}</td>
          <td class="p-4"><div class="font-medium">${m.name}</div><div class="text-xs text-slate-400">${m.email}</div></td>
          <td class="p-4">${m.subject||'—'}</td>
          <td class="p-4">${m.status==='new' ? '<span class="text-green-400">Nuevo</span>' : m.status==='read' ? '<span class="text-slate-300">Leído</span>' : '<span class="text-yellow-400">Archivado</span>'}</td>
          <td class="p-4">
            <div class="flex gap-2">
              <button title="Ver" data-msgview="${m.id}" class="text-accent-500 hover:opacity-80"><i data-feather="eye" class="w-4 h-4"></i></button>
              <a title="Responder" href="mailto:${m.email}?subject=Re:${encodeURIComponent(m.subject||'Contacto')}" class="text-blue-400 hover:text-blue-300"><i data-feather="mail" class="w-4 h-4"></i></a>
              <button title="Destacar" data-msgstar="${m.id}" class="${m.starred?'text-yellow-400':'text-slate-300'} hover:text-yellow-400"><i data-feather="star" class="w-4 h-4"></i></button>
              <button title="Marcar leído" data-msgread="${m.id}" class="text-green-400 hover:text-green-300"><i data-feather="check-circle" class="w-4 h-4"></i></button>
              <button title="Archivar" data-msgarch="${m.id}" class="text-slate-400 hover:text-slate-200"><i data-feather="archive" class="w-4 h-4"></i></button>
              <button title="Eliminar" data-msgdel="${m.id}" class="text-red-400 hover:text-red-300"><i data-feather="trash-2" class="w-4 h-4"></i></button>
            </div>
          </td>
        </tr>`).join('');
      $('#msg-tbody').innerHTML = rows || `<tr><td colspan="5" class="p-6 text-center text-slate-400">Sin mensajes.</td></tr>`;
      feather.replace();
      updateUnreadBadge();
    }
    async function updateUnreadBadge(){
      const { count } = await supabase.from('messages').select('id', { count:'exact', head:true }).eq('status','new');
      const badge = $('#badge-unread'); const dot = $('#notif-dot'); const stats = $('#stats-unread');
      if(typeof count==='number'){ stats.textContent=count; }
      if((count||0)>0){ badge.classList.remove('hidden'); badge.textContent = count; dot.classList.remove('hidden'); } else { badge.classList.add('hidden'); dot.classList.add('hidden'); }
    }
    $('#msg-filter').addEventListener('change', renderMessages);
    $('#msg-search').addEventListener('input', renderMessages);
    $('#msg-refresh').addEventListener('click', renderMessages);
    $('#messages-section').addEventListener('click', async (e)=>{
      const v = (sel)=> e.target.closest(`button[${sel}]`);
      const view = v('data-msgview'); const star=v('data-msgstar'); const read=v('data-msgread'); const arch=v('data-msgarch'); const del=v('data-msgdel');
      if(view){ const { data } = await supabase.from('messages').select('*').eq('id', view.dataset.msgview).maybeSingle(); if(!data) return;
        alert(`De: ${data.name} <${data.email}>\nAsunto: ${data.subject||'—'}\n\n${data.body||''}`);
      }
      if(star){ await supabase.from('messages').update({ starred: true }).eq('id', star.dataset.msgstar); renderMessages(); }
      if(read){ await supabase.from('messages').update({ status:'read' }).eq('id', read.dataset.msgread); renderMessages(); }
      if(arch){ await supabase.from('messages').update({ status:'archived' }).eq('id', arch.dataset.msgarch); renderMessages(); }
      if(del){ if(!confirm('¿Eliminar mensaje?')) return; await supabase.from('messages').delete().eq('id', del.dataset.msgdel); renderMessages(); }
    });
    // Realtime: nuevos mensajes
    let rtMsgs;
    function subMessagesRealtime(){
      rtMsgs = supabase.channel('msg-realtime')
        .on('postgres_changes', { event:'INSERT', schema:'public', table:'messages' }, payload=>{
          toast('Nuevo mensaje recibido'); renderMessages(); loadDashboard();
        }).subscribe();
    }

    // ========= Usuarios (perfiles)
    async function renderUsers(){
      const roleFilter = $('#usr-filter').value; const q = ($('#usr-search').value||'').toLowerCase();
      let { data } = await supabase.from('profiles').select('id, full_name, role, active, avatar_url, email');
      data = (data||[]).filter(u=> (roleFilter==='all' || u.role===roleFilter) && ((u.full_name||'').toLowerCase().includes(q) || (u.email||'').toLowerCase().includes(q)));
      $('#usr-tbody').innerHTML = data.map(u=>`<tr>
        <td class="p-4">${u.full_name||'—'}</td>
        <td class="p-4">${u.email||'—'}</td>
        <td class="p-4">${u.role}</td>
        <td class="p-4">${u.active?'<span class="text-green-400">Activo</span>':'<span class="text-slate-400">Inactivo</span>'}</td>
        <td class="p-4">
          <div class="flex gap-2">
            <button data-uedit="${u.id}" class="text-blue-400 hover:text-blue-300" title="Editar"><i data-feather="edit" class="w-4 h-4"></i></button>
            <button data-utoggle="${u.id}" class="text-accent-500 hover:opacity-80" title="Activar/Desactivar"><i data-feather="power" class="w-4 h-4"></i></button>
          </div>
        </td>
      </tr>`).join('') || `<tr><td colspan="5" class="p-6 text-center text-slate-400">Sin usuarios.</td></tr>`;
      feather.replace();
    }
    $('#usr-save').addEventListener('click', async ()=>{
      const id=$('#usr-id').value; const payload={ full_name:$('#usr-name').value.trim(), email:$('#usr-email').value.trim(), role:$('#usr-role').value, active:$('#usr-active').classList.contains('active') };
      if(!id) return alert('Selecciona un usuario del listado para editar.');
      const { error } = await supabase.from('profiles').update(payload).eq('id', id);
      if(error) return alert(error.message);
      $('#usr-id').value=''; $('#usr-name').value=''; $('#usr-email').value=''; $('#usr-role').value='editor'; $('#usr-active').classList.add('active');
      renderUsers();
    });
    $('#usr-clear').addEventListener('click', ()=>{ $('#usr-id').value=''; $('#usr-name').value=''; $('#usr-email').value=''; });
    $('#usr-active').addEventListener('click', (e)=> e.currentTarget.classList.toggle('active'));
    $('#usr-search').addEventListener('input', renderUsers);
    $('#usr-filter').addEventListener('change', renderUsers);
    $('#users-section').addEventListener('click', async (e)=>{
      const ed=e.target.closest('button[data-uedit]'); const tog=e.target.closest('button[data-utoggle]');
      if(ed){ const { data } = await supabase.from('profiles').select('*').eq('id', ed.dataset.uedit).maybeSingle(); if(!data) return;
        $('#usr-id').value=data.id; $('#usr-name').value=data.full_name||''; $('#usr-email').value=data.email||''; $('#usr-role').value=data.role||'editor'; $('#usr-active').classList.toggle('active', !!data.active); }
      if(tog){ const id=tog.dataset.utoggle; const { data } = await supabase.from('profiles').select('active').eq('id', id).maybeSingle(); await supabase.from('profiles').update({ active: !data?.active }).eq('id', id); renderUsers(); }
    });

    // ========= Config
    const html = document.documentElement;
    $('#set-dark').addEventListener('click', ()=>{ $('#set-dark').classList.toggle('active'); const on=$('#set-dark').classList.contains('active'); html.classList.toggle('dark', on); localStorage.setItem('uabc_theme_dark', on?'1':'0'); });
    $('#set-apply-theme').addEventListener('click', ()=>{
      const rootStyle = html.style; rootStyle.setProperty('--uabc-green', $('#set-primary').value); rootStyle.setProperty('--uabc-gold', $('#set-accent').value); toast('Tema aplicado');
    });
    $('#pf-save').addEventListener('click', async ()=>{
      const { data:{ user } } = await supabase.auth.getUser(); if(!user) return;
      const payload = { full_name:$('#pf-name').value.trim(), role:$('#pf-role').value.trim(), email:$('#pf-email').value.trim(), phone:$('#pf-phone').value.trim() };
      await supabase.from('profiles').update(payload).eq('id', user.id); toast('Perfil guardado');
      $('#topbar-name').textContent = payload.full_name||$('#topbar-name').textContent;
      $('#topbar-role').textContent = payload.role||$('#topbar-role').textContent;
    });
    $('#btn-backup').addEventListener('click', async ()=>{
      const [posts, media, events, pubs, research, courses, blog, users, messages] = await Promise.all([
        supabase.from('posts').select('*'),
        listMedia(),
        supabase.from('events').select('*'),
        supabase.from('publications').select('*'),
        supabase.from('research_projects').select('*'),
        supabase.from('courses').select('*'),
        supabase.from('blog_posts').select('*'),
        supabase.from('profiles').select('*'),
        supabase.from('messages').select('*')
      ]);
      const data = { posts:posts.data, media, events:events.data, publications:pubs.data, research:research.data, courses:courses.data, blog:blog.data, users:users.data, messages:messages.data };
      const blob=new Blob([JSON.stringify(data,null,2)], {type:'application/json'}); const url=URL.createObjectURL(blob);
      const a=document.createElement('a'); a.href=url; a.download='backup_portal_uabc.json'; a.click(); URL.revokeObjectURL(url); toast('Backup generado');
    });

    // ========= App Start
    async function startApp(){
      showSection(location.hash.replace('#','')||'dashboard');
      await Promise.all([
        loadDashboard(),
        renderPosts(),
        renderMedia().then(loadMediaStats),
        renderEvents(),
        renderPubs(),
        renderRes(),
        renderCourses(),
        renderBlog(),
        renderMessages(),
        renderUsers()
      ]);
      subMessagesRealtime();
      // animación de entrada
      setTimeout(()=>{ $$('.admin-card').forEach((c,i)=>{ c.style.animationDelay=`${i*0.05}s`; c.classList.add('fade-in'); }); }, 100);
    }

try{document.addEventListener('DOMContentLoaded',()=>{ if(window.feather){ window.feather.replace(); } });}catch(_){}
