/* Banco de preguntas y mecánicas del cuestionario gamificado. */
(() => {
  const questions = [
    { topic: 'CONCEPTOS BI', type: 'multiple', prompt: '¿Cuál es el propósito principal de Business Intelligence?', options: ['Convertir datos en información útil para decidir', 'Automatizar todas las tareas sin intervención', 'Guardar copias de seguridad de cada archivo', 'Reemplazar la estrategia de una organización'], answer: 'Convertir datos en información útil para decidir', explanation: 'BI integra y analiza datos para apoyar decisiones mejor informadas.' },
    { topic: 'CONCEPTOS BI', type: 'multiple', prompt: '¿Cuál de estos es un beneficio habitual de BI?', options: ['Detectar tendencias y oportunidades', 'Garantizar que ninguna decisión implique riesgo', 'Eliminar la necesidad de definir objetivos', 'Evitar que los equipos compartan información'], answer: 'Detectar tendencias y oportunidades', explanation: 'Los análisis ayudan a encontrar patrones y anticipar cambios, aunque no eliminan toda incertidumbre.' },
    { topic: 'DECISIONES', type: 'multiple', prompt: 'Una gerencia decide en qué nuevo mercado invertir durante los próximos años. ¿Qué nivel de decisión es?', options: ['Estratégico', 'Táctico', 'Operativo', 'Transaccional'], answer: 'Estratégico', explanation: 'Las decisiones estratégicas marcan la dirección de largo plazo de la organización.' },
    { topic: 'DECISIONES', type: 'multiple', prompt: '¿Cuál es el orden lógico del ciclo analítico?', options: ['Datos → información → conocimiento → decisión', 'Decisión → datos → conocimiento → información', 'Información → decisión → datos → conocimiento', 'Conocimiento → datos → decisión → información'], answer: 'Datos → información → conocimiento → decisión', explanation: 'Al organizar y contextualizar los datos se obtiene conocimiento útil para actuar.' },
    { topic: 'PROCESO ETL', type: 'multiple', prompt: '¿Qué significa la letra T en ETL?', options: ['Transformación', 'Transferencia', 'Transacción', 'Tendencia'], answer: 'Transformación', explanation: 'La transformación limpia, estandariza y prepara los datos antes de cargarlos.' },
    { topic: 'PROCESO ETL', type: 'multiple', prompt: '¿Cuál es un ejemplo de deduplicación?', options: ['Eliminar registros repetidos de clientes', 'Cambiar una fecha al formato ISO', 'Sumar ventas por sucursal', 'Mover una tabla al data warehouse'], answer: 'Eliminar registros repetidos de clientes', explanation: 'Deduplicar evita que el mismo registro se cuente varias veces.' },
    { topic: 'PROCESO ETL', type: 'multiple', prompt: '¿En qué fase ETL se guarda la información ya preparada en un destino analítico?', options: ['Carga', 'Extracción', 'Visualización', 'Exploración'], answer: 'Carga', explanation: 'La carga inserta el resultado de la transformación en el destino analítico.' },
    { topic: 'CASOS PRÁCTICOS', type: 'multiple', prompt: 'Una tienda cruza ventas e inventario para anticipar faltantes. ¿Qué decisión puede tomar?', options: ['Ajustar pedidos según la demanda prevista', 'Aprobar créditos con menor riesgo', 'Redistribuir turnos de consulta médica', 'Cambiar el calendario de entrenamientos'], answer: 'Ajustar pedidos según la demanda prevista', explanation: 'El análisis combinado de ventas e inventario ayuda a planificar la reposición.' },
    { topic: 'VERDADERO O FALSO', type: 'boolean', prompt: 'El proceso ETL debe revisar la calidad de los datos antes de que se usen en reportes.', options: ['Verdadero', 'Falso'], answer: 'Verdadero', explanation: 'La limpieza y validación mejoran la consistencia de los análisis posteriores.' },
    { topic: 'VERDADERO O FALSO', type: 'boolean', prompt: 'Una decisión operativa suele definir la dirección de una organización para los próximos cinco años.', options: ['Verdadero', 'Falso'], answer: 'Falso', explanation: 'Las decisiones operativas se enfocan en acciones cotidianas; la dirección de largo plazo es estratégica.' }
  ];

  const startPanel = document.getElementById('quiz-start');
  const gamePanel = document.getElementById('quiz-game');
  const resultPanel = document.getElementById('quiz-result');
  if (!startPanel || !gamePanel || !resultPanel) return;

  const bestScoreKey = 'aula-datos-quiz-best';
  const bestScoreDisplay = document.getElementById('best-score-value');
  const progressBar = document.getElementById('quiz-progress');
  const progressTrack = progressBar.parentElement;
  const timerBar = document.getElementById('quiz-timer-bar');
  const timerTrack = timerBar.parentElement;
  const timerValue = document.getElementById('quiz-timer');
  let questionOrder = [];
  let questionIndex = 0;
  let currentQuestion = null;
  let points = 0;
  let correctCount = 0;
  let streak = 0;
  let lives = 3;
  let secondsLeft = 20;
  let timerId = null;
  let answered = false;

  function shuffle(values) {
    const shuffled = [...values];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }
    return shuffled;
  }

  function storedBestScore() {
    return Number.parseInt(localStorage.getItem(bestScoreKey) || '0', 10) || 0;
  }

  function updateBestScore() {
    bestScoreDisplay.textContent = String(storedBestScore());
  }

  function updateStatus() {
    const counter = document.getElementById('question-counter');
    const scoreLabel = document.getElementById('score-label');
    const streakCount = document.getElementById('streak-count');
    const streakIndicator = document.getElementById('streak-indicator');
    const livesIndicator = document.getElementById('lives-indicator');
    const completed = Math.min(questionIndex, questions.length);
    counter.textContent = `Pregunta ${Math.min(questionIndex + 1, questions.length)} de ${questions.length}`;
    scoreLabel.textContent = `${points} puntos`;
    progressBar.style.width = `${completed / questions.length * 100}%`;
    progressTrack.setAttribute('aria-valuenow', String(completed));
    streakCount.textContent = String(streak);
    streakIndicator.setAttribute('aria-label', `Racha de ${streak} aciertos`);
    livesIndicator.textContent = `${'♥ '.repeat(lives)}${'♡ '.repeat(3 - lives)}`.trim();
    livesIndicator.setAttribute('aria-label', `${lives} ${lives === 1 ? 'vida restante' : 'vidas restantes'}`);
  }

  function stopTimer() {
    window.clearInterval(timerId);
    timerId = null;
  }

  function updateTimer() {
    timerValue.textContent = String(secondsLeft);
    timerBar.style.width = `${secondsLeft / 20 * 100}%`;
    timerTrack.setAttribute('aria-valuenow', String(secondsLeft));
    timerBar.classList.toggle('timer-low', secondsLeft <= 5);
  }

  function showFeedback(isCorrect, message, explanation) {
    const feedback = document.getElementById('quiz-feedback');
    feedback.classList.toggle('feedback-wrong', !isCorrect);
    feedback.innerHTML = `<strong>${message}</strong><p>${explanation}</p>`;
    feedback.hidden = false;
    document.getElementById('quiz-next').hidden = false;
  }

  function answerQuestion(selectedAnswer, timedOut = false) {
    if (answered) return;
    answered = true;
    stopTimer();
    const buttons = [...document.querySelectorAll('.answer-option')];
    buttons.forEach((button) => {
      button.disabled = true;
      if (button.dataset.answer === currentQuestion.answer) button.classList.add('is-correct');
      else if (button.dataset.answer === selectedAnswer) button.classList.add('is-wrong');
    });

    if (!timedOut && selectedAnswer === currentQuestion.answer) {
      correctCount += 1;
      streak += 1;
      const speedBonus = secondsLeft * 3;
      const streakBonus = Math.min(Math.max(streak - 1, 0) * 10, 40);
      const earned = 100 + speedBonus + streakBonus;
      points += earned;
      showFeedback(true, `¡Correcto! +${earned} puntos`, currentQuestion.explanation);
    } else {
      lives -= 1;
      streak = 0;
      showFeedback(false, timedOut ? 'Se terminó el tiempo. Pierdes una vida.' : 'No era esa opción. Pierdes una vida.', currentQuestion.explanation);
    }
    updateStatus();
    if (lives === 0 || questionIndex === questions.length - 1) {
      document.getElementById('quiz-next').textContent = 'Ver resultado';
    }
  }

  function startTimer() {
    secondsLeft = 20;
    updateTimer();
    timerId = window.setInterval(() => {
      secondsLeft -= 1;
      updateTimer();
      if (secondsLeft <= 0) answerQuestion(null, true);
    }, 1000);
  }

  function renderQuestion() {
    if (lives === 0 || questionIndex >= questions.length) {
      finishGame();
      return;
    }
    currentQuestion = questionOrder[questionIndex];
    answered = false;
    document.getElementById('question-topic').textContent = currentQuestion.topic;
    const questionHeading = document.getElementById('question-text');
    questionHeading.textContent = currentQuestion.prompt;
    const optionsContainer = document.getElementById('answer-options');
    optionsContainer.innerHTML = '';
    shuffle(currentQuestion.options).forEach((option, index) => {
      const button = document.createElement('button');
      button.className = 'answer-option';
      button.type = 'button';
      button.dataset.answer = option;
      button.innerHTML = `<span class="answer-key" aria-hidden="true">${String.fromCharCode(65 + index)}</span><span>${option}</span>`;
      button.addEventListener('click', () => answerQuestion(option));
      optionsContainer.append(button);
    });
    document.getElementById('quiz-feedback').hidden = true;
    document.getElementById('quiz-next').hidden = true;
    document.getElementById('quiz-next').textContent = 'Siguiente pregunta →';
    updateStatus();
    questionHeading.focus({ preventScroll: true });
    startTimer();
  }

  function finishGame() {
    stopTimer();
    gamePanel.hidden = true;
    startPanel.hidden = true;
    resultPanel.hidden = false;
    const percentage = Math.round(correctCount / questions.length * 100);
    let level = 'Novato';
    let medal = '✦';
    if (percentage >= 75) { level = 'Experto BI'; medal = '★'; }
    else if (percentage >= 45) { level = 'Analista'; medal = '◆'; }
    const newBest = points > storedBestScore();
    if (newBest) localStorage.setItem(bestScoreKey, String(points));
    resultPanel.innerHTML = `<div class="result-medal" aria-hidden="true">${medal}</div><p class="eyebrow">RETO COMPLETADO</p><h3>Buen análisis.</h3><p class="result-score">${points}<span class="visually-hidden"> puntos</span></p><p class="result-detail">${correctCount} de ${questions.length} respuestas correctas · ${percentage}% de aciertos</p><span class="result-level"><span aria-hidden="true">✦</span> ${level}</span>${newBest ? '<p class="result-best">¡Nuevo mejor puntaje!</p>' : `<p class="result-best">Mejor puntaje: ${Math.max(points, storedBestScore())} puntos</p>`}<br><button class="button button-primary" id="quiz-retry" type="button">Reintentar <span aria-hidden="true">↻</span></button>`;
    updateBestScore();
    resultPanel.focus();
    document.getElementById('quiz-retry').addEventListener('click', startGame);
  }

  function startGame() {
    stopTimer();
    questionOrder = shuffle(questions);
    questionIndex = 0;
    points = 0;
    correctCount = 0;
    streak = 0;
    lives = 3;
    startPanel.hidden = true;
    resultPanel.hidden = true;
    gamePanel.hidden = false;
    renderQuestion();
  }

  document.getElementById('quiz-start-button').addEventListener('click', startGame);
  document.getElementById('quiz-next').addEventListener('click', () => {
    if (lives === 0 || questionIndex === questions.length - 1) {
      finishGame();
      return;
    }
    questionIndex += 1;
    renderQuestion();
  });
  updateBestScore();
})();
