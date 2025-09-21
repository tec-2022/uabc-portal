/* Paleta UABC + modo oscuro en Tailwind */
    const UABC_GREEN = '#0b6b3a';
    const UABC_GOLD  = '#c9a227';
    const UABC_DARK  = '#083321';

    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            display: ['Inter', 'sans-serif']
          },
          colors: {
            primary: {
              50:'#ecf7f1',100:'#d6efe2',200:'#a7dfc2',300:'#77cfa3',400:'#47bf83',
              500: UABC_GREEN, 600:'#0a5f35',700:'#094f2c',800:'#0a4226',900: UABC_DARK
            },
            accent: {
              50:'#fff8e6',100:'#ffefc2',200:'#ffe28a',300:'#ffd452',400:'#ffca2e',
              500: UABC_GOLD, 600:'#b88a1e',700:'#8f6b18',800:'#6b5012',900:'#513d0e'
            },
            slateDeep: '#0f172a'
          },
          boxShadow: {
            soft: '0 10px 25px -10px rgba(2,6,23,0.25)',
            glow: '0 0 15px rgba(201, 162, 39, 0.3)'
          },
          animation: {
            'fade-in': 'fadeIn 0.3s ease-in',
            float: 'float 6s ease-in-out infinite'
          },
          keyframes: {
            fadeIn: { '0%':{opacity:'0',transform:'translateY(10px)'}, '100%':{opacity:'1',transform:'translateY(0)'} },
            float:   { '0%,100%':{transform:'translateY(0)'}, '50%':{transform:'translateY(-10px)'} }
          }
        }
      }
    }

/* ---- Inicialización ---- */
    const app = document.getElementById('app');
    const links = () => Array.from(document.querySelectorAll('.menu-link'));

    /* ---- i18n ---- */
    const I18N = {
      es: {
        name: "Dr. Nombre Apellido",
        role: "Profesor Investigador",
        university: "Universidad Autónoma de Baja California",
        home: "Inicio",
        events: "Eventos",
        publications: "Publicaciones",
        research: "Investigación",
        teaching: "Docencia",
        blog: "Blog Académico",
        gallery: "Galería",
        contact: "Contacto",
        cv: "Descargar CV",
        title_name: "Dr. Nombre Apellido",
        home_intro1: "Profesor – Investigador en la UABC.",
        home_intro2: "Especialista en transformación digital y análisis de datos aplicados.",
        positions_title: "Posiciones Académicas",
        education_title: "Educación",
        materials: "Material Didáctico",
        filter: "Filtrar",
        contact_intro: "Puedes contactarme para colaboraciones académicas, asesorías o cualquier consulta profesional.",
        full_name: "Nombre Completo",
        email: "Correo Electrónico",
        subject: "Asunto",
        message: "Mensaje",
        send: "Enviar Mensaje",
        cv_text: "Descarga mi CV actualizado en formato PDF.",
        pdf_version: "Versión PDF",
        pdf_note: "Descarga completa para imprimir o compartir",
        download_cv: "Descargar CV",
        back_home: "Volver al Inicio",
        upcoming_events: "Próximos Eventos",
        upcoming_events_desc: "Conferencias, seminarios y talleres programados",
        past_events: "Eventos Pasados",
        past_events_desc: "Archivo de actividades académicas realizadas",
        event_calendar: "Calendario de Eventos",
        calendar_placeholder: "Integración de calendario próximo",
        location: "Ubicación de la Oficina",
        minutes: "min",
        podcast: "Podcast",
        recent_episodes: "Episodios recientes",
        research_projects: "Proyectos de Investigación",
        interests: "Intereses",
        more_international_positions: 'Posiciones Académicas Internacionales',
        more_continuing_education: 'Educación Continua',
        more_honors_awards: 'Honores, Premios y Becas',
        undergrad_courses: "Cursos de Licenciatura o Pregrado",
        grad_courses: "Cursos de Posgrado",
        teaching_intro: "Una de las actividades preponderantes en el quehacer de los profesores universitarios en México es la docencia. A lo largo de mi carrera he impartido asignaturas en tres áreas: Tecnologías de Información, Gestión y Métodos de Investigación.",
        teaching_area_it: "Tecnologías de Información",
        teaching_area_mgmt: "Gestión",
        teaching_area_methods: "Métodos de Investigación",
      },
      en: {
        name: "Dr. First Last",
        role: "Professor-Researcher",
        university: "Autonomous University of Baja California",
        home: "Home",
        events: "Events",
        publications: "Publications",
        research: "Research",
        teaching: "Teaching",
        blog: "Academic Blog",
        gallery: "Gallery",
        contact: "Contact",
        cv: "Download CV",
        title_name: "Dr. First Last",
        home_intro1: "Professor–Researcher at UABC.",
        home_intro2: "Specialist in digital transformation and applied data analysis.",
        positions_title: "Academic Positions",
        education_title: "Education",
        materials: "Teaching Materials",
        filter: "Filter",
        contact_intro: "Reach out for collaborations, advising, or professional inquiries.",
        full_name: "Full Name",
        email: "Email",
        subject: "Subject",
        message: "Message",
        send: "Send Message",
        cv_text: "Download my up-to-date CV in PDF.",
        pdf_version: "PDF Version",
        pdf_note: "Best for printing and sharing",
        download_cv: "Download CV",
        back_home: "Back home",
        upcoming_events: "Upcoming Events",
        upcoming_events_desc: "Scheduled conferences, seminars and workshops",
        past_events: "Past Events",
        past_events_desc: "Archive of completed academic activities",
        event_calendar: "Event Calendar",
        calendar_placeholder: "Calendar integration coming soon",
        location: "Office Location",
        minutes: "min",
        podcast: "Podcast",
        recent_episodes: "Recent Episodes",
        research_projects: "Research Projects",
        interests: "Interests",
        more_international_positions: 'International Academic Positions',
        more_continuing_education: 'Continuing Education',
        more_honors_awards: 'Honors, Awards & Scholarships',
        undergrad_courses: "Undergraduate Courses",
        grad_courses: "Graduate Courses",
        teaching_intro: "One of the core activities of university professors in Mexico is teaching. Throughout my career, I have taught subjects in three areas: Information Technologies, Management, and Research Methods.",
        teaching_area_it: "Information Technologies",
        teaching_area_mgmt: "Management",
        teaching_area_methods: "Research Methods",
      }
    };

    function tMoreTitle(titleEs) {
      const k = (titleEs || '').toLowerCase().trim();
      const map = {
        'posiciones académicas internacionales': 'more_international_positions',
        'educación continua': 'more_continuing_education',
        'honores, premios y becas': 'more_honors_awards'
      };
      const key = map[k];
      return key ? I18N[getLang()][key] : titleEs;
    }

    /* Helper para campos bilingües del CMS */
    function tt(v){
      if (v && typeof v === 'object' && ('es' in v || 'en' in v)) {
        return v[getLang()] ?? v.es ?? v.en ?? '';
      }
      return v ?? '';
    }

    function getLang(){ return localStorage.getItem('lang') || 'es'; }
    function setLang(l){ localStorage.setItem('lang', l); document.documentElement.lang = l; translate(); render(); }
    function translate(){
      const dict = I18N[getLang()];
      document.querySelectorAll('[data-i18n]').forEach(el=>{
        const k = el.getAttribute('data-i18n');
        if(dict[k]) el.textContent = dict[k];
      });
      const lbl = document.getElementById('langLabel');
      if (lbl) {
        if (getLang() === 'es') {
          lbl.textContent = 'ES';
          lbl.nextElementSibling.textContent = 'EN';
        } else {
          lbl.textContent = 'EN';
          lbl.nextElementSibling.textContent = 'ES';
        }
      }
    }

    /* ---- Theme toggle ---- */
    function getTheme(){ return localStorage.getItem('theme') || 'light'; }
    function applyTheme(){
      const t = getTheme();
      document.documentElement.classList.toggle('dark', t==='dark');
      const themeLabel = document.getElementById('themeLabel');
      if (themeLabel) themeLabel.textContent = t==='dark' ? 'Oscuro' : 'Claro';
    }
    function setTheme(t){ localStorage.setItem('theme', t); applyTheme(); }

    /* ---- CMS bilingüe (sustituible por backend) ---- */
    window.CMS_CV_URL = window.CMS_CV_URL || 'assets/cv.pdf';
    window.CMS_CONTENT = window.CMS_CONTENT || {
      home: {
        contacts: [
          { label:{es:'LinkedIn',en:'LinkedIn'}, href:'https://www.linkedin.com/in/eahumada/' },
          { label:{es:'Orcid',en:'Orcid'}, href:'https://orcid.org/0000-0003-1698-5126' },
          { label:{es:'ResearchGate',en:'ResearchGate'}, href:'https://www.researchgate.net/' },
          { label:{es:'Google Scholar',en:'Google Scholar'}, href:'https://scholar.google.com' }
        ],
        positions: [
          { badge:{es:'Actual',en:'Present'}, year:'2006', label:{es:'Profesor',en:'Professor'}, sub:{es:'Universidad Autónoma de Baja California',en:'Autonomous University of Baja California'} },
          { year:'2018', label:{es:'Profesor de Asignatura',en:'Adjunct Professor'}, sub:{es:'Universidad Iberoamericana',en:'Universidad Iberoamericana'} }
        ],
        education: [
          { type:{es:'Doctorado',en:'Ph.D.'}, year:'2011', label:{es:'Ciencias Administrativas',en:'Administrative Sciences'}, sub:{es:'UABC',en:'UABC'} },
          { type:{es:'Maestría',en:'M.B.A.'}, year:'2006', label:{es:'Maestría en Administración',en:'Business Administration'}, sub:{es:'UABC',en:'UABC'} }
        ],
        more: [
          { title:'Posiciones Académicas Internacionales',
            items:[{ badge:{es:'Actual',en:'Present'}, year:'2022', label:{es:'Profesor Visitante',en:'Visiting Professor'}, sub:{es:'PUCP - Perú',en:'PUCP - Peru'} }]}
          ,
          { title:'Educación Continua',
            items:[
              { type:{es:'Diplomado',en:'Diploma'},    year:'2016', label:{es:'Econometría Aplicada',en:'Applied Econometrics'},     sub:{es:'ITAM',en:'ITAM'} },
              { type:{es:'Taller',en:'Workshop'},       year:'2014', label:{es:'Diseño de Políticas Públicas',en:'Public Policy Design'}, sub:{es:'Harvard Kennedy School',en:'Harvard Kennedy School'} },
              { type:{es:'Profesional',en:'Professional'}, year:'2012', label:{es:'Creating Public Value',en:'Creating Public Value'},   sub:{es:'Harvard Kennedy School',en:'Harvard Kennedy School'} }
            ]
          },
          { title:'Honores, Premios y Becas',
            items:[
              { type:{es:'Beca',en:'Scholarship'}, year:'2020', label:{es:'Beca de Investigación UABC',en:'UABC Research Fellowship'}, sub:{es:'UABC',en:'UABC'} },
              { type:{es:'Premio',en:'Award'},     year:'2018', label:{es:'Reconocimiento al Mejor Artículo',en:'Best Paper Award'}, sub:{es:'Conferencia Internacional',en:'International Conference'} },
              { type:{es:'Honor',en:'Honor'},     year:'2015', label:{es:'Mención Honorífica Doctorado',en:'Ph.D. Honorable Mention'}, sub:{es:'UABC',en:'UABC'} }
            ]
          }
        ]
      },
      eventos: {
        upcoming: [
          { date:{es:'15 Mar 2025',en:'Mar 15, 2025'}, title:{es:'Conferencia Internacional de Transformación Digital',en:'International Conference on Digital Transformation'}, location:{es:'Ciudad de México',en:'Mexico City'}, type:{es:'Conferencia',en:'Conference'}, link:'#' },
          { date:{es:'28 Abr 2025',en:'Apr 28, 2025'}, title:{es:'Seminario de Investigación en Economía Digital',en:'Research Seminar on Digital Economy'}, location:{es:'UABC Campus Tijuana',en:'UABC Tijuana Campus'}, type:{es:'Seminario',en:'Seminar'}, link:'#' },
          { date:{es:'12 May 2025',en:'May 12, 2025'}, title:{es:'Taller de Analítica de Datos para Investigadores',en:'Data Analytics Workshop for Researchers'}, location:{es:'En línea',en:'Online'}, type:{es:'Taller',en:'Workshop'}, link:'#' }
        ],
        past: [
          { date:{es:'10 Nov 2024',en:'Nov 10, 2024'}, title:{es:'Presentación de Resultados de Investigación',en:'Research Results Presentation'}, location:{es:'UABC Campus Mexicali',en:'UABC Mexicali Campus'}, type:{es:'Presentación',en:'Talk'} },
          { date:{es:'22 Sep 2024',en:'Sep 22, 2024'}, title:{es:'Participación en Congreso Internacional',en:'Participation in International Congress'}, location:{es:'Guadalajara, Jalisco',en:'Guadalajara, Jalisco'}, type:{es:'Congreso',en:'Congress'} },
          { date:{es:'15 Jul 2024',en:'Jul 15, 2024'}, title:{es:'Seminario de Metodología de Investigación',en:'Research Methodology Seminar'}, location:{es:'En línea',en:'Online'}, type:{es:'Seminario',en:'Seminar'} }
        ]
      },
      publicaciones: [
        {
          type: 'journal',
          year: 2025,
          title: 'The Marketing-Happiness Paradox: Exploring Technological Consumer Behavior',
          authors: 'Eduardo Ahumada-Tello; Esthela Galván-Vela; Sarai Valvo-Rossi; Luis Raymundo Tovar-Peasantz',
          venue: 'Revista Entrepreneur Behavior (Q?), 2025',
          doi: 'https://doi.org/10.xxxx/xxxxx',
          url: '#',
          pdf: ''
        },
        {
          type: 'journal',
          year: 2025,
          title: 'Permaculture in Mexicali, Mexico: Sustainable Policies',
          authors: 'Romano-Gómez, L.; Ahumada-Tello, E.; Ramos-Higuera, K.',
          venue: 'Circular Economy and Knowledge Management for Extreme Weather Resilience, 2025',
          doi: 'https://doi.org/10.xxxx/xxxxx',
          url: '#',
          pdf: ''
        },
        {
          type: 'journal',
          year: 2025,
          title: 'Integration of YOLOv8 Small and MobileNet V3 Large for Efficient Bird Detection and Classification on Mobile Devices',
          authors: 'Félix-Jiménez, A.; Sánchez-Vela, S.; Acolle-CHI, M. A.; Haro-Bárminos, L.; Armendáriz-Morales, E.; Ahumada-Tello, E.',
          venue: 'Adv. Sci. & Tech., 2025',
          doi: 'https://doi.org/10.xxxx/xxxxx',
          url: '#',
          pdf: ''
        },
        {
          type: 'conference',
          year: 2024,
          title: 'Transforming Higher Education: The Role of ICT in Baja California Before and After the COVID-19 Pandemic',
          authors: 'Juan Antonio Mejía-Esparza; Eduardo Ahumada-Tello; …',
          venue: '2024 16th Colombian Conf. on Computing (COLCOM), Barranquilla, Colombia',
          doi: 'https://doi.org/10.xxxx/xxxxx',
          url: '#',
          pdf: ''
        },
        {
          type: 'book',
          year: 2024,
          title: 'Tiempos de happiness management, tecnología y marketing social',
          authors: 'Raúl Valvo-Rossi; Luis Barrera; Tovar-Peasantz; Araceli Galeana; Eduardo Ahumada-Tello',
          venue: 'Transit Humanidades. ISBN: 978-94-…',
          doi: '',
          url: '#',
          pdf: ''
        },
        {
          type: 'conference',
          year: 2023,
          title: 'The Teacher in Education 4.0: An Analysis of Key Competencies for the Economic-Administrative Area',
          authors: 'Juan Antonio Mejía-Esparza; …; Eduardo Ahumada-Tello',
          venue: 'EDUCATIONAL PANAM, 2023',
          doi: 'https://doi.org/10.xxxx/xxxxx',
          url: '#',
          pdf: ''
        }
      ],
      investigacion: [
        { icon:'cpu', title:{es:'Transformación Digital',en:'Digital Transformation'}, text:{es:'Procesos, productividad y adopción tecnológica en organizaciones mexicanas.',en:'Processes, productivity, and technology adoption in Mexican organizations.'} },
        { icon:'bar-chart-2', title:{es:'Analítica Aplicada',en:'Applied Analytics'}, text:{es:'Modelos y datos para decisiones estratégicas.',en:'Models and data for strategic decisions.'} },
        { icon:'dollar-sign', title:{es:'Economía Digital',en:'Digital Economy'}, text:{es:'Impacto de las tecnologías digitales en los modelos económicos.',en:'Impact of digital technologies on economic models.'} },
        { icon:'users', title:{es:'Comportamiento del Consumidor',en:'Consumer Behavior'}, text:{es:'Patrones de consumo en entornos digitales.',en:'Consumption patterns in digital environments.'} }
      ],
      docencia: {
        courses: [
          [{es:'Economía Digital',en:'Digital Economy'},{es:'LAE',en:'LAE'},{es:'Licenciatura',en:'Undergraduate'},{es:'2025-1',en:'2025-1'}],
          [{es:'Análisis de Datos para Negocios',en:'Business Data Analytics'},{es:'LNI',en:'LNI'},{es:'Licenciatura',en:'Undergraduate'},{es:'2025-1',en:'2025-1'}],
          [{es:'Seminario de Investigación',en:'Research Seminar'},{es:'Maestría',en:'Master'},{es:'Posgrado',en:'Graduate'},{es:'2025-2',en:'2025-2'}]
        ],
        materials: [
          { icon:'file-text', label:{es:'Syllabus Economía Digital',en:'Syllabus Digital Economy'}, href:'#' },
          { icon:'file-text', label:{es:'Presentaciones Análisis de Datos',en:'Data Analytics Slides'}, href:'#' },
          { icon:'file-text', label:{es:'Bibliografía Seminario',en:'Seminar Bibliography'}, href:'#' }
        ]
      },
      blog: [
        { img:'https://static.photos/education/640x360/1', date:{es:'15 Enero 2024',en:'January 15, 2024'}, read:{es:'5 min lectura',en:'5 min read'}, title:{es:'Diseñando un Plan de Curso Efectivo',en:'Designing an Effective Course Plan'}, text:{es:'Estrategias para estructurar cursos que maximicen el aprendizaje.',en:'Strategies to structure courses that maximize learning.'}, href:'#' },
        { img:'https://static.photos/education/640x360/2', date:{es:'28 Noviembre 2023',en:'November 28, 2023'}, read:{es:'8 min lectura',en:'8 min read'}, title:{es:'Evaluación Continua en Entornos Digitales',en:'Continuous Assessment in Digital Environments'}, text:{es:'Cómo implementar evaluación formativa en cursos en línea.',en:'How to implement formative assessment in online courses.'}, href:'#' }
      ],
      /* Galería legacy (fotos sueltas). Se usará solo si NO defines gallery_albums abajo */
      galeria: [
        { img:'https://static.photos/education/640x360/3', caption:{es:'Conferencia 2023',en:'Conference 2023'} },
        { img:'https://static.photos/education/640x360/4', caption:{es:'Seminario Internacional',en:'International Seminar'} },
        { img:'https://static.photos/education/640x360/5', caption:{es:'Taller de Investigación',en:'Research Workshop'} },
        { img:'https://static.photos/education/640x360/6', caption:{es:'Ceremonia de Graduación',en:'Graduation Ceremony'} }
      ],
      contacto: [
        { icon:'mail',  title:{es:'Correo Electrónico',en:'Email'},  html:{es:'<a href="mailto:nombre.apellido@uabc.edu.mx" class="text-slate-600 hover:text-primary-600">nombre.apellido@uabc.edu.mx</a>', en:'<a href="mailto:nombre.apellido@uabc.edu.mx" class="text-slate-600 hover:text-primary-600">nombre.apellido@uabc.edu.mx</a>'} },
        { icon:'phone', title:{es:'Teléfono',en:'Phone'},             html:{es:'<a href="tel:+526861234567" class="text-slate-600 hover:text-primary-600">+52 686 123 4567</a>', en:'<a href="tel:+526861234567" class="text-slate-600 hover:text-primary-600">+52 686 123 4567</a>'} },
        { icon:'map-pin', title:{es:'Oficina',en:'Office'},           html:{es:'<p class="text-slate-600">Edificio de Posgrado, 3er piso, Oficina 302<br>UABC</p>', en:'<p class="text-slate-600">Graduate Building, 3rd floor, Office 302<br>UABC</p>'} }
      ]
    };

    /* --- (Opcional) Define álbumes reales; si no, se agrupan 3 fotos por álbum desde "galeria" --- */
    window.CMS_CONTENT.gallery_albums = window.CMS_CONTENT.gallery_albums || [
      {
        title:{es:'Seminario 2024', en:'Seminar 2024'},
        date:{es:'15 Mar 2024', en:'Mar 15, 2024'},
        images:[
          'https://static.photos/nature/1200x630/1',
          'https://static.photos/nature/1200x630/2',
          'https://static.photos/nature/1200x630/3'
        ]
      },
      {
        title:{es:'Conferencia Internacional', en:'International Conference'},
        date:{es:'22 Abr 2024', en:'Apr 22, 2024'},
        images:[
          'https://static.photos/office/1200x630/4',
          'https://static.photos/office/1200x630/5',
          'https://static.photos/office/1200x630/6',
          'https://static.photos/office/1200x630/7'
        ]
      },
      {
        title:{es:'Taller Creativo', en:'Creative Workshop'},
        date:{es:'5 May 2024', en:'May 5, 2024'},
        images:[
          'https://static.photos/people/1200x630/8',
          'https://static.photos/people/1200x630/9',
          'https://static.photos/people/1200x630/10',
          'https://static.photos/people/1200x630/11',
          'https://static.photos/people/1200x630/12'
        ]
      },
      {
        title:{es:'Ceremonia de Graduación', en:'Graduation Ceremony'},
        date:{es:'30 Jun 2024', en:'Jun 30, 2024'},
        images:[
          'https://static.photos/education/1200x630/13',
          'https://static.photos/education/1200x630/14'
        ]
      }
    ];

    /* --- CMS de la sección Investigación (contenido propio de la vista) --- */
    window.CMS_CONTENT.researchPage = window.CMS_CONTENT.researchPage || {
      about: [
        "La investigación es indagación sistemática y metódica llevada a cabo para descubrir, interpretar o revisar conocimientos, teorías o prácticas.",
        "El objetivo principal es ampliar la base de conocimientos existente y contribuir a la solución de problemas reales.",
        "Tipos de investigación (resumen):",
        { ul: [
          "Investigación básica: busca ampliar el conocimiento y la comprensión.",
          "Investigación aplicada: orientada a resolver problemas prácticos.",
          "Investigación cuantitativa: recopila y analiza datos numéricos.",
          "Investigación cualitativa: comprende razones, motivaciones y comportamientos.",
          "Investigación experimental y observacional.",
          "Revisión de literatura: síntesis del estado del conocimiento."
        ]},
        "La investigación impulsa la innovación, informa la toma de decisiones y contribuye al desarrollo de nuevas teorías y políticas públicas."
      ],
      interests: [
        "Happiness Management",
        "Inteligencia Colectiva",
        "Transformación Digital",
        "Gestión del Conocimiento, Innovación e Ingeniería",
        "Ciencia de Datos e Inteligencia de Negocios",
        "Sistemas Complejos"
      ],
      group: {
        title: "Synkrotima Research Group",
        intro: "¡Conoce a nuestros miembros! Somos un grupo de profesionales y académicos interesados en investigación y desarrollo con foco en mejorar la calidad de vida.",
        members: [
          {
            name: "Reyna Virginia Barragán-Quintero",
            role: "Profesor e Investigador",
            img: "https://static.photos/people/160x160/1",
            bio: "Miembro del IEEE; Doctora en Ciencias de la Gestión por la UABC. Experiencia en banca y consultoría. Intereses: mercadotecnia, felicidad/bienestar subjetivo, análisis del consumidor.",
            email: "reyna.barragan19@uabc.edu.mx"
          },
          {
            name: "Jessica López-García",
            role: "Estudiante de doctorado / Docente",
            img: "https://static.photos/people/160x160/2",
            bio: "Experiencia en marketing digital y análisis cualitativo; SEO/SEM y gestión de contenidos.",
            email: "jessica.lopez@uabc.edu.mx"
          },
          {
            name: "David Romero-Gómez",
            role: "Estudiante de doctorado",
            img: "https://static.photos/people/160x160/3",
            bio: "12 años en construcción naval y aeroespacial; hoy investiga felicidad (bienestar subjetivo) y gestión tecnológica.",
            email: "romerod@uabc.edu.mx"
          },
          {
            name: "Héctor Alejandro Acuña-Cid",
            role: "Ingeniero en computación / Docente",
            img: "https://static.photos/people/160x160/4",
            bio: "Máster en Tecnología Educativa y en Ciencia de Datos. Intereses: ciencia de datos e ingeniería de software.",
            email: "hector.acuna@uabc.edu.mx"
          }
        ]
      },
      projects: [
        {
          id: "p1",
          img: "https://static.photos/city/640x360/1",
          title: "Determinantes en zonas urbanas de alto riesgo y efectos en el desarrollo económico y social (Bordo en Tijuana, B.C.)",
          summary: "Identifica factores que influyen en el surgimiento de zonas de alto riesgo y sus implicaciones económicas y sociales; propone políticas públicas.",
          details: "Metodología mixta con análisis espacial, entrevistas y revisión documental. Entregables: mapa de riesgos y recomendaciones de política."
        },
        {
          id: "p2",
          img: "https://static.photos/lab/640x360/2",
          title: "Innovación y biotecnología para el desarrollo regional de Baja California",
          summary: "Mejores prácticas nacionales e internacionales para fortalecer la competitividad regional mediante colaboración triple hélice.",
          details: "Análisis comparado de hubs, encuestas a empresas y hoja de ruta tecnológica. Entregables: informe técnico y base de iniciativas."
        }
      ]
    };

    /* ---- Router ---- */
    function routeNameFromHash(){ const hash = window.location.hash || '#/home'; return hash.replace('#/','').toLowerCase(); }
    function setActive(route){
      links().forEach(a=>{
        const r = a.getAttribute('href').replace('#/','').toLowerCase();
        a.classList.toggle('active-menu-item', r === route);
      });
    }

    /* ---- Helpers UI ---- */
    function chip(text, cls='bg-slate-200 dark:bg-slate-700 text-xs px-2 py-0.5 rounded'){
      return `<span class="${cls}">${text}</span>`;
    }
    function card(it){
      return `<div class="bg-white dark:bg-slate-800 rounded-md shadow p-4 border border-slate-100 dark:border-slate-700">
        <div class="text-sm inline-flex items-center gap-2 mb-1">
          ${it.badge?chip(tt(it.badge),'bg-primary-700 text-white text-xs px-2 py-0.5 rounded'):''}
          ${it.year?chip(tt(it.year),'bg-primary-200 text-primary-900 text-xs px-2 py-0.5 rounded'):''}
          ${it.type?chip(tt(it.type)):''}
        </div>
        <div class="font-semibold">${tt(it.label)||''}</div>
        ${it.sub?`<div class="text-slate-600 dark:text-slate-300 text-sm">${tt(it.sub)}</div>`:''}
      </div>`;
    }

    /* ---- Timeline Builder (Educación Continua) ---- */
    function buildVerticalTimeline(items = []) {
      return `
        <div class="timeline-rail">
          ${items.map((it, idx) => `
            <div class="relative mb-8" data-aos="fade-up" data-aos-delay="${idx*60}">
              <span class="timeline-node" style="top: 6px;"></span>
              <div class="timeline-card bg-white/90 dark:bg-slate-800/80 backdrop-blur rounded-xl border border-slate-200 dark:border-slate-700 hover:border-accent-300 p-4 md:p-5">
                <div class="flex flex-wrap items-center gap-2 mb-1">
                  ${it.type ? `<span class="text-xs px-2 py-0.5 rounded bg-primary-50 text-primary-800 dark:bg-primary-900 dark:text-primary-100">${tt(it.type)}</span>` : ``}
                  ${it.year ? `<span class="text-xs px-2 py-0.5 rounded bg-accent-50 text-accent-900 dark:bg-accent-900/40 dark:text-accent-200">${tt(it.year)}</span>` : ``}
                </div>
                <h4 class="font-semibold text-slate-900 dark:text-white leading-snug">${tt(it.label)||''}</h4>
                ${it.sub ? `<p class="text-sm text-slate-600 dark:text-slate-300 mt-1">${tt(it.sub)}</p>` : ``}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    /* ---- Renderers ---- */
    function renderHomeFromCMS(){
      const d = window.CMS_CONTENT.home || {};
      // contactos
      const cEl = document.getElementById('homeContacts');
      if(cEl && Array.isArray(d.contacts)){
        cEl.innerHTML = d.contacts.map(c=>`
          <div class="mb-1">
            <span class="font-semibold">${tt(c.label)}:</span>
            <a class="text-primary-700 dark:text-accent-400 hover:underline break-all" href="${c.href}" target="_blank" rel="noopener">${c.href}</a>
          </div>`).join('');
      }
      // listas
      const pEl = document.getElementById('positionsList');
      if(pEl && Array.isArray(d.positions)){ pEl.innerHTML = d.positions.map(card).join(''); }
      const eEl = document.getElementById('educationList');
      if(eEl && Array.isArray(d.education)){ eEl.innerHTML = d.education.map(card).join(''); }

      // more
      const mEl = document.getElementById('moreSections');
      if(mEl && Array.isArray(d.more)){
        mEl.innerHTML = d.more.map(sec=>{
          const id = 'more-' + Math.random().toString(36).slice(2, 9);
          const visible = 3;
          const total = (sec.items||[]).length;
          const showToggle = total > visible;
          const initial = (sec.items||[]).slice(0, visible);
          const rest = (sec.items||[]).slice(visible);

          if ((sec.title||'').toLowerCase().trim()==='educación continua' || (sec.title||'').toLowerCase().trim()==='honores, premios y becas') {
            return `
              <section class="mb-10">
                <h3 class="text-2xl font-semibold mb-4">${tMoreTitle(sec.title)}</h3>
                ${buildVerticalTimeline(initial)}
                ${showToggle ? `
                  <div id="${id}-rest" class="hidden">
                    ${buildVerticalTimeline(rest)}
                  </div>
                  <button data-toggle="${id}" class="mt-4 text-sm text-accent-600 hover:text-accent-500 font-medium">
                    ${getLang()==='es'?'Ver más':'Show more'}
                  </button>
                ` : ''}
              </section>
            `;
          }
          return `
            <section class="mb-10">
              <h3 class="text-2xl font-semibold mb-4">${tMoreTitle(sec.title)}</h3>
              <div class="space-y-3">
                ${initial.map(card).join('')}
              </div>
              ${showToggle ? `
                <div id="${id}-rest" class="hidden space-y-3">
                  ${rest.map(card).join('')}
                </div>
                <button data-toggle="${id}" class="mt-4 text-sm text-accent-600 hover:text-accent-500 font-medium">
                  ${getLang()==='es'?'Ver más':'Show more'}
                </button>
              ` : ''}
            </section>
          `;
        }).join('');

        // Delegación para "ver más"
        mEl.addEventListener('click', (e) => {
          if (!e.target.hasAttribute('data-toggle')) return;
          const id = e.target.getAttribute('data-toggle');
          const rest = document.getElementById(id + '-rest');
          if (!rest) return;
          const isHidden = rest.classList.contains('hidden');
          rest.classList.toggle('hidden', !isHidden);
          e.target.textContent = isHidden
            ? (getLang() === 'es' ? 'Ver menos' : 'Show less')
            : (getLang() === 'es' ? 'Ver más' : 'Show more');
        });
      }
    }

    /* ---- Eventos ---- */
    function renderEventsFromCMS(){
      const data = window.CMS_CONTENT.eventos || {};

      const upcomingEl = document.getElementById('upcomingEvents');
      if(upcomingEl && Array.isArray(data.upcoming)){
        upcomingEl.innerHTML = data.upcoming.map(event => `
          <div class="border-l-4 border-primary-500 pl-3 py-2">
            <div class="flex justify-between items-start gap-3">
              <div class="min-w-0">
                <h4 class="font-medium">${tt(event.title)}</h4>
                <div class="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                  <i data-feather="calendar" class="w-3 h-3"></i><span>${tt(event.date)}</span>
                  <i data-feather="map-pin" class="w-3 h-3 ml-2"></i><span>${tt(event.location)}</span>
                </div>
              </div>
              ${event.link ? `<a href="${event.link}" class="shrink-0 text-primary-600 hover:text-primary-500" aria-label="Abrir enlace del evento"><i data-feather="external-link" class="w-4 h-4"></i></a>` : ''}
            </div>
            ${event.type ? `<div class="mt-2"><span class="bg-primary-100 text-primary-800 text-xs px-2 py-0.5 rounded">${tt(event.type)}</span></div>` : ''}
          </div>
        `).join('');
      }

      const pastEl = document.getElementById('pastEvents');
      if(pastEl && Array.isArray(data.past)){
        pastEl.innerHTML = data.past.map(event => `
          <div class="border-l-4 border-slate-300 dark:border-slate-600 pl-3 py-2">
            <h4 class="font-medium">${tt(event.title)}</h4>
            <div class="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
              <i data-feather="calendar" class="w-3 h-3"></i><span>${tt(event.date)}</span>
              <i data-feather="map-pin" class="w-3 h-3 ml-2"></i><span>${tt(event.location)}</span>
            </div>
            ${event.type ? `<div class="mt-2"><span class="bg-slate-200 dark:bg-slate-700 text-xs px-2 py-0.5 rounded">${tt(event.type)}</span></div>` : ''}
          </div>
        `).join('');
      }
      feather.replace();

      // Calendario
      const calRoot = document.getElementById('eventCalendar');
      if (!calRoot) return;

      if (window.__UABC_CAL__) {
        window.__UABC_CAL__.destroy();
        window.__UABC_CAL__ = null;
      }

      const toISO = (d) => {
        try {
          const raw = (d && typeof d === 'object') ? (d.en || d.es) : d;
          const dt = new Date(raw);
          if (!isNaN(dt)) return dt.toISOString().slice(0,10);
        } catch(e){}
        return null;
      };

      const cmsEvents = [...(data.upcoming||[]), ...(data.past||[])]
        .map(ev => {
          const start = toISO(ev.date);
          if (!start) return null;
          return {
            title: tt(ev.title),
            start, allDay: true,
            url: ev.link || null,
            extendedProps: { location: tt(ev.location), type: tt(ev.type) }
          };
        })
        .filter(Boolean);

      const calendar = new FullCalendar.Calendar(calRoot, {
        initialView: 'dayGridMonth',
        height: 'auto',
        expandRows: true,
        firstDay: 1,
        locale: getLang() === 'es' ? 'es' : 'en',
        headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,listWeek' },
        buttonText: {
          today: getLang()==='es' ? 'Hoy' : 'Today',
          month: getLang()==='es' ? 'Mes' : 'Month',
          week:  getLang()==='es' ? 'Semana' : 'Week',
          list:  getLang()==='es' ? 'Lista' : 'List'
        },
        events: cmsEvents,
        eventClick: function(info){
          const loc = info.event.extendedProps.location;
          if (loc) info.el.title = loc;
          if (!info.event.url) info.jsEvent.preventDefault();
        }
      });

      calendar.render();
      window.__UABC_CAL__ = calendar;
    }

    function renderPubsFromCMS(){
      const all = window.CMS_CONTENT.publicaciones || [];

      const state = { q:'', type:'all', sort:'desc' };

      const $list  = document.getElementById('pubsContainer');
      const $count = document.getElementById('pubsCount');
      const $type  = document.getElementById('pubsType');
      const $search= document.getElementById('pubsSearch');
      const $sort  = document.getElementById('pubsSort');

      const TYPE_LABEL = { journal:'Journal paper', conference:'Conference paper', book:'Book' };
      const TYPE_BADGE = {
        journal: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200',
        conference: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200',
        book: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100'
      };

      const escape = (s='') => String(s).replace(/[&<>"]/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[m]));

      function apply(){
        let rows = all.slice();

        if (state.type !== 'all') rows = rows.filter(p => p.type === state.type);

        if (state.q){
          const q = state.q.toLowerCase();
          rows = rows.filter(p =>
            (p.title||'').toLowerCase().includes(q) ||
            (p.authors||'').toLowerCase().includes(q) ||
            (p.venue||'').toLowerCase().includes(q)
          );
        }

        rows.sort((a,b)=> state.sort==='desc' ? (b.year - a.year) : (a.year - b.year));

        $list.innerHTML = rows.map(p => {
          const badge = `<span class="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded ${TYPE_BADGE[p.type]||TYPE_BADGE.book}">
            ${TYPE_LABEL[p.type]||'Other'}
          </span>`;

          const rightBtns = `
            <div class="flex gap-2">
              ${p.url ? `<a href="${p.url}" class="inline-flex items-center justify-center w-8 h-8 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-accent-300" title="Abrir enlace" aria-label="Abrir enlace"><i data-feather="external-link" class="w-4 h-4"></i></a>` : ''}
              ${p.pdf ? `<a href="${p.pdf}" class="inline-flex items-center justify-center w-8 h-8 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-accent-300" title="Descargar PDF" aria-label="Descargar PDF"><i data-feather="download" class="w-4 h-4"></i></a>` : ''}
            </div>
          `;

          return `
            <article class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
              <div class="flex items-start gap-4">
                <div class="shrink-0 mt-1">${badge}</div>
                <div class="min-w-0 flex-1">
                  <h3 class="font-semibold text-slate-900 dark:text-white">${escape(p.title)}</h3>
                  <p class="text-sm text-slate-600 dark:text-slate-300 mt-1">${escape(p.authors||'')}</p>
                  <p class="text-sm text-primary-700 dark:text-accent-300 mt-1">${escape(p.venue||'')}</p>
                  <div class="flex flex-wrap items-center gap-3 text-sm mt-2">
                    ${p.doi ? `<a class="text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-accent-300 underline decoration-dotted" href="${p.doi}" target="_blank" rel="noopener">DOI</a>` : ''}
                    <span class="text-slate-500 dark:text-slate-400">Año: ${escape(p.year||'')}</span>
                  </div>
                </div>
                ${rightBtns}
              </div>
            </article>
          `;
        }).join('');

        const total = all.length;
        const shown = rows.length;
        const typeText = state.type==='all' ? `Todos (${total})` : `${TYPE_LABEL[state.type]} (${shown}/${total})`;
        $count.textContent = `Mostrando ${shown} resultados · ${typeText}`;

        feather.replace();
      }

      if ($type) $type.addEventListener('change', e => { state.type = e.target.value; apply(); });
      if ($search) $search.addEventListener('input', e => { state.q = e.target.value.trim(); apply(); });
      if ($sort) $sort.addEventListener('click', () => {
        state.sort = state.sort === 'desc' ? 'asc' : 'desc';
        const icon = $sort.querySelector('i');
        if (icon) icon.setAttribute('data-feather', state.sort === 'desc' ? 'arrow-down' : 'arrow-up');
        apply();
      });

      apply();
    }

    function renderTeachingFromCMS(){
      const rows = (window.CMS_CONTENT.docencia?.courses) || [];
      const ugEl   = document.getElementById('ugList');
      const gradEl = document.getElementById('gradList');

      const pillPresentCls = 'inline-flex items-center justify-center px-3 py-1 text-xs font-semibold rounded-md bg-primary-600 text-white';
      const pillYearCls    = 'inline-flex items-center justify-center px-3 py-1 text-xs font-semibold rounded-md bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100';

      const getYear = (term) => {
        const t = tt(term) || '';
        const m = String(t).match(/\d{4}/);
        return m ? m[0] : '';
      };

      const isUndergrad = (r) => {
        const lv = (tt(r[2]) || '').toLowerCase();
        return lv.includes('licenciatura') || lv.includes('undergrad') || lv.includes('undergraduate');
      };

      const itemHTML = (r) => {
        const title   = tt(r[0]);
        const program = tt(r[1]);
        const level   = tt(r[2]);
        const term    = tt(r[3]);
        const year    = getYear(r[3]);

        return `
          <div class="grid grid-cols-[92px_1fr] gap-4 items-start">
            <div class="flex flex-col gap-2">
              <span class="${pillPresentCls}">${getLang()==='es' ? 'Actual' : 'Present'}</span>
              ${year ? `<span class="${pillYearCls}">${year}</span>` : ''}
            </div>
            <div class="pb-3 border-b border-slate-200 dark:border-slate-700">
              <div class="font-semibold text-slate-900 dark:text-white">${title}</div>
              <div class="text-sm text-slate-600 dark:text-slate-300">${program} • ${level}${term ? ` • ${term}` : ''}</div>
            </div>
          </div>
        `;
      };

      const ugRows   = rows.filter(isUndergrad);
      const gradRows = rows.filter(r => !isUndergrad(r));

      if (ugEl)   ugEl.innerHTML   = ugRows.map(itemHTML).join('');
      if (gradEl) gradEl.innerHTML = gradRows.map(itemHTML).join('');

      feather.replace();
    }

    function renderBlogFromCMS(){
      const list = window.CMS_CONTENT.blog || [];
      if (!list.length) return;

      const latest = list[0];
      const latestEl = document.getElementById('latestPost');
      if (latestEl) {
        latestEl.innerHTML = `
          <article class="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-700 card-hover h-full flex flex-col">
            <img src="${latest.img}" class="w-full h-56 object-cover" alt="">
            <div class="p-6 flex-1 flex flex-col">
              <div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
                <span>${tt(latest.date)}</span><span>•</span><span>${tt(latest.read)}</span>
              </div>
              <h3 class="font-bold text-2xl mb-3">${tt(latest.title)}</h3>
              <p class="text-slate-600 dark:text-slate-300 mb-4 flex-1">${tt(latest.text)}</p>
              <a href="${latest.href}" class="text-primary-600 hover:text-primary-500 font-medium flex items-center gap-1">
                ${getLang()==='es'?'Leer más':'Read more'} <i data-feather="arrow-right" class="w-4 h-4"></i>
              </a>
            </div>
          </article>`;
      }

      const listEl = document.getElementById('postsList');
      if (listEl) {
        listEl.innerHTML = list.slice(1).map(b=>`
          <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 card-hover">
            <div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
              <span>${tt(b.date)}</span><span>•</span><span>${tt(b.read)}</span>
            </div>
            <h4 class="font-semibold text-base mb-2">${tt(b.title)}</h4>
            <p class="text-slate-600 dark:text-slate-300 text-sm mb-3 line-clamp-3">${tt(b.text)}</p>
            <a href="${b.href}" class="text-primary-600 hover:text-primary-500 font-medium flex items-center gap-1 text-sm">
              ${getLang()==='es'?'Leer más':'Read more'} <i data-feather="arrow-right" class="w-3 h-3"></i>
            </a>
          </div>`).join('');

        const toggleBtn = document.getElementById('toggleListBtn');
        const toggleText = document.getElementById('toggleListText');
        if (toggleBtn && toggleText) {
          toggleBtn.addEventListener('click', () => {
            const isHidden = listEl.classList.toggle('hidden');
            toggleText.textContent = isHidden
              ? (getLang()==='es'?'Mostrar lista':'Show list')
              : (getLang()==='es'?'Ocultar lista':'Hide list');
            const icon = toggleBtn.querySelector('i');
            if (icon) icon.setAttribute('data-feather', isHidden ? 'eye' : 'eye-off');
            feather.replace();
          });
        }
      }

      feather.replace();
    }

    /* ======= GALERÍA UABC (patrón exacto + popup) ======= */
    function renderUabcGallery(){
      const root = document.getElementById('uabcGallery');
      if(!root) return;

      const ALBUMS = (window.CMS_CONTENT.gallery_albums && window.CMS_CONTENT.gallery_albums.length)
        ? window.CMS_CONTENT.gallery_albums
        : legacyToAlbums(window.CMS_CONTENT.galeria || []);

      root.innerHTML = ALBUMS.map((alb, i)=>`
        <figure class="uabc-card" data-album="${i}" aria-label="${esc(tt(alb.title))}">
          <img src="${(alb.images?.[0]||'')}" alt="${esc(tt(alb.title))}">
          <span class="uabc-badge">${(alb.images||[]).length} ${getLang()==='es'?'fotos':'photos'}</span>
          <figcaption class="uabc-caption">
            <div class="text-sm font-normal opacity-90">${tt(alb.date)||''}</div>
            <div>${esc(tt(alb.title)||('Álbum '+(i+1)))}</div>
          </figcaption>
        </figure>
      `).join('');

      // Lightbox refs
      const $modal  = document.getElementById('uabcLb');
      const $title  = document.getElementById('uabcLbTitle');
      const $img    = document.getElementById('uabcLbImg');
      const $thumbs = document.getElementById('uabcLbThumbs');
      const $prev   = document.getElementById('uabcLbPrev');
      const $next   = document.getElementById('uabcLbNext');
      const $close  = document.getElementById('uabcLbClose');
      const $dl     = document.getElementById('uabcLbDl');
      const $spin   = document.getElementById('uabcLbSpin');
      const $prog   = document.getElementById('uabcLbProg');

      let state = { a:0, i:0 }, touchStartX=0, touchEndX=0;

      root.addEventListener('click', e=>{
        const card = e.target.closest('.uabc-card'); if(!card) return;
        open(+card.dataset.album, 0);
      });

      document.querySelector('.uabc-view')?.addEventListener('touchstart', e=>{ touchStartX = e.changedTouches[0].screenX; });
      document.querySelector('.uabc-view')?.addEventListener('touchend', e=>{
        touchEndX = e.changedTouches[0].screenX; const th=50;
        if(touchEndX < touchStartX - th) next(); else if(touchEndX > touchStartX + th) prev();
      });

      function open(a,i){
        state={a,i};
        const alb = ALBUMS[a];
        $title.textContent = tt(alb.title) || ('Álbum '+(a+1));
        buildThumbs(alb.images||[]);
        show(i,false);
        $modal.classList.add('open'); $modal.setAttribute('aria-hidden','false');
        document.body.classList.add('overflow-hidden');
        document.addEventListener('keydown', onKeys);
      }
      function close(){
        $modal.classList.remove('open'); $modal.setAttribute('aria-hidden','true');
        document.body.classList.remove('overflow-hidden');
        document.removeEventListener('keydown', onKeys);
      }
      function buildThumbs(imgs){
        $thumbs.innerHTML = (imgs||[]).map((src,idx)=>`<img src="${src}" data-idx="${idx}" alt="Miniatura ${idx+1}">`).join('');
        [...$thumbs.children].forEach(t=>t.addEventListener('click',()=>show(+t.dataset.idx)));
      }
      function show(i, smooth=true){
        const alb = ALBUMS[state.a]; const total = (alb.images||[]).length || 1;
        state.i = (i+total)%total; const src = alb.images[state.i];

        $spin.style.display='block'; $img.style.opacity='0';
        const pre = new Image(); pre.src = src;
        pre.onload = ()=>{
          $img.src = src; $img.alt = `${getLang()==='es'?'Imagen':'Image'} ${state.i+1} – ${tt(alb.title)||''}`;
          $img.style.opacity='1'; $spin.style.display='none';
          if(smooth) $img.animate([{opacity:0},{opacity:1}],{duration:300,easing:'ease-out'});
        };

        [...$thumbs.children].forEach((t,idx)=>t.classList.toggle('active', idx===state.i));
        $prog.textContent = `${state.i+1}/${total}`;
        $dl.onclick = ()=> window.open(src,'_blank','noopener');
      }
      function next(){ show(state.i+1); } function prev(){ show(state.i-1); }
      function onKeys(e){ if(e.key==='Escape') close(); if(e.key==='ArrowRight') next(); if(e.key==='ArrowLeft') prev(); }

      document.querySelector('#uabcLb [data-close]')?.addEventListener('click', close);
      $close.addEventListener('click', close); $next.addEventListener('click', next); $prev.addEventListener('click', prev);

      feather.replace();
    }

    /* Convierte CMS_CONTENT.galeria -> álbumes (3 imágenes por álbum si no defines gallery_albums) */
    function legacyToAlbums(items){
      const groups=[]; for(let i=0;i<items.length;i+=3){
        const slice = items.slice(i,i+3);
        groups.push({
          title:{es:`Álbum ${Math.floor(i/3)+1}`, en:`Album ${Math.floor(i/3)+1}`},
          date:null,
          images: slice.map(x=>x.img)
        });
      }
      return groups;
    }

    /* Escape HTML corto (global) */
    function esc(s=''){ return String(s).replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m])); }

    /* ---- INVESTIGACIÓN: renderer completo ---- */
    function renderResearchPageFromCMS(){
      const data = window.CMS_CONTENT.researchPage || {};

      // About
      const aboutEl = document.getElementById('researchAbout');
      if (aboutEl){
        aboutEl.innerHTML = (data.about||[]).map(p=>{
          if (typeof p === 'string') return `<p>${p}</p>`;
          if (p && p.ul) return `<ul class="list-disc pl-5 space-y-1">${p.ul.map(li=>`<li>${li}</li>`).join('')}</ul>`;
          return '';
        }).join('');
      }

      // Intereses
      const intEl = document.getElementById('researchInterests');
      if (intEl){
        intEl.innerHTML = (data.interests||[]).map(t=>`<li class="py-2 px-2 hover:bg-slate-50 dark:hover:bg-slate-700/40 rounded">${t}</li>`).join('');
      }

      // Grupo / Carrusel
      const titleEl = document.getElementById('groupTitle');
      const introEl = document.getElementById('groupIntro');
      const track   = document.getElementById('memberTrack');
      const btnPrev = document.getElementById('memberPrev');
      const btnNext = document.getElementById('memberNext');
      const members = data.group?.members || [];

      if (titleEl) titleEl.textContent = data.group?.title || 'Research Group';
      if (introEl) introEl.textContent = data.group?.intro || '';

      if (track){
        track.innerHTML = members.map(m => `
          <div class="inline-block align-top w-full p-4">
            <div class="grid md:grid-cols-[96px_1fr] gap-4 items-start">
              <img src="${m.img}" alt="${m.name}" class="w-24 h-24 rounded-full object-cover ring-4 ring-primary-50 dark:ring-primary-900/40">
              <div>
                <h4 class="font-semibold">${m.name}</h4>
                <p class="text-sm text-slate-500 dark:text-slate-400">${m.role||''}</p>
                <p class="mt-2 text-sm text-slate-700 dark:text-slate-300">${m.bio||''}</p>
                ${m.email ? `<p class="mt-2 text-sm"><a class="text-primary-700 dark:text-accent-300 hover:underline" href="mailto:${m.email}">${m.email}</a></p>` : ''}
              </div>
            </div>
          </div>
        `).join('');

        const state = { i: 0, max: Math.max(0, members.length - 1) };
        const apply = () => { track.style.transform = `translateX(-${state.i*100}%)`; };
        btnPrev?.addEventListener('click', () => { state.i = (state.i<=0 ? state.max : state.i-1); apply(); });
        btnNext?.addEventListener('click', () => { state.i = (state.i>=state.max ? 0 : state.i+1); apply(); });
        apply();
      }

      // Proyectos
      const grid = document.getElementById('projectsGrid');
      if (grid){
        grid.innerHTML = (data.projects||[]).map(p => `
          <article class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer select-none" data-proj="${p.id}">
            <div class="relative group">
              <img src="${p.img}" alt="${p.title}" class="w-full h-44 object-cover">
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition">
                <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <div class="w-12 h-12 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                    <i data-feather="search" class="w-5 h-5"></i>
                  </div>
                </div>
              </div>
            </div>
            <div class="p-4">
              <h4 class="font-semibold">${p.title}</h4>
              <p class="text-sm text-slate-600 dark:text-slate-300 mt-1">${p.summary||''}</p>
            </div>
            <div class="px-4 pb-4 hidden" id="det-${p.id}">
              <div class="mt-2 rounded-lg border border-slate-200 dark:border-slate-700 p-3 text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/30">
                ${p.details||''}
              </div>
            </div>
          </article>
        `).join('');

        grid.addEventListener('click', (e)=>{
          const card = e.target.closest('article[data-proj]');
          if (!card) return;
          const id = card.getAttribute('data-proj');
          const panel = document.getElementById(`det-${id}`);
          if (panel) panel.classList.toggle('hidden');
        });
      }

      feather.replace();
    }

    function renderContactFromCMS(){
      const list = window.CMS_CONTENT.contacto || [];
      const root = document.getElementById('contactCards');
      if (!root) return;
      root.innerHTML = list.map(c=>`
        <div class="flex items-start gap-4">
          <div class="bg-primary-100 dark:bg-primary-900 p-2 rounded-lg">
            <i data-feather="${c.icon}" class="w-5 h-5 text-primary-600"></i>
          </div>
          <div>
            <h4 class="font-medium">${tt(c.title)}</h4>
            ${tt(c.html)}
          </div>
        </div>`).join('');
      feather.replace();
    }

    /* ---- Montaje y navegación ---- */
    function mount(templateId){
      const tpl = document.getElementById(templateId) || document.getElementById('notfound');
      app.innerHTML = '';
      app.appendChild(tpl.content.cloneNode(true));
      setTimeout(()=> feather.replace(), 0);
      translate();

      if(templateId==='home')         renderHomeFromCMS();
      if(templateId==='eventos')      renderEventsFromCMS();
      if(templateId==='publicaciones')renderPubsFromCMS();
      if(templateId==='investigacion')renderResearchPageFromCMS();
      if(templateId==='docencia')     renderTeachingFromCMS();
      if(templateId==='blog'){
        renderBlogFromCMS();
        const listEl = document.getElementById('postsList');
        const toggleText = document.getElementById('toggleListText');
        if (listEl && toggleText){
          listEl.classList.remove('hidden');
          toggleText.textContent = getLang()==='es'?'Ocultar lista':'Hide list';
        }
      }
      if(templateId==='galeria')      renderUabcGallery();  /* ← NUEVA GALERÍA */
      if(templateId==='contacto')     renderContactFromCMS();

      // Botones de descarga de CV
      const dl1 = document.getElementById('downloadCvBtn');
      const dl2 = document.getElementById('downloadCvSidebar');
      [dl1, dl2].forEach(btn=>{
        if(btn){
          btn.addEventListener('click', ()=>{
            const a=document.createElement('a');
            a.href=window.CMS_CV_URL;
            a.download=window.CMS_CV_URL.split('/').pop()||'cv.pdf';
            a.rel='noopener';
            document.body.appendChild(a); a.click(); a.remove();
          });
        }
      });
    }

    function render(){ const route = routeNameFromHash(); setActive(route); mount(route); window.scrollTo({ top:0, behavior:'smooth' }); }

    // --- Control off-canvas móvil ---
    let sidebar, backdrop, btnOpen, btnClose;

    function openSidebar(){
      sidebar.classList.remove('-translate-x-full');
      sidebar.classList.add('translate-x-0');
      backdrop.classList.remove('opacity-0','pointer-events-none');
      sidebar.setAttribute('aria-hidden','false');
      btnOpen?.setAttribute('aria-expanded','true');
      document.body.classList.add('overflow-hidden');
    }
    function closeSidebar(){
      sidebar.classList.add('-translate-x-full');
      sidebar.classList.remove('translate-x-0');
      backdrop.classList.add('opacity-0','pointer-events-none');
      sidebar.setAttribute('aria-hidden','true');
      btnOpen?.setAttribute('aria-expanded','false');
      document.body.classList.remove('overflow-hidden');
    }
    const isMobile = () => window.matchMedia('(max-width: 767px)').matches;

    window.addEventListener('hashchange', render);

    // Init
    window.addEventListener('DOMContentLoaded', ()=>{
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      AOS.init({ duration: prefersReduced ? 0 : 600, once: true, disable: prefersReduced });

      if(!localStorage.getItem('lang'))  localStorage.setItem('lang','es');
      if(!localStorage.getItem('theme')) localStorage.setItem('theme','light');

      document.getElementById('langBtn').addEventListener('click', ()=> setLang(getLang()==='es'?'en':'es'));
      document.getElementById('themeBtn').addEventListener('click', ()=> setTheme(getTheme()==='light'?'dark':'light'));

      applyTheme();
      translate();
      render();

      // Obtener refs para off-canvas
      sidebar  = document.getElementById('sidebar');
      backdrop = document.getElementById('backdrop');
      btnOpen  = document.getElementById('mobileMenuBtn');
      btnClose = document.getElementById('closeSidebarBtn');

      // Listeners
      btnOpen?.addEventListener('click', openSidebar);
      btnClose?.addEventListener('click', closeSidebar);
      backdrop?.addEventListener('click', closeSidebar);
      document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeSidebar(); });

      // Enlaces del menú
      links().forEach(a=>{
        a.addEventListener('click', (ev)=>{
          ev.preventDefault();
          const href=a.getAttribute('href');
          if(window.location.hash!==href){ window.location.hash=href; } else { render(); }
          if (isMobile()) closeSidebar();
        });
      });

      // Reset al cambiar de tamaño
      window.addEventListener('resize', ()=>{
        if (!isMobile()) {
          sidebar.classList.remove('-translate-x-full', 'translate-x-0');
          backdrop.classList.add('opacity-0','pointer-events-none');
          sidebar.setAttribute('aria-hidden','false');
          document.body.classList.remove('overflow-hidden');
          btnOpen?.setAttribute('aria-expanded','false');
        } else {
          closeSidebar();
        }
      });
    });

    /* ---------- Podcast (popup) ---------- */
    window.CMS_CONTENT = window.CMS_CONTENT || {};
    window.CMS_CONTENT.podcast = window.CMS_CONTENT.podcast || {
      spotify_show_url: 'https://open.spotify.com/show/XXXXXXXX',
      apple_show_url:   'https://podcasts.apple.com/xx/podcast/idYYYYYYYY',
      featured: {
        provider: 'spotify',
        id: '3z2xAbCdEfGhIjKlMnOpQr',
        title: {es:'Bienvenida al podcast', en:'Welcome to the podcast'},
        date:  {es:'02 Feb 2025', en:'Feb 2, 2025'},
        length_min: 12,
        summary: {es:'Qué temas cubriremos y por qué.', en:'What we will cover and why.'}
      },
      episodes: [
        { provider:'spotify', id:'1A2B3C4D5E6F',
          title:{es:'Felicidad y trabajo remoto',en:'Happiness & Remote Work'},
          date:{es:'Ene 25, 2025',en:'Jan 25, 2025'}, length_min:18 },
        { provider:'self', src:'assets/podcast/ep2.mp3',
          title:{es:'Inteligencia Colectiva 101',en:'Collective Intelligence 101'},
          date:{es:'Ene 10, 2025',en:'Jan 10, 2025'}, length_min:16 }
      ]
    };

    function spotifyIframe(episodeId, h=152){
      return `
        <iframe style="border-radius:12px"
          src="https://open.spotify.com/embed/episode/${episodeId}?utm_source=generator"
          width="100%" height="${h}" frameborder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"></iframe>`;
    }
    function selfAudio(src){
      return `
        <audio controls class="w-full">
          <source src="${src}" type="audio/mpeg">
          Tu navegador no soporta audio HTML5.
        </audio>`;
    }
    function renderPodcastModalFromCMS(){
      const data = window.CMS_CONTENT.podcast || {};
      const $featured = document.getElementById('podcastFeaturedModal');
      const $list = document.getElementById('podcastListModal');
      const minutesLabel = (I18N[getLang()] && I18N[getLang()].minutes) || 'min';

      if ($featured){
        const f = data.featured || {};
        const player = f.provider === 'spotify' ? spotifyIframe(f.id, 232)
                 : f.provider === 'self'    ? selfAudio(f.src)
                 : '';
        $featured.innerHTML = `
          <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
            <div class="flex items-start gap-3">
              <div class="shrink-0">
                <div class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                  <i data-feather="headphones" class="w-5 h-5 text-primary-600"></i>
                </div>
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="font-semibold">${tt(f.title)||''}</h3>
                <p class="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                  ${tt(f.date)||''}${f.length_min?` • ${f.length_min} ${minutesLabel}`:''}
                </p>
                ${f.summary ? `<p class="text-slate-700 dark:text-slate-300 mt-2">${tt(f.summary)}</p>` : ``}
              </div>
            </div>
            <div class="mt-3">${player}</div>
          </div>
        `;
      }

      if ($list){
        const rows = (data.episodes||[]).map(ep=>{
          const player = ep.provider === 'spotify' ? spotifyIframe(ep.id)
                   : ep.provider === 'self'    ? selfAudio(ep.src)
                   : '';
          return `
            <article class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3">
              <h4 class="font-medium">${tt(ep.title)}</h4>
              <p class="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                ${tt(ep.date)}${ep.length_min?` • ${ep.length_min} ${minutesLabel}`:''}
              </p>
              <div class="mt-2">${player}</div>
            </article>
          `;
        }).join('');
        $list.innerHTML = rows;
      }

      feather.replace();
    }
    function openPodcastModal(){
      const modal = document.getElementById('podcastModal');
      if (!modal) return;
      renderPodcastModalFromCMS();
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden','false');
      document.body.classList.add('overflow-hidden');
    }
    function closePodcastModal(){
      const modal = document.getElementById('podcastModal');
      if (!modal) return;
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden','true');
      document.body.classList.remove('overflow-hidden');
    }
    document.addEventListener('DOMContentLoaded', ()=>{
      document.getElementById('openPodcastBtn')?.addEventListener('click', openPodcastModal);
      document.getElementById('closePodcastBtn')?.addEventListener('click', closePodcastModal);
      document.getElementById('podcastBackdrop')?.addEventListener('click', closePodcastModal);
      document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closePodcastModal(); });
    });

// Enlaza las URLs del show del podcast cuando cargue la página
    document.addEventListener('DOMContentLoaded', () => {
      const data = window.CMS_CONTENT?.podcast || {};
      const s = document.getElementById('podcastSpotify');
      const a = document.getElementById('podcastApple');
      if (s && data.spotify_show_url) s.href = data.spotify_show_url;
      if (a && data.apple_show_url) a.href = data.apple_show_url;
    });

try{document.addEventListener('DOMContentLoaded',()=>{ if(window.feather){ window.feather.replace(); } });}catch(_){}
