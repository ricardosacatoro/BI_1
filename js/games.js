/* Minijuegos del sílabo, XP, insignias y persistencia local. */
(() => {
  const data = window.SILABO_DATA;
  if (!data) return;

  const storageKey = 'utc-silabo-progress-v1';
  const freshProgress = () => ({ xp: 0, badges: [], bestScores: {}, bestMemorySeconds: null });
  function loadProgress() {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (!stored || typeof stored !== 'object') return freshProgress();
      return { ...freshProgress(), ...stored, badges: Array.isArray(stored.badges) ? stored.badges : [], bestScores: stored.bestScores || {} };
    } catch {
      return freshProgress();
    }
  }
  let progress = loadProgress();
  let selectedTabIndex = 0;
  let routePieces = [];
  let routePlaced = new Map();
  let routeSelectedId = null;
  let routeScore = 0;
  let routeErrors = 0;
  let routeFinished = false;
  let memoryCards = [];
  let memoryFlipped = [];
  let memoryMatched = new Set();
  let memoryMoves = 0;
  let memoryErrors = 0;
  let memorySeconds = 0;
  let memoryInterval = null;
  let memoryStarted = false;
  let memoryLocked = false;
  let triviaQuestions = [];
  let triviaIndex = 0;
  let triviaLives = 3;
  let triviaStreak = 0;
  let triviaBestStreak = 0;
  let triviaScore = 0;
  let triviaCorrect = 0;
  let triviaErrors = 0;
  let triviaSeconds = 15;
  let triviaInterval = null;
  let triviaAnswered = false;
  let calendarAssignments = new Map();
  let calendarSelectedId = null;
  let calendarDateErrors = 0;
  let calendarQuestionIndex = 0;
  let calendarMathErrors = 0;
  let calendarScore = 0;
  let calendarChallenges = [];
  let toastTimeout = null;

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const shuffle = (items) => {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const otherIndex = Math.floor(Math.random() * (index + 1));
      [result[index], result[otherIndex]] = [result[otherIndex], result[index]];
    }
    return result;
  };
  const formatDate = (isoDate) => {
    const [year, month, day] = isoDate.split('-').map(Number);
    return new Intl.DateTimeFormat('es-EC', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(year, month - 1, day));
  };
  const byId = (id) => data.evaluations.find((evaluation) => evaluation.id === id);

  function persist() {
    try { localStorage.setItem(storageKey, JSON.stringify(progress)); } catch { announce('No se pudo guardar el progreso en este navegador.'); }
  }

  function announce(message) {
    const toast = document.getElementById('game-toast');
    toast.textContent = message;
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => { toast.textContent = ''; }, 4200);
  }

  function updateProgress() {
    const levels = data.levels;
    let currentLevelIndex = levels.findIndex((level, index) => progress.xp < (levels[index + 1]?.minXp ?? Infinity));
    if (currentLevelIndex < 0) currentLevelIndex = levels.length - 1;
    const current = levels[currentLevelIndex];
    const next = levels[currentLevelIndex + 1];
    const progressBar = document.getElementById('global-progress-bar');
    const percentage = next ? Math.min(100, (progress.xp - current.minXp) / (next.minXp - current.minXp) * 100) : 100;
    document.getElementById('player-level').textContent = current.name;
    document.getElementById('total-xp').textContent = String(progress.xp);
    progressBar.style.width = `${percentage}%`;
    progressBar.parentElement.setAttribute('aria-valuenow', String(Math.round(percentage)));
    document.getElementById('next-level-copy').textContent = next ? `${Math.max(0, next.minXp - progress.xp)} XP para alcanzar ${next.name}` : 'Has alcanzado el nivel máximo.';
    const badgeList = document.getElementById('badge-list');
    badgeList.innerHTML = data.badges.map((badge) => {
      const earned = progress.badges.includes(badge.id);
      return `<span class="badge-token ${earned ? 'is-earned' : 'is-locked'}" role="img" aria-label="${earned ? 'Insignia obtenida' : 'Insignia pendiente'}: ${escapeHtml(badge.name)}. ${escapeHtml(badge.description)}" title="${escapeHtml(badge.name)}: ${escapeHtml(badge.description)}">${earned ? escapeHtml(badge.icon) : '·'}</span>`;
    }).join('');
    document.getElementById('badge-count').textContent = `${progress.badges.length} / ${data.badges.length}`;
  }

  function celebrate() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const layer = document.getElementById('celebration-layer');
    layer.replaceChildren();
    for (let index = 0; index < 64; index += 1) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.setProperty('--drift', `${Math.round(Math.random() * 180 - 90)}px`);
      piece.style.animationDelay = `${Math.random() * .5}s`;
      layer.append(piece);
    }
    window.setTimeout(() => layer.replaceChildren(), 2600);
  }

  function recordGame(gameId, score, options = {}) {
    const previousBest = Number(progress.bestScores[gameId]) || 0;
    const newBest = Math.max(previousBest, Math.max(0, score));
    const xpEarned = newBest - previousBest;
    progress.bestScores[gameId] = newBest;
    progress.xp += xpEarned;
    const badgesBefore = new Set(progress.badges);
    const gameBadge = data.badges.find((badge) => badge.id === gameId);
    if (gameBadge && !progress.badges.includes(gameBadge.id)) progress.badges.push(gameBadge.id);
    if (options.noErrors && !progress.badges.includes('perfect')) progress.badges.push('perfect');
    if (options.streak >= 5 && !progress.badges.includes('streak')) progress.badges.push('streak');
    if (options.memorySeconds !== undefined && options.memorySeconds < 60) {
      if (progress.bestMemorySeconds === null || options.memorySeconds < progress.bestMemorySeconds) progress.bestMemorySeconds = options.memorySeconds;
      if (!progress.badges.includes('speed')) progress.badges.push('speed');
    }
    persist();
    updateProgress();
    celebrate();
    const newBadges = progress.badges.filter((badgeId) => !badgesBefore.has(badgeId)).map((badgeId) => data.badges.find((badge) => badge.id === badgeId)?.name).filter(Boolean);
    announce(`${gameBadge?.name || 'Reto completado'} · ${xpEarned} XP nuevos${newBadges.length ? ` · Insignia: ${newBadges.join(', ')}` : ''}`);
  }

  function setupTabs() {
    const tabs = [...document.querySelectorAll('[data-game-tab]')];
    const panels = [...document.querySelectorAll('[data-game-panel]')];
    function activate(index, focus = false) {
      selectedTabIndex = (index + tabs.length) % tabs.length;
      tabs.forEach((tab, tabIndex) => {
        const active = tabIndex === selectedTabIndex;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        if (focus && active) tab.focus();
      });
      panels.forEach((panel, panelIndex) => {
        const active = panelIndex === selectedTabIndex;
        panel.hidden = !active;
        panel.classList.toggle('is-active', active);
      });
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(index));
      tab.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft' || event.key === 'Home' || event.key === 'End') {
          event.preventDefault();
          if (event.key === 'Home') activate(0, true);
          else if (event.key === 'End') activate(tabs.length - 1, true);
          else activate(index + (event.key === 'ArrowRight' ? 1 : -1), true);
        }
      });
    });
    activate(0);
  }

  function updateRouteUI(message = '') {
    const bank = document.getElementById('route-piece-bank');
    const remaining = routePieces.filter((piece) => !piece.placed);
    bank.innerHTML = remaining.map((piece) => `<button type="button" draggable="true" class="route-piece ${piece.id === routeSelectedId ? 'is-selected' : ''}" data-piece-id="${escapeHtml(piece.id)}" aria-pressed="${piece.id === routeSelectedId}" aria-label="${piece.id === routeSelectedId ? 'Seleccionada: ' : ''}${escapeHtml(piece.name)}. Unidad ${piece.unitNumber}."><span class="piece-grip" aria-hidden="true">⠿</span><span class="piece-text">${escapeHtml(piece.name)}</span><span class="piece-unit-tag">U${piece.unitNumber}</span></button>`).join('') || '<p class="empty-state">Todas las piezas están colocadas.</p>';
    document.getElementById('route-pieces-count').textContent = `${remaining.length} ${remaining.length === 1 ? 'pieza' : 'piezas'}`;
    document.getElementById('route-score').textContent = String(routeScore);
    bank.querySelectorAll('.route-piece').forEach((button) => {
      button.addEventListener('click', () => {
        routeSelectedId = button.dataset.pieceId;
        updateRouteUI('Pieza seleccionada. Elige una unidad para colocarla.');
      });
      button.addEventListener('dragstart', (event) => {
        routeSelectedId = button.dataset.pieceId;
        event.dataTransfer.setData('text/plain', routeSelectedId);
        event.dataTransfer.effectAllowed = 'move';
      });
    });

    const boards = document.getElementById('route-boards');
    boards.innerHTML = data.units.map((unit) => {
      const placed = routePlaced.get(unit.id) || [];
      const complete = placed.length === unit.topics.length;
      const slots = unit.topics.map((topic, index) => `<li class="route-slot ${placed[index] ? 'is-filled' : index === placed.length ? 'is-next' : ''}"><b>0${index + 1}</b><span>${placed[index] ? escapeHtml(placed[index]) : `Posición ${index + 1}`}</span></li>`).join('');
      return `<article class="route-board ${complete ? 'route-board-complete' : ''}" data-unit="${escapeHtml(unit.id)}"><h4>UNIDAD 0${unit.number}<br>${escapeHtml(unit.title)}</h4><ol class="route-slots">${slots}</ol>${complete ? `<p class="route-reward">✦ Resultado: ${escapeHtml(unit.outcome)}</p>` : `<button type="button" class="route-place-button" data-place-unit="${escapeHtml(unit.id)}" ${routeSelectedId ? '' : 'disabled'}>Colocar pieza seleccionada</button>`}</article>`;
    }).join('');
    boards.querySelectorAll('[data-place-unit]').forEach((button) => button.addEventListener('click', () => placeRoutePiece(button.dataset.placeUnit)));
    boards.querySelectorAll('.route-board').forEach((board) => {
      board.addEventListener('dragover', (event) => { event.preventDefault(); board.classList.add('is-drop-target'); });
      board.addEventListener('dragleave', (event) => { if (!board.contains(event.relatedTarget)) board.classList.remove('is-drop-target'); });
      board.addEventListener('drop', (event) => {
        event.preventDefault();
        board.classList.remove('is-drop-target');
        routeSelectedId = event.dataTransfer.getData('text/plain') || routeSelectedId;
        placeRoutePiece(board.dataset.unit);
      });
    });
    const feedback = document.getElementById('route-feedback');
    feedback.textContent = message || 'Selecciona una pieza y ponla en el tablero de su unidad, respetando el orden de los temas.';
    feedback.classList.toggle('is-error', message.startsWith('No coincide'));
    feedback.classList.toggle('is-success', message.startsWith('¡'));
  }

  function startRouteGame() {
    routePieces = shuffle(data.units.flatMap((unit) => unit.topics.map((topic, index) => ({ id: `${unit.id}-${index}`, unitId: unit.id, unitNumber: unit.number, topicIndex: index, name: topic.name, placed: false }))));
    routePlaced = new Map(data.units.map((unit) => [unit.id, []]));
    routeSelectedId = null;
    routeScore = 0;
    routeErrors = 0;
    routeFinished = false;
    updateRouteUI();
  }

  function placeRoutePiece(unitId) {
    if (!routeSelectedId || routeFinished) return;
    const piece = routePieces.find((item) => item.id === routeSelectedId);
    const unit = data.units.find((item) => item.id === unitId);
    if (!piece || !unit) return;
    const placed = routePlaced.get(unitId);
    if (piece.unitId !== unitId || piece.topicIndex !== placed.length) {
      routeErrors += 1;
      routeScore = Math.max(0, routeScore - 1);
      if ('vibrate' in navigator) navigator.vibrate(35);
      updateRouteUI('No coincide con esta unidad o con el siguiente tema. Prueba otra posición; se resta 1 punto.');
      return;
    }
    piece.placed = true;
    placed.push(piece.name);
    routeScore += 5;
    const allComplete = data.units.every((item) => routePlaced.get(item.id).length === item.topics.length);
    routeSelectedId = null;
    if (allComplete) {
      routeFinished = true;
      updateRouteUI('¡Ruta de aprendizaje completa! Se revelaron los resultados de las tres unidades.');
      recordGame('route', routeScore, { noErrors: routeErrors === 0 });
    } else {
      updateRouteUI('¡Pieza colocada en la secuencia correcta! +5 XP de ronda.');
    }
  }

  function initMemoryGame() {
    window.clearInterval(memoryInterval);
    memoryCards = shuffle(data.memoryPairs.flatMap((pair) => [
      { key: `${pair.id}-concept`, pairId: pair.id, text: pair.concept },
      { key: `${pair.id}-match`, pairId: pair.id, text: pair.match }
    ]));
    memoryFlipped = [];
    memoryMatched = new Set();
    memoryMoves = 0;
    memoryErrors = 0;
    memorySeconds = 0;
    memoryStarted = false;
    memoryLocked = false;
    renderMemory();
    updateMemoryMetrics();
    document.getElementById('memory-feedback').textContent = 'Voltea dos cartas para encontrar una pareja.';
  }

  function renderMemory() {
    const board = document.getElementById('memory-board');
    board.innerHTML = memoryCards.map((card) => {
      const flipped = memoryFlipped.includes(card.key) || memoryMatched.has(card.pairId);
      const matched = memoryMatched.has(card.pairId);
      return `<button type="button" class="memory-card ${flipped ? 'is-flipped' : ''} ${matched ? 'is-matched' : ''}" data-memory-key="${escapeHtml(card.key)}" aria-label="${matched ? `Pareja encontrada: ${escapeHtml(card.text)}` : flipped ? `Carta volteada: ${escapeHtml(card.text)}` : 'Carta oculta'}" aria-pressed="${flipped}"><span class="memory-card-inner"><span class="memory-card-face memory-card-back" aria-hidden="true">BI</span><span class="memory-card-face memory-card-front">${escapeHtml(card.text)}</span></span></button>`;
    }).join('');
    board.querySelectorAll('.memory-card').forEach((button) => button.addEventListener('click', () => flipMemoryCard(button.dataset.memoryKey)));
  }

  function updateMemoryMetrics() {
    const minutes = String(Math.floor(memorySeconds / 60)).padStart(2, '0');
    const seconds = String(memorySeconds % 60).padStart(2, '0');
    document.getElementById('memory-moves').textContent = String(memoryMoves);
    document.getElementById('memory-time').textContent = `${minutes}:${seconds}`;
    document.getElementById('memory-pairs').textContent = `${memoryMatched.size} / ${data.memoryPairs.length}`;
  }

  function flipMemoryCard(key) {
    if (memoryLocked || memoryMatched.size === data.memoryPairs.length || memoryFlipped.includes(key)) return;
    if (!memoryStarted) {
      memoryStarted = true;
      memoryInterval = window.setInterval(() => { memorySeconds += 1; updateMemoryMetrics(); }, 1000);
    }
    memoryFlipped.push(key);
    renderMemory();
    if (memoryFlipped.length < 2) return;
    memoryMoves += 1;
    memoryLocked = true;
    const [firstKey, secondKey] = memoryFlipped;
    const first = memoryCards.find((card) => card.key === firstKey);
    const second = memoryCards.find((card) => card.key === secondKey);
    updateMemoryMetrics();
    if (first.pairId === second.pairId) {
      memoryMatched.add(first.pairId);
      memoryFlipped = [];
      memoryLocked = false;
      renderMemory();
      if (memoryMatched.size === data.memoryPairs.length) finishMemory();
    } else {
      memoryErrors += 1;
      document.getElementById('memory-feedback').textContent = 'No forman pareja. Mira las pistas y vuelve a intentarlo.';
      window.setTimeout(() => {
        memoryFlipped = [];
        memoryLocked = false;
        renderMemory();
      }, 850);
    }
  }

  function finishMemory() {
    window.clearInterval(memoryInterval);
    const score = Math.max(80, 280 - Math.max(0, memoryMoves - data.memoryPairs.length) * 12 - Math.floor(memorySeconds / 10) * 3);
    document.getElementById('memory-feedback').textContent = `¡Memoria completa en ${memoryMoves} intentos y ${document.getElementById('memory-time').textContent}! +${score} XP de ronda.`;
    document.getElementById('memory-feedback').classList.add('is-success');
    recordGame('memory', score, { noErrors: memoryErrors === 0, memorySeconds });
  }

  function updateTriviaMetrics() {
    document.getElementById('trivia-score').textContent = String(triviaScore);
    document.getElementById('trivia-streak').textContent = String(triviaStreak);
    document.getElementById('trivia-lives').textContent = `${'♥ '.repeat(triviaLives)}${'♡ '.repeat(3 - triviaLives)}`.trim();
    document.getElementById('trivia-lives').setAttribute('aria-label', `${triviaLives} ${triviaLives === 1 ? 'vida restante' : 'vidas restantes'}`);
  }

  function startTrivia() {
    window.clearInterval(triviaInterval);
    triviaQuestions = shuffle(data.trivia);
    triviaIndex = 0;
    triviaLives = 3;
    triviaStreak = 0;
    triviaBestStreak = 0;
    triviaScore = 0;
    triviaCorrect = 0;
    triviaErrors = 0;
    document.getElementById('trivia-start').hidden = true;
    document.getElementById('trivia-next').hidden = true;
    document.getElementById('trivia-progress').style.width = '0%';
    document.getElementById('trivia-progress').parentElement.setAttribute('aria-valuenow', '0');
    updateTriviaMetrics();
    renderTriviaQuestion();
  }

  function renderTriviaQuestion() {
    if (triviaLives <= 0 || triviaIndex >= data.trivia.length) {
      finishTrivia();
      return;
    }
    const question = triviaQuestions[triviaIndex];
    triviaAnswered = false;
    triviaSeconds = 15;
    document.getElementById('trivia-topic').textContent = question.topic.toUpperCase();
    const heading = document.getElementById('trivia-question');
    heading.textContent = question.prompt;
    heading.tabIndex = -1;
    const options = document.getElementById('trivia-options');
    options.innerHTML = shuffle(question.options).map((option, index) => `<button type="button" class="trivia-option" data-answer="${escapeHtml(option)}"><span>${String.fromCharCode(65 + index)}</span>${escapeHtml(option)}</button>`).join('');
    options.querySelectorAll('.trivia-option').forEach((button) => button.addEventListener('click', () => answerTrivia(button.dataset.answer, false)));
    const feedback = document.getElementById('trivia-feedback');
    feedback.hidden = true;
    feedback.classList.remove('is-wrong');
    document.getElementById('trivia-counter').textContent = `Pregunta ${triviaIndex + 1} de ${data.trivia.length}`;
    document.getElementById('trivia-clock').textContent = '15';
    document.getElementById('trivia-clock').classList.remove('is-low');
    heading.focus({ preventScroll: true });
    window.clearInterval(triviaInterval);
    triviaInterval = window.setInterval(() => {
      triviaSeconds -= 1;
      document.getElementById('trivia-clock').textContent = String(triviaSeconds);
      document.getElementById('trivia-clock').classList.toggle('is-low', triviaSeconds <= 5);
      if (triviaSeconds <= 0) answerTrivia(null, true);
    }, 1000);
  }

  function answerTrivia(answer, timedOut) {
    if (triviaAnswered) return;
    triviaAnswered = true;
    window.clearInterval(triviaInterval);
    const question = triviaQuestions[triviaIndex];
    document.querySelectorAll('.trivia-option').forEach((button) => {
      button.disabled = true;
      if (button.dataset.answer === question.answer) button.classList.add('is-correct');
      else if (button.dataset.answer === answer) button.classList.add('is-wrong');
    });
    const feedback = document.getElementById('trivia-feedback');
    const isCorrect = !timedOut && answer === question.answer;
    if (isCorrect) {
      triviaCorrect += 1;
      triviaStreak += 1;
      triviaBestStreak = Math.max(triviaBestStreak, triviaStreak);
      triviaScore += 100 + triviaSeconds * 3 + (triviaStreak > 1 ? Math.min((triviaStreak - 1) * 10, 40) : 0);
      feedback.innerHTML = `<strong>¡Correcto! La racha sigue.</strong><p>${escapeHtml(question.explanation)}</p>`;
    } else {
      triviaErrors += 1;
      triviaLives -= 1;
      triviaStreak = 0;
      feedback.classList.add('is-wrong');
      feedback.innerHTML = `<strong>${timedOut ? 'Se acabó el tiempo.' : 'Respuesta incorrecta.'} Pierdes una vida.</strong><p>${escapeHtml(question.explanation)}</p>`;
    }
    feedback.hidden = false;
    updateTriviaMetrics();
    const completed = triviaLives <= 0 || triviaIndex === data.trivia.length - 1;
    const next = document.getElementById('trivia-next');
    next.hidden = false;
    next.textContent = completed ? 'Ver resultado' : 'Siguiente pregunta →';
  }

  function finishTrivia() {
    window.clearInterval(triviaInterval);
    document.getElementById('trivia-question').textContent = triviaLives <= 0 ? 'Ronda terminada' : '¡Trivia completada!';
    document.getElementById('trivia-options').innerHTML = '';
    document.getElementById('trivia-topic').textContent = 'RESULTADO';
    document.getElementById('trivia-feedback').hidden = false;
    document.getElementById('trivia-feedback').classList.remove('is-wrong');
    document.getElementById('trivia-feedback').innerHTML = `<strong>${triviaCorrect} de ${data.trivia.length} respuestas correctas · ${triviaScore} XP</strong><p>La repetición mezcla las preguntas para que puedas probar otra ruta.</p>`;
    document.getElementById('trivia-next').hidden = true;
    document.getElementById('trivia-start').hidden = false;
    document.getElementById('trivia-start').textContent = 'Jugar otra vez ↻';
    const percentage = Math.min(100, triviaIndex + 1 === data.trivia.length || triviaLives === 0 ? Math.max(1, triviaIndex + 1) / data.trivia.length * 100 : 100);
    document.getElementById('trivia-progress').style.width = `${percentage}%`;
    document.getElementById('trivia-progress').parentElement.setAttribute('aria-valuenow', String(Math.round(percentage / 100 * data.trivia.length)));
    recordGame('trivia', triviaScore, { noErrors: triviaErrors === 0, streak: triviaBestStreak });
  }

  function renderCalendar() {
    const bank = document.getElementById('calendar-eval-bank');
    bank.innerHTML = shuffle(data.evaluations).map((evaluation) => `<button type="button" draggable="true" class="calendar-eval-card ${calendarSelectedId === evaluation.id ? 'is-selected' : ''} ${[...calendarAssignments.values()].includes(evaluation.id) ? 'is-assigned' : ''}" data-evaluation="${escapeHtml(evaluation.id)}" aria-pressed="${calendarSelectedId === evaluation.id}"><span><strong>${escapeHtml(evaluation.name)}</strong><br><time datetime="${escapeHtml(evaluation.date)}">${escapeHtml(formatDate(evaluation.date))}</time></span><span aria-hidden="true">⠿</span></button>`).join('');
    bank.querySelectorAll('.calendar-eval-card').forEach((button) => {
      button.addEventListener('click', () => {
        calendarSelectedId = button.dataset.evaluation;
        renderCalendar();
      });
      button.addEventListener('dragstart', (event) => {
        calendarSelectedId = button.dataset.evaluation;
        event.dataTransfer.setData('text/plain', calendarSelectedId);
        event.dataTransfer.effectAllowed = 'move';
      });
    });
    document.getElementById('calendar-slots').innerHTML = `<div class="calendar-slot-list">${data.evaluations.map((evaluation) => {
      const assigned = calendarAssignments.get(evaluation.date);
      const assignedEvaluation = byId(assigned);
      return `<div class="calendar-slot ${assigned ? 'is-filled' : ''}" data-slot-date="${escapeHtml(evaluation.date)}"><time datetime="${escapeHtml(evaluation.date)}">${escapeHtml(formatDate(evaluation.date))}</time><button type="button" class="calendar-target-button" aria-label="${assigned ? `${assignedEvaluation.name} asignada al ${formatDate(evaluation.date)}. Cambiar asignación` : `Asignar evaluación a ${formatDate(evaluation.date)}`}" data-target-date="${escapeHtml(evaluation.date)}">${assigned ? `<strong>${escapeHtml(assignedEvaluation.name)}</strong><span aria-hidden="true">↻</span>` : '<span>Arrastra o selecciona una evaluación</span>'}</button></div>`;
    }).join('')}</div>`;
    document.querySelectorAll('.calendar-target-button').forEach((button) => button.addEventListener('click', () => {
      if (calendarSelectedId) assignEvaluation(button.dataset.targetDate, calendarSelectedId);
    }));
    document.querySelectorAll('.calendar-slot').forEach((slot) => {
      slot.addEventListener('dragover', (event) => { event.preventDefault(); slot.classList.add('is-drop-target'); });
      slot.addEventListener('dragleave', (event) => { if (!slot.contains(event.relatedTarget)) slot.classList.remove('is-drop-target'); });
      slot.addEventListener('drop', (event) => {
        event.preventDefault();
        slot.classList.remove('is-drop-target');
        const evaluationId = event.dataTransfer.getData('text/plain') || calendarSelectedId;
        if (evaluationId) assignEvaluation(slot.dataset.slotDate, evaluationId);
      });
    });
  }

  function assignEvaluation(date, evaluationId) {
    for (const [assignedDate, assignedId] of calendarAssignments.entries()) {
      if (assignedId === evaluationId) calendarAssignments.delete(assignedDate);
    }
    calendarAssignments.set(date, evaluationId);
    calendarSelectedId = null;
    renderCalendar();
    document.getElementById('calendar-feedback').textContent = `Evaluación asignada a ${formatDate(date)}. Puedes moverla hasta comprobar el reto.`;
  }

  function startCalendarGame() {
    calendarAssignments = new Map();
    calendarSelectedId = null;
    calendarDateErrors = 0;
    calendarQuestionIndex = 0;
    calendarMathErrors = 0;
    calendarScore = 0;
    calendarChallenges = [...data.calendarChallenges];
    document.getElementById('calendar-score').textContent = '0';
    document.getElementById('calendar-feedback').textContent = 'Mueve las tres evaluaciones a la línea de tiempo.';
    document.getElementById('calendar-feedback').classList.remove('is-error', 'is-success');
    document.getElementById('calendar-math').hidden = true;
    document.getElementById('calendar-check').hidden = false;
    document.getElementById('calendar-math-start').hidden = true;
    renderCalendar();
  }

  function checkCalendarDates() {
    if (calendarAssignments.size !== data.evaluations.length) {
      document.getElementById('calendar-feedback').textContent = 'Completa los tres espacios antes de comprobar.';
      document.getElementById('calendar-feedback').classList.add('is-error');
      return;
    }
    const correct = data.evaluations.every((evaluation) => calendarAssignments.get(evaluation.date) === evaluation.id);
    const feedback = document.getElementById('calendar-feedback');
    if (!correct) {
      calendarDateErrors += 1;
      feedback.textContent = 'Hay una evaluación fuera de fecha. Revisa cada cierre y vuelve a ubicarla.';
      feedback.classList.add('is-error');
      feedback.classList.remove('is-success');
      if ('vibrate' in navigator) navigator.vibrate(35);
      return;
    }
    calendarScore = 100;
    document.getElementById('calendar-score').textContent = String(calendarScore);
    feedback.textContent = '¡Cronología correcta! +100 XP de ronda. Ahora calcula las diferencias entre fechas.';
    feedback.classList.add('is-success');
    feedback.classList.remove('is-error');
    document.getElementById('calendar-check').hidden = true;
    document.getElementById('calendar-math-start').hidden = false;
  }

  function daysBetween(firstIso, secondIso) {
    const first = new Date(`${firstIso}T00:00:00Z`);
    const second = new Date(`${secondIso}T00:00:00Z`);
    return Math.round((second - first) / 86400000);
  }

  function startCalendarMath() {
    calendarQuestionIndex = 0;
    document.getElementById('calendar-math-start').hidden = true;
    document.getElementById('calendar-math').hidden = false;
    renderCalendarQuestion();
  }

  function renderCalendarQuestion() {
    const challenge = calendarChallenges[calendarQuestionIndex];
    if (!challenge) {
      finishCalendar();
      return;
    }
    document.getElementById('calendar-question').textContent = challenge.prompt;
    document.getElementById('calendar-answer').value = '';
    document.getElementById('calendar-math-feedback').textContent = `Reto ${calendarQuestionIndex + 1} de ${calendarChallenges.length}`;
    document.getElementById('calendar-answer').focus();
  }

  function submitCalendarAnswer() {
    const challenge = calendarChallenges[calendarQuestionIndex];
    if (!challenge) return;
    const answerField = document.getElementById('calendar-answer');
    if (answerField.value.trim() === '') {
      document.getElementById('calendar-math-feedback').textContent = 'Escribe una cantidad de días para responder.';
      answerField.focus();
      return;
    }
    const expected = daysBetween(byId(challenge.from).date, byId(challenge.to).date);
    const feedback = document.getElementById('calendar-math-feedback');
    if (Number(answerField.value) === expected) {
      calendarScore += 50;
      feedback.textContent = `¡Exacto! Son ${expected} días. +50 XP de ronda.`;
      feedback.className = 'calendar-math-feedback is-success';
    } else {
      calendarMathErrors += 1;
      feedback.textContent = `No exactamente: entre esas fechas hay ${expected} días.`;
      feedback.className = 'calendar-math-feedback is-error';
      if ('vibrate' in navigator) navigator.vibrate(35);
    }
    document.getElementById('calendar-score').textContent = String(calendarScore);
    calendarQuestionIndex += 1;
    window.setTimeout(() => {
      if (calendarQuestionIndex >= calendarChallenges.length) finishCalendar();
      else renderCalendarQuestion();
    }, 900);
  }

  function finishCalendar() {
    document.getElementById('calendar-math').hidden = true;
    document.getElementById('calendar-math-start').hidden = true;
    document.getElementById('calendar-feedback').textContent = `Reto terminado: ${calendarScore} XP de ronda. Fechas ordenadas y diferencias calculadas.`;
    document.getElementById('calendar-feedback').classList.add('is-success');
    recordGame('calendar', calendarScore, { noErrors: calendarDateErrors === 0 && calendarMathErrors === 0 });
  }

  document.getElementById('route-restart').addEventListener('click', startRouteGame);
  document.getElementById('memory-restart').addEventListener('click', initMemoryGame);
  document.getElementById('trivia-start').addEventListener('click', startTrivia);
  document.getElementById('trivia-next').addEventListener('click', () => {
    if (triviaLives <= 0 || triviaIndex === data.trivia.length - 1) finishTrivia();
    else { triviaIndex += 1; renderTriviaQuestion(); }
  });
  document.getElementById('calendar-check').addEventListener('click', checkCalendarDates);
  document.getElementById('calendar-math-start').addEventListener('click', startCalendarMath);
  document.getElementById('calendar-submit').addEventListener('click', submitCalendarAnswer);
  document.getElementById('calendar-answer').addEventListener('keydown', (event) => { if (event.key === 'Enter') submitCalendarAnswer(); });
  document.getElementById('reset-progress').addEventListener('click', () => {
    if (!window.confirm('¿Quieres borrar todo tu XP, récords e insignias?')) return;
    progress = freshProgress();
    persist();
    updateProgress();
    announce('Progreso reiniciado. ¡Puedes comenzar una nueva aventura!');
  });

  setupTabs();
  updateProgress();
  startRouteGame();
  initMemoryGame();
  startCalendarGame();
})();
