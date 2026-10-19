/* Renderizado del sílabo, navegación por secciones y cuenta regresiva. */
(() => {
  const data = window.SILABO_DATA;
  if (!data) return;

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const dateParts = (isoDate) => isoDate.split('-').map(Number);
  const dateAtStart = (isoDate) => {
    const [year, month, day] = dateParts(isoDate);
    return new Date(year, month - 1, day, 0, 0, 0);
  };
  const dateAtClose = (evaluation) => {
    const [year, month, day] = dateParts(evaluation.date);
    const [hour, minute, second] = evaluation.closingTime.split(':').map(Number);
    return new Date(year, month - 1, day, hour, minute, second);
  };
  const formatDate = (isoDate, options = { day: '2-digit', month: 'long', year: 'numeric' }) => new Intl.DateTimeFormat('es-EC', options).format(dateAtStart(isoDate));

  function renderHero() {
    document.getElementById('hero-code').textContent = `${data.general.code} · CICLO ${data.general.cycleNumber} · PARALELO ${data.general.parallel}`;
    document.getElementById('hero-institution').textContent = `${data.general.university} · Sede ${data.general.campus} · Facultad ${data.general.faculty}`;
    document.getElementById('silabo-title').textContent = data.general.subject;
    document.getElementById('hero-description').textContent = 'Información esencial del curso: objetivos, contenidos, dedicación académica y evaluaciones del periodo.';
    document.getElementById('subject-description').textContent = data.description;
    document.getElementById('subject-objective').textContent = data.objective;
    document.getElementById('graduate-contribution').textContent = data.graduateContribution;
  }

  function renderGeneral() {
    const period = `${formatDate(data.general.periodStart, { day: '2-digit', month: 'short', year: 'numeric' })} – ${formatDate(data.general.periodEnd, { day: '2-digit', month: 'short', year: 'numeric' })}`;
    const cards = [
      ['CARRERA', data.general.career, '◈'],
      ['CICLO', `${data.general.cycle} (${data.general.cycleNumber})`, '08'],
      ['CRÉDITOS', String(data.general.credits), '✳'],
      ['PARALELO', `${data.general.parallel} · ${data.general.courseType}`, 'A'],
      ['PERIODO ACADÉMICO', period, '◷'],
      ['DOCENTE', data.general.teacher.name, '↗']
    ];
    document.getElementById('general-cards').innerHTML = cards.map(([label, value, icon]) => `<article class="general-card"><span class="general-card-icon" aria-hidden="true">${escapeHtml(icon)}</span><span class="general-card-label">${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`).join('');

    const hours = data.general.hours;
    const firstStop = hours.teaching / hours.total * 100;
    const secondStop = firstStop + hours.practice / hours.total * 100;
    const donut = document.getElementById('hours-donut');
    donut.style.setProperty('--hours-teaching', `${firstStop}%`);
    donut.style.setProperty('--hours-practice', `${secondStop}%`);
    donut.setAttribute('aria-label', `${hours.total} horas totales: ${hours.teaching} de docencia, ${hours.practice} prácticas y ${hours.autonomous} autónomas.`);
    document.getElementById('hours-total').textContent = `${hours.total} H`; 
    document.getElementById('hours-center').textContent = String(hours.total);
    const categories = [
      ['Docencia', hours.teaching, 'hours-dot-teaching'],
      ['Prácticas', hours.practice, 'hours-dot-practice'],
      ['Autónomas', hours.autonomous, 'hours-dot-autonomous']
    ];
    document.getElementById('hours-legend').innerHTML = categories.map(([label, value, className]) => `<li><span class="${className}" aria-hidden="true"></span><span>${label}</span><strong>${value} h</strong></li>`).join('');
  }

  function renderEvaluations() {
    const timeline = document.getElementById('evaluation-timeline');
    timeline.innerHTML = data.evaluations.map((evaluation, index) => {
      const passed = dateAtClose(evaluation).getTime() < Date.now();
      return `<li class="evaluation-item ${passed ? 'is-past' : ''}" data-evaluation-id="${escapeHtml(evaluation.id)}"><span class="evaluation-number">0${index + 1}</span><span class="evaluation-dot" aria-hidden="true"></span><div class="evaluation-date"><strong>${escapeHtml(evaluation.name)}</strong><time datetime="${escapeHtml(evaluation.date)}">${escapeHtml(formatDate(evaluation.date))}</time><small>Cierre ${escapeHtml(evaluation.closingTime)}</small></div><span class="evaluation-state">${passed ? 'CERRADA' : 'PRÓXIMA'}</span></li>`;
    }).join('');
    updateCountdown();
  }

  function updateCountdown() {
    const now = Date.now();
    const upcoming = data.evaluations.find((evaluation) => dateAtClose(evaluation).getTime() >= now);
    const title = document.getElementById('countdown-title');
    const counter = document.getElementById('countdown');
    if (!upcoming) {
      document.getElementById('countdown-label').textContent = 'FIN DEL PERIODO';
      title.textContent = 'Periodo finalizado';
      counter.innerHTML = '';
      return;
    }
    const difference = Math.max(0, dateAtClose(upcoming).getTime() - now);
    const days = Math.floor(difference / 86400000);
    const hours = Math.floor(difference % 86400000 / 3600000);
    const minutes = Math.floor(difference % 3600000 / 60000);
    document.getElementById('countdown-label').textContent = `PRÓXIMO CIERRE · ${upcoming.name}`;
    title.textContent = `Hasta el ${formatDate(upcoming.date)}`;
    counter.innerHTML = `<span><strong>${days}</strong><small>DÍAS</small></span><i aria-hidden="true">:</i><span><strong>${String(hours).padStart(2, '0')}</strong><small>HORAS</small></span><i aria-hidden="true">:</i><span><strong>${String(minutes).padStart(2, '0')}</strong><small>MIN</small></span>`;
  }

  function renderUnits() {
    document.getElementById('unit-list').innerHTML = data.units.map((unit, index) => `<details class="unit-accordion unit-${unit.color}" ${index === 0 ? 'open' : ''}>
      <summary><span class="unit-count">UNIDAD 0${unit.number}</span><span class="unit-summary-title">${escapeHtml(unit.title)}</span><span class="unit-hours-total">${unit.topics.reduce((sum, topic) => sum + topic.teaching + topic.practice, 0) + unit.autonomousHours} H</span><span class="accordion-indicator" aria-hidden="true">+</span></summary>
      <div class="unit-content">
        <div class="unit-learning-grid"><article><span class="unit-content-label">PROBLEMA PROFESIONAL</span><p>${escapeHtml(unit.problem)}</p></article><article><span class="unit-content-label">RESULTADO DE APRENDIZAJE</span><p>${escapeHtml(unit.outcome)}</p></article></div>
        <div class="unit-meta-row"><span><small>METODOLOGÍA</small><strong>${escapeHtml(unit.methodology)}</strong></span><span><small>EVALUACIÓN</small><strong>${escapeHtml(unit.evaluation)}</strong></span><span><small>TRABAJO AUTÓNOMO</small><strong>${unit.autonomousHours} horas</strong></span></div>
        <div class="unit-topics"><div class="unit-table-heading"><h3>Temas y dedicación</h3><span>DOCENCIA / PRÁCTICAS</span></div><ol>${unit.topics.map((topic) => `<li><span>${escapeHtml(topic.name)}</span><strong>${topic.teaching} h <i>/</i> ${topic.practice} h</strong></li>`).join('')}</ol></div>
        <div class="strategy-area"><span class="unit-content-label">ESTRATEGIAS DE APRENDIZAJE</span><div class="strategy-tags">${unit.strategies.map((strategy) => `<span>${escapeHtml(strategy)}</span>`).join('')}</div></div>
      </div>
    </details>`).join('');
  }

  function renderProject() {
    document.getElementById('project-title').textContent = data.project.title;
    document.getElementById('project-description').textContent = data.project.description;
    document.getElementById('project-tags').innerHTML = ['Copernicus', 'CMEMS', 'CEIPA', 'Dashboards · KPIs · alertas'].map((tag) => `<span>${escapeHtml(tag)}</span>`).join('');
  }

  function renderTeacher() {
    const teacher = data.general.teacher;
    document.getElementById('teacher-monogram').textContent = teacher.name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
    document.getElementById('teacher-title').textContent = teacher.name;
    const emailLink = document.getElementById('teacher-email');
    emailLink.href = `mailto:${teacher.email}`;
    emailLink.textContent = teacher.email;
    document.getElementById('teacher-profile').textContent = teacher.profile;
  }

  renderHero();
  renderGeneral();
  renderEvaluations();
  renderUnits();
  renderProject();
  renderTeacher();
  window.setInterval(updateCountdown, 60000);
})();
