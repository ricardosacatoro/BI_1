/* Navegación compartida, preferencias visuales y demostración ETL. */
(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const themeKey = 'aula-datos-theme';
  const storedTheme = localStorage.getItem(themeKey);
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  function applyTheme(theme) {
    root.dataset.theme = theme;
    if (themeButton) {
      const nextTheme = theme === 'dark' ? 'claro' : 'oscuro';
      themeButton.setAttribute('aria-label', `Activar modo ${nextTheme}`);
      themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#11201e' : '#f4f7f5');
    window.dispatchEvent(new CustomEvent('aula-theme-change', { detail: { theme } }));
  }

  applyTheme(storedTheme || (systemPrefersDark ? 'dark' : 'light'));
  themeButton?.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(themeKey, nextTheme);
    applyTheme(nextTheme);
  });

  const menuButton = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  menuButton?.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
    navLinks?.classList.toggle('is-open', !isOpen);
  });
  navLinks?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Abrir menú');
    navLinks.classList.remove('is-open');
  }));

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const etlPhases = {
    extract: {
      kicker: 'FASE 01', title: 'Extraer: conectar con el origen',
      copy: 'Se recopilan datos de sistemas transaccionales, archivos, servicios web o sensores, respetando su frecuencia y formato.',
      techniques: 'Conectores · consultas SQL · captura incremental', tools: 'Fivetran · Airbyte · Apache NiFi',
      before: [['ID', 'Cliente', 'Ciudad'], ['001', 'Ana Ruiz', 'Quito'], ['002', 'Luis Mora', 'guayaquil']],
      after: [['ID origen', 'Cliente', 'Ciudad origen'], ['001', 'Ana Ruiz', 'Quito'], ['002', 'Luis Mora', 'guayaquil']]
    },
    transform: {
      kicker: 'FASE 02', title: 'Transformar: limpiar y dar forma',
      copy: 'Los datos se validan, estandarizan y enriquecen para que sean consistentes y comparables antes del análisis.',
      techniques: 'Limpieza · deduplicación · normalización · agregación', tools: 'dbt · SQL · Power Query · Apache Spark',
      before: [['ID', 'Cliente', 'Ciudad'], ['001', 'Ana Ruiz', 'Quito'], ['002', 'Luis Mora', 'guayaquil']],
      after: [['ID', 'Cliente', 'Ciudad normalizada'], ['001', 'Ana Ruiz', 'QUITO'], ['002', 'Luis Mora', 'GUAYAQUIL']]
    },
    load: {
      kicker: 'FASE 03', title: 'Cargar: dejar listo para consultar',
      copy: 'La información preparada se almacena en un destino analítico, como un data warehouse, para reportes y modelos.',
      techniques: 'Carga completa o incremental · particionado · control de calidad', tools: 'BigQuery · Snowflake · PostgreSQL · Redshift',
      before: [['ID', 'Cliente', 'Ciudad normalizada'], ['001', 'Ana Ruiz', 'GUAYAQUIL'], ['002', 'Luis Mora', 'QUITO']],
      after: [['Ciudad', 'Clientes', 'Total compras'], ['GUAYAQUIL', '1', '$ 84.50'], ['QUITO', '1', '$ 126.00']]
    }
  };

  function renderEtlTable(phase) {
    const head = document.getElementById('etl-table-head');
    const body = document.getElementById('etl-table-body');
    if (!head || !body) return;
    const { before, after } = etlPhases[phase];
    const headings = before[0].map((label, index) => `<th scope="col">${label} <span aria-hidden="true">→</span> ${after[0][index] || ''}</th>`).join('');
    head.innerHTML = `<tr>${headings}</tr>`;
    body.innerHTML = before.slice(1).map((row, rowIndex) => `<tr>${row.map((value, columnIndex) => `<td>${value} <span aria-hidden="true">→</span> ${after[rowIndex + 1]?.[columnIndex] ?? '—'}</td>`).join('')}</tr>`).join('');
  }

  document.querySelectorAll('[data-etl-phase]').forEach((button) => {
    button.addEventListener('click', () => {
      const selectedPhase = button.dataset.etlPhase;
      document.querySelectorAll('[data-etl-phase]').forEach((phaseButton) => {
        const isActive = phaseButton === button;
        phaseButton.classList.toggle('is-active', isActive);
        phaseButton.setAttribute('aria-pressed', String(isActive));
      });
      const phase = etlPhases[selectedPhase];
      document.getElementById('etl-kicker').textContent = phase.kicker;
      document.getElementById('etl-phase-title').textContent = phase.title;
      document.getElementById('etl-phase-copy').textContent = phase.copy;
      document.getElementById('etl-techniques').textContent = phase.techniques;
      document.getElementById('etl-tools').textContent = phase.tools;
      renderEtlTable(selectedPhase);
    });
  });
  renderEtlTable('extract');
})();
