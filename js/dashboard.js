/* Filtros, cálculos y visualizaciones del dashboard de temporada. */
(() => {
  const data = window.LIGA_PRO_DATA;
  if (!data || !window.Chart) return;

  const { teams, matches, topScorers, totalRounds } = data;
  const elements = {
    team: document.getElementById('team-filter'),
    start: document.getElementById('date-start'),
    end: document.getElementById('date-end'),
    venue: document.getElementById('venue-filter'),
    metric: document.getElementById('metric-filter'),
    trendTeams: document.getElementById('trend-team-filter'),
    compareA: document.getElementById('compare-team-a'),
    compareB: document.getElementById('compare-team-b'),
    search: document.getElementById('team-search'),
    tableBody: document.getElementById('standings-body'),
    scorerList: document.getElementById('scorer-list')
  };
  const chartInstances = {};
  let sortState = { key: 'points', direction: -1 };
  let currentStats = [];
  let currentGames = [];

  const teamById = new Map(teams.map((team) => [team.id, team]));
  const formatNumber = (value) => new Intl.NumberFormat('es-EC').format(Math.round(value));
  const teamName = (id) => teamById.get(id)?.name || id;

  function fillSelect(select, includeAll = false) {
    if (!select) return;
    select.replaceChildren();
    if (includeAll) select.add(new Option('Todos los equipos', 'all'));
    teams.forEach((team) => select.add(new Option(team.name, team.id)));
  }

  fillSelect(elements.team, true);
  fillSelect(elements.trendTeams);
  fillSelect(elements.compareA);
  fillSelect(elements.compareB);
  elements.compareA.value = teams[0].id;
  elements.compareB.value = teams[1].id;
  [elements.start, elements.end].forEach((input) => { input.max = String(totalRounds); });

  function getFilteredGames() {
    const startRound = Number(elements.start.value);
    const endRound = Number(elements.end.value);
    const selectedTeam = elements.team.value;
    const venue = elements.venue.value;
    return matches.filter((match) => {
      if (match.round < startRound || match.round > endRound) return false;
      if (selectedTeam !== 'all' && match.homeId !== selectedTeam && match.awayId !== selectedTeam) return false;
      if (selectedTeam !== 'all' && venue === 'home' && match.homeId !== selectedTeam) return false;
      if (selectedTeam !== 'all' && venue === 'away' && match.awayId !== selectedTeam) return false;
      return true;
    });
  }

  function addAppearance(stats, teamId, goalsFor, goalsAgainst, cards) {
    const record = stats.get(teamId);
    record.played += 1;
    record.goalsFor += goalsFor;
    record.goalsAgainst += goalsAgainst;
    record.cards += cards;
    if (goalsFor > goalsAgainst) { record.won += 1; record.points += 3; record.result = 'win'; }
    else if (goalsFor === goalsAgainst) { record.drawn += 1; record.points += 1; record.result = 'draw'; }
    else { record.lost += 1; record.result = 'loss'; }
  }

  function calculateStats(games) {
    const stats = new Map(teams.map((team) => [team.id, {
      id: team.id, name: team.name, played: 0, won: 0, drawn: 0, lost: 0,
      goalsFor: 0, goalsAgainst: 0, points: 0, cards: 0
    }]));
    const venue = elements.venue.value;
    games.forEach((match) => {
      if (venue !== 'away') addAppearance(stats, match.homeId, match.homeGoals, match.awayGoals, match.homeCards);
      if (venue !== 'home') addAppearance(stats, match.awayId, match.awayGoals, match.homeGoals, match.awayCards);
    });
    return [...stats.values()].map((row) => ({ ...row, goalDifference: row.goalsFor - row.goalsAgainst }));
  }

  function getAppearanceResults(games) {
    const results = { win: 0, draw: 0, loss: 0 };
    const venue = elements.venue.value;
    games.forEach((match) => {
      if (venue !== 'away') {
        if (match.homeGoals > match.awayGoals) results.win += 1;
        else if (match.homeGoals === match.awayGoals) results.draw += 1;
        else results.loss += 1;
      }
      if (venue !== 'home') {
        if (match.awayGoals > match.homeGoals) results.win += 1;
        else if (match.awayGoals === match.homeGoals) results.draw += 1;
        else results.loss += 1;
      }
    });
    return results;
  }

  function getFilteredScorers(games) {
    const totals = new Map();
    const venue = elements.venue.value;
    games.forEach((match) => {
      const scorerSides = [];
      if (venue !== 'away') scorerSides.push(match.homeScorers);
      if (venue !== 'home') scorerSides.push(match.awayScorers);
      scorerSides.flat().forEach((name) => {
        const scorer = topScorers.find((player) => player.name === name.trim());
        const current = totals.get(name.trim()) || { name: name.trim(), goals: 0, team: scorer?.team || '' };
        current.goals += 1;
        totals.set(name.trim(), current);
      });
    });
    return [...totals.values()].sort((first, second) => second.goals - first.goals || first.name.localeCompare(second.name, 'es'));
  }

  function getChartColors() {
    const styles = getComputedStyle(document.documentElement);
    return {
      text: styles.getPropertyValue('--ink-soft').trim(),
      ink: styles.getPropertyValue('--ink').trim(),
      line: styles.getPropertyValue('--line').trim(),
      teal: styles.getPropertyValue('--teal').trim(),
      yellow: styles.getPropertyValue('--yellow').trim(),
      coral: styles.getPropertyValue('--coral').trim(),
      blue: styles.getPropertyValue('--blue').trim(),
      surface: styles.getPropertyValue('--surface').trim()
    };
  }

  function chartOptions({ horizontal = false, stacked = false, legend = false } = {}) {
    const colors = getChartColors();
    return {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: horizontal ? 'y' : 'x',
      animation: { duration: 450 },
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { display: legend, position: 'bottom', labels: { color: colors.text, usePointStyle: true, boxWidth: 8, padding: 14, font: { family: 'DM Sans', size: 10 } } },
        tooltip: { backgroundColor: colors.ink, titleColor: colors.surface, bodyColor: colors.surface, padding: 10, cornerRadius: 3, titleFont: { family: 'DM Sans', weight: 'bold', size: 11 }, bodyFont: { family: 'DM Sans', size: 10 } }
      },
      scales: {
        x: { stacked, beginAtZero: horizontal, grid: horizontal ? { color: colors.line, drawTicks: false } : { display: false }, ticks: { color: colors.text, font: { family: 'DM Sans', size: 9 } }, border: { display: false } },
        y: { stacked, beginAtZero: !horizontal, grid: horizontal ? { display: false } : { color: colors.line, drawTicks: false }, ticks: { color: colors.text, font: { family: 'DM Sans', size: 9 } }, border: { display: false } }
      }
    };
  }

  function createCharts() {
    const colors = getChartColors();
    chartInstances.main = new Chart(document.getElementById('main-chart'), {
      type: 'bar', data: { labels: [], datasets: [{ label: 'Puntos', data: [], backgroundColor: colors.teal, borderRadius: 2, maxBarThickness: 15 }] },
      options: chartOptions({ horizontal: true })
    });
    chartInstances.results = new Chart(document.getElementById('results-chart'), {
      type: 'doughnut', data: { labels: ['Victoria', 'Empate', 'Derrota'], datasets: [{ data: [0, 0, 0], backgroundColor: [colors.teal, colors.yellow, colors.coral], borderColor: colors.surface, borderWidth: 3, hoverOffset: 5 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: '69%', animation: { duration: 450 }, plugins: { legend: { display: false }, tooltip: chartOptions().plugins.tooltip } }
    });
    chartInstances.trend = new Chart(document.getElementById('trend-chart'), {
      type: 'line', data: { labels: [], datasets: [] },
      options: { ...chartOptions({ legend: true }), elements: { line: { tension: .32, borderWidth: 2 }, point: { radius: 0, hoverRadius: 4 } } }
    });
    chartInstances.compare = new Chart(document.getElementById('compare-chart'), {
      type: 'radar', data: { labels: ['GF / PJ', 'GC / PJ', 'Victorias / 20', 'Tarjetas / PJ'], datasets: [] },
      options: { ...chartOptions({ legend: true }), scales: { r: { beginAtZero: true, suggestedMax: 5, grid: { color: colors.line }, angleLines: { color: colors.line }, pointLabels: { color: colors.text, font: { family: 'DM Sans', size: 9 } }, ticks: { display: false, stepSize: 1 } } } }
    });
  }

  function updateKpis(games, stats) {
    const totalGoals = stats.reduce((total, row) => total + row.goalsFor, 0);
    const appearances = stats.reduce((total, row) => total + row.played, 0);
    const leader = [...stats].filter((row) => row.played).sort((first, second) => second.points - first.points || second.goalDifference - first.goalDifference || second.goalsFor - first.goalsFor)[0];
    const scorer = getFilteredScorers(games)[0];
    const averageAttendance = games.length ? games.reduce((total, match) => total + match.attendance, 0) / games.length : 0;
    document.getElementById('kpi-matches').textContent = formatNumber(games.length);
    document.getElementById('kpi-matches-note').textContent = `${games.length === 1 ? 'Partido' : 'Partidos'} en el rango seleccionado`;
    document.getElementById('kpi-goals').textContent = formatNumber(totalGoals);
    document.getElementById('kpi-goals-note').textContent = 'Goles en el rango seleccionado';
    document.getElementById('kpi-average').textContent = games.length ? (totalGoals / games.length).toFixed(2) : '0.00';
    document.getElementById('kpi-leader').textContent = leader?.name || 'Sin datos';
    document.getElementById('kpi-leader-note').textContent = leader ? `${leader.points} pts · ${leader.played} PJ` : 'Por puntos';
    document.getElementById('kpi-scorer').textContent = scorer?.name || 'Sin goles';
    document.getElementById('kpi-scorer-note').textContent = scorer ? `${scorer.goals} goles · ${scorer.team}` : 'En el rango seleccionado';
    document.getElementById('kpi-attendance').textContent = games.length ? formatNumber(averageAttendance) : '0';
    document.getElementById('chart-period').textContent = `FECHAS ${elements.start.value}–${elements.end.value}`;
    document.getElementById('main-chart-title').textContent = elements.metric.value === 'points' ? 'Puntos por equipo' : 'Goles a favor por equipo';
  }

  function updateReportSummary() {
    const selectedTeam = elements.team.selectedOptions[0].textContent;
    const selectedVenue = elements.venue.selectedOptions[0].textContent;
    const selectedMetric = elements.metric.selectedOptions[0].textContent;
    document.getElementById('report-filter-summary').textContent = `Filtros aplicados: ${selectedTeam} · Fechas ${elements.start.value}–${elements.end.value} · ${selectedVenue} · Métrica: ${selectedMetric}`;
  }

  function updateMainChart(stats) {
    const metric = elements.metric.value;
    const ordered = [...stats].sort((first, second) => second[metric] - first[metric] || first.name.localeCompare(second.name, 'es'));
    const chart = chartInstances.main;
    chart.data.labels = ordered.map((row) => row.name);
    chart.data.datasets[0].label = metric === 'points' ? 'Puntos' : 'Goles a favor';
    chart.data.datasets[0].data = ordered.map((row) => row[metric]);
    chart.data.datasets[0].backgroundColor = ordered.map((row, index) => index === 0 ? getChartColors().teal : `${getChartColors().teal}99`);
    chart.update();
  }

  function updateResultsChart(games) {
    const results = getAppearanceResults(games);
    const chart = chartInstances.results;
    chart.data.datasets[0].data = [results.win, results.draw, results.loss];
    chart.update();
    const entries = [['Victoria', results.win, getChartColors().teal], ['Empate', results.draw, getChartColors().yellow], ['Derrota', results.loss, getChartColors().coral]];
    document.getElementById('result-summary').innerHTML = entries.map(([label, value, color]) => `<span><i class="result-dot" style="background:${color}"></i>${label} ${formatNumber(value)}</span>`).join('');
  }

  function updateTrendChart(games, stats) {
    const selectedIds = [...elements.trendTeams.selectedOptions].map((option) => option.value).slice(0, 4);
    const visibleIds = selectedIds.length ? selectedIds : [...stats].filter((row) => row.played).sort((first, second) => second.points - first.points).slice(0, 3).map((row) => row.id);
    if (!selectedIds.length) visibleIds.forEach((id) => { const option = [...elements.trendTeams.options].find((item) => item.value === id); if (option) option.selected = true; });
    const roundLabels = Array.from({ length: Number(elements.end.value) - Number(elements.start.value) + 1 }, (_, index) => `F${Number(elements.start.value) + index}`);
    const colors = [getChartColors().teal, getChartColors().yellow, getChartColors().coral, getChartColors().blue];
    chartInstances.trend.data.labels = roundLabels;
    chartInstances.trend.data.datasets = visibleIds.map((id, teamIndex) => {
      let accumulated = 0;
      const values = roundLabels.map((label) => {
        const round = Number(label.slice(1));
        games.filter((match) => match.round === round).forEach((match) => {
          if (elements.venue.value !== 'away' && match.homeId === id) accumulated += match.homeGoals > match.awayGoals ? 3 : match.homeGoals === match.awayGoals ? 1 : 0;
          if (elements.venue.value !== 'home' && match.awayId === id) accumulated += match.awayGoals > match.homeGoals ? 3 : match.awayGoals === match.homeGoals ? 1 : 0;
        });
        return accumulated;
      });
      return { label: teamName(id), data: values, borderColor: colors[teamIndex], backgroundColor: colors[teamIndex], fill: false };
    });
    chartInstances.trend.update();
  }

  function updateCompareChart(stats) {
    let firstId = elements.compareA.value;
    let secondId = elements.compareB.value;
    if (firstId === secondId) {
      secondId = teams.find((team) => team.id !== firstId)?.id || firstId;
      elements.compareB.value = secondId;
    }
    const colors = [getChartColors().teal, getChartColors().coral];
    chartInstances.compare.data.datasets = [firstId, secondId].map((id, index) => {
      const row = stats.find((team) => team.id === id);
      const played = row?.played || 0;
      return {
        label: teamName(id),
        data: played ? [row.goalsFor / played, row.goalsAgainst / played, row.won / played * 5, row.cards / played] : [0, 0, 0, 0],
        borderColor: colors[index], backgroundColor: `${colors[index]}30`, pointBackgroundColor: colors[index], borderWidth: 2
      };
    });
    chartInstances.compare.update();
  }

  function renderStandings(stats) {
    const sorted = [...stats].sort((first, second) => {
      const firstValue = sortState.key === 'position' ? first.points : first[sortState.key] ?? first.name;
      const secondValue = sortState.key === 'position' ? second.points : second[sortState.key] ?? second.name;
      if (typeof firstValue === 'string') return firstValue.localeCompare(secondValue, 'es') * sortState.direction;
      return (firstValue - secondValue) * sortState.direction;
    });
    currentStats = sorted;
    const query = elements.search.value.trim().toLocaleLowerCase('es');
    const filtered = sorted.filter((row) => row.name.toLocaleLowerCase('es').includes(query));
    if (!filtered.length) {
      elements.tableBody.innerHTML = '<tr><td colspan="8" class="empty-state">No hay equipos que coincidan con la búsqueda.</td></tr>';
      return;
    }
    elements.tableBody.innerHTML = filtered.map((row) => {
      const position = sorted.indexOf(row) + 1;
      const zone = position <= 4 ? 'zone-cup' : position > teams.length - 2 ? 'zone-danger' : '';
      return `<tr class="${zone}"><td>${position}</td><td>${row.name}</td><td>${row.played}</td><td>${row.won}</td><td>${row.drawn}</td><td>${row.lost}</td><td>${row.goalDifference > 0 ? '+' : ''}${row.goalDifference}</td><td>${row.points}</td></tr>`;
    }).join('');
  }

  function renderScorers(games) {
    const scorers = getFilteredScorers(games).slice(0, 5);
    if (!scorers.length) {
      elements.scorerList.innerHTML = '<p class="empty-state">No hay goles en este periodo.</p>';
      return;
    }
    const maxGoals = Math.max(...scorers.map((scorer) => scorer.goals), 1);
    elements.scorerList.innerHTML = scorers.map((scorer, index) => `<div class="scorer-item"><span class="scorer-rank">${String(index + 1).padStart(2, '0')}</span><span class="scorer-name">${scorer.name}<small class="scorer-team">${scorer.team}</small></span><span class="scorer-bar-track" aria-hidden="true"><i class="scorer-bar" style="width:${scorer.goals / maxGoals * 100}%"></i></span><strong class="scorer-goals">${scorer.goals}</strong></div>`).join('');
  }

  function updateDashboard() {
    currentGames = getFilteredGames();
    const stats = calculateStats(currentGames);
    updateReportSummary();
    updateKpis(currentGames, stats);
    updateMainChart(stats);
    updateResultsChart(currentGames);
    updateTrendChart(currentGames, stats);
    updateCompareChart(stats);
    renderStandings(stats);
    renderScorers(currentGames);
  }

  function updateThemeColors() {
    if (!chartInstances.main) return;
    const colors = getChartColors();
    Object.values(chartInstances).forEach((chart) => {
      if (chart.options.plugins?.legend?.labels) chart.options.plugins.legend.labels.color = colors.text;
      if (chart.options.plugins?.tooltip) {
        chart.options.plugins.tooltip.backgroundColor = colors.ink;
        chart.options.plugins.tooltip.titleColor = colors.surface;
        chart.options.plugins.tooltip.bodyColor = colors.surface;
      }
      if (chart.options.scales?.x) {
        chart.options.scales.x.ticks.color = colors.text;
        chart.options.scales.x.grid.color = colors.line;
      }
      if (chart.options.scales?.y) {
        chart.options.scales.y.ticks.color = colors.text;
        chart.options.scales.y.grid.color = colors.line;
      }
      if (chart.options.scales?.r) {
        chart.options.scales.r.grid.color = colors.line;
        chart.options.scales.r.angleLines.color = colors.line;
        chart.options.scales.r.pointLabels.color = colors.text;
      }
      chart.update('none');
    });
    updateResultsChart(currentGames);
  }

  function updateRangeLabels() {
    document.getElementById('date-start-value').value = elements.start.value;
    document.getElementById('date-end-value').value = elements.end.value;
  }

  [elements.team, elements.venue, elements.metric, elements.trendTeams, elements.compareA, elements.compareB].forEach((input) => input.addEventListener('change', updateDashboard));
  elements.start.addEventListener('input', () => {
    if (Number(elements.start.value) > Number(elements.end.value)) elements.end.value = elements.start.value;
    updateRangeLabels();
    updateDashboard();
  });
  elements.end.addEventListener('input', () => {
    if (Number(elements.end.value) < Number(elements.start.value)) elements.start.value = elements.end.value;
    updateRangeLabels();
    updateDashboard();
  });
  elements.search.addEventListener('input', () => renderStandings(currentStats));
  document.querySelectorAll('[data-sort]').forEach((button) => button.addEventListener('click', () => {
    const key = button.dataset.sort === 'position' ? 'points' : button.dataset.sort;
    sortState = { key, direction: sortState.key === key ? sortState.direction * -1 : -1 };
    renderStandings(calculateStats(currentGames));
  }));
  document.getElementById('reset-filters').addEventListener('click', () => {
    elements.team.value = 'all';
    elements.start.value = '1';
    elements.end.value = String(totalRounds);
    elements.venue.value = 'all';
    elements.metric.value = 'points';
    elements.search.value = '';
    elements.trendTeams.selectedOptions && [...elements.trendTeams.options].forEach((option) => { option.selected = false; });
    elements.compareA.value = teams[0].id;
    elements.compareB.value = teams[1].id;
    sortState = { key: 'points', direction: -1 };
    updateRangeLabels();
    updateDashboard();
  });
  window.addEventListener('aula-theme-change', updateThemeColors);
  document.getElementById('export-pdf').addEventListener('click', () => window.print());
  window.addEventListener('beforeprint', () => Object.values(chartInstances).forEach((chart) => chart.resize()));

  createCharts();
  updateRangeLabels();
  updateDashboard();
})();
