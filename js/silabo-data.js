/* Fuente única de contenido para la página del sílabo y sus minijuegos. */
(() => {
  const silabo = {
    general: {
      university: 'Universidad Técnica de Cotopaxi (UTC)',
      campus: 'Latacunga',
      faculty: 'Ciencias de la Ingeniería y Aplicadas (CIYA)',
      career: 'Sistemas de Información',
      subject: 'Sistemas de Información para la Inteligencia de Negocios',
      code: 'ISISI805',
      cycle: 'Octavo',
      cycleNumber: 8,
      parallel: 'A',
      courseType: 'Normal',
      periodStart: '2026-10-12',
      periodEnd: '2027-02-21',
      credits: 3,
      hours: { total: 144, teaching: 48, practice: 48, autonomous: 48 },
      teacher: {
        name: 'Luis Rene Quisaguano Collaguazo',
        email: 'luis.quisaguano1@utc.edu.ec',
        profile: 'Magíster en Sistemas de Información e Ingeniero en Informática y Sistemas (ambos por la UTC). Experiencia: profesor a tiempo parcial y luego docente a tiempo completo en la UTC, analista de TI en el GAD Municipal del Cantón Mejía, desarrollador de software en Evolution Soft y gerente en Rebian Software.'
      }
    },
    description: 'La asignatura analiza los fundamentos, características y modelamiento de la inteligencia de negocios para apoyar la toma de decisiones empresariales con información derivada del procesamiento de datos mediante software especializado. Se centra en reunir, almacenar, analizar y visualizar información para identificar oportunidades de negocio.',
    graduateContribution: 'Construir procesos de extracción, combinación, depuración y distribución de la información a los usuarios finales.',
    objective: 'Analizar los conceptos de fundamentos, características y modelamiento de la inteligencia de negocios para entender cómo implementar estas herramientas en una organización, describiendo las etapas necesarias para su correcta ejecución.',
    units: [
      {
        id: 'unit-1',
        number: 1,
        title: 'Fundamentos y gestión de la inteligencia de negocios',
        color: 'mint',
        problem: 'La gestión de BI requiere conocer los fundamentos, herramientas y componentes de BI.',
        outcome: 'Identificar los conceptos básicos, herramientas y componentes de BI aplicando herramientas de BI.',
        methodology: 'Aprendizaje Cooperativo',
        evaluation: 'Redacción de ensayos, informes, reportes y artículos académicos, con rúbrica.',
        autonomousHours: 15,
        topics: [
          { name: 'Conceptos básicos', teaching: 3, practice: 3 },
          { name: 'Componentes de la inteligencia de negocios', teaching: 3, practice: 3 },
          { name: 'Los sistemas de información y la generación de valor, ventaja corporativa', teaching: 3, practice: 3 },
          { name: 'Principales herramientas de la inteligencia de negocios', teaching: 6, practice: 6 }
        ],
        strategies: ['Cuadro comparativo', 'Debate', 'Lluvia de ideas', 'Mapa mental', 'Mentefactos', 'Preguntas']
      },
      {
        id: 'unit-2',
        number: 2,
        title: 'Sistemas de soporte a la administración y Data Warehouse',
        color: 'gold',
        problem: 'Dificultad para analizar el uso de bases de datos multidimensionales para la toma de decisiones.',
        outcome: 'Explotar esquemas de bases de datos multidimensionales con herramientas de visualización, análisis y consultas, con adecuada administración.',
        methodology: 'Aprendizaje Basado en Problemas',
        evaluation: 'Portafolio con lista de cotejo.',
        autonomousHours: 15,
        topics: [
          { name: 'Variables de medición y análisis', teaching: 3, practice: 3 },
          { name: 'Data Warehouse', teaching: 6, practice: 6 },
          { name: 'Sistemas de gestión del conocimiento', teaching: 3, practice: 3 },
          { name: 'Patrones: evaluación, interpretación y visualización', teaching: 3, practice: 3 }
        ],
        strategies: ['Práctica de laboratorio', 'Resolución de ejercicios', 'Simulación']
      },
      {
        id: 'unit-3',
        number: 3,
        title: 'Sistema de soporte para toma de decisiones empresariales',
        color: 'coral',
        problem: 'La evaluación de los objetivos de negocio implica implementar procesos para organizar grandes cantidades de datos.',
        outcome: 'Construir una solución de BI para un caso práctico, modelando la información organizacional.',
        methodology: 'Aprendizaje Basado en Proyectos',
        evaluation: 'Proyectos con rúbrica.',
        autonomousHours: 18,
        topics: [
          { name: 'Vistas multidimensionales / hipercubos de datos', teaching: 3, practice: 3 },
          { name: 'Procesos ETL', teaching: 3, practice: 3 },
          { name: 'Reporteadores', teaching: 6, practice: 6 },
          { name: 'Alertas, tableros de control (dashboards) e indicadores clave de desempeño (KPIs) y aspectos técnicos del proyecto', teaching: 6, practice: 6 }
        ],
        strategies: ['Juego de roles', 'Lluvia de ideas', 'Mesa redonda', 'Redacción de informes', 'Salida de campo']
      }
    ],
    softSkills: [
      { name: 'Competencia digital', icon: '▦', description: 'Usar tecnologías y herramientas digitales para analizar y comunicar información.' },
      { name: 'Creatividad', icon: '✳', description: 'Idear formas útiles de explorar datos y presentar hallazgos.' },
      { name: 'Ética', icon: '◇', description: 'Manejar datos sensibles responsablemente, evitar sesgos y manipulaciones, y respetar la privacidad y confidencialidad.' },
      { name: 'Liderazgo', icon: '↗', description: 'Asumir el rol de líder técnico en una solución de BI.' },
      { name: 'Pensamiento crítico', icon: '⌕', description: 'Evaluar la calidad de los datos y la validez de los indicadores.' },
      { name: 'Resolución de problemas', icon: '⌘', description: 'Aplicar análisis y herramientas de BI para resolver necesidades organizacionales.' }
    ],
    evaluations: [
      { id: 'eval1', name: 'EVAL1', date: '2026-11-22', closingTime: '23:59:59' },
      { id: 'eval2', name: 'EVAL2', date: '2027-01-10', closingTime: '23:59:59' },
      { id: 'eval3', name: 'EVAL3', date: '2027-02-14', closingTime: '23:59:59' }
    ],
    project: {
      name: 'PlasTrack',
      title: 'Monitoreo Inteligente de Microplásticos mediante Datos Copernicus para la Conservación de Ecosistemas Insulares.',
      description: 'La asignatura aporta fundamentos para transformar grandes volúmenes de datos satelitales (Copernicus, CMEMS) en información estratégica, diseñando dashboards, KPIs y sistemas de alerta temprana para el sector pesquero (CEIPA) y gestores ambientales.'
    },
    bibliography: {
      basic: [
        { title: '¿Cómo planificar un proyecto de inteligencia de negocio?', url: 'https://elibro.net/es/lc/utcotopaxi/titulos/58548' },
        { title: 'Base de datos', url: 'https://elibro.net/es/lc/utcotopaxi/titulos/121283' },
        { title: 'La toma de decisiones en la práctica', url: 'https://elibro.net/es/lc/utcotopaxi/titulos/227386' },
        { title: 'Excel y Power BI: el cóctel perfecto', url: 'https://elibro.net/es/lc/utcotopaxi/titulos/282827' }
      ],
      complementary: [
        { title: 'Introducción al Business Intelligence', url: 'http://cursos.yura.website/wp-content/uploads/2020/03/Introduccion_al_Business_Intelligence.pdf' },
        { title: 'Análisis comparativo de herramientas web para la generación de visualizaciones interactivas', url: 'https://dialnet.unirioja.es/servlet/articulo?codigo=10387164' },
        { title: 'Desarrollo de inteligencia empresarial: análisis comparativo entre Power BI y Qlik Sense en la implementación de tableros estratégicos de indicadores clave', url: 'http://technologyrain.com.ar/index.php/trj/article/view/30' }
      ],
      websites: [
        { title: 'Aplicación de tecnologías .NET y Chart.js para el desarrollo de un tablero de indicadores clave', url: 'https://ecuciencia.utc.edu.ec/media/articulo/articulo-005-corregido.pdf' },
        { title: 'Inteligencia de negocios como alternativa de generación de valor y ventaja competitiva en las microempresas', url: 'https://investigacion.utc.edu.ec/index.php/ciya/es/article/view/391' },
        { title: 'Documentación oficial de Power BI', url: 'https://learn.microsoft.com/es-es/power-bi/' }
      ]
    },
    memoryPairs: [
      { id: 'etl', concept: 'Procesos ETL', match: 'Unidad 3' },
      { id: 'warehouse', concept: 'Data Warehouse', match: 'Unidad 2' },
      { id: 'projects', concept: 'Aprendizaje Basado en Proyectos', match: 'Unidad 3' },
      { id: 'rubric', concept: 'Evaluación de Unidad 1', match: 'Ensayos e informes con rúbrica' },
      { id: 'cooperative', concept: 'Aprendizaje Cooperativo', match: 'Unidad 1' },
      { id: 'problems', concept: 'Aprendizaje Basado en Problemas', match: 'Unidad 2' },
      { id: 'cube', concept: 'Hipercubos de datos', match: 'Unidad 3' },
      { id: 'credits', concept: 'Créditos de la asignatura', match: '3 créditos' }
    ],
    trivia: [
      { topic: 'Datos generales', prompt: '¿Cuántos créditos tiene la asignatura?', options: ['2', '3', '4', '6'], answer: '3', explanation: 'La asignatura Sistemas de Información para la Inteligencia de Negocios tiene 3 créditos.' },
      { topic: 'Datos generales', prompt: '¿Cuántas horas autónomas están planificadas?', options: ['24', '36', '48', '60'], answer: '48', explanation: 'El total de 144 horas se distribuye en 48 de docencia, 48 prácticas y 48 autónomas.' },
      { topic: 'Evaluaciones', prompt: '¿Qué secuencia muestra las fechas correctas de EVAL1, EVAL2 y EVAL3?', options: ['22/11/2026 · 10/01/2027 · 14/02/2027', '10/01/2027 · 22/11/2026 · 14/02/2027', '22/11/2026 · 14/02/2027 · 10/01/2027', '14/02/2027 · 10/01/2027 · 22/11/2026'], answer: '22/11/2026 · 10/01/2027 · 14/02/2027', explanation: 'EVAL1 cierra el 22/11/2026, EVAL2 el 10/01/2027 y EVAL3 el 14/02/2027, siempre a las 23:59:59.' },
      { topic: 'Unidades', prompt: '¿Qué metodología corresponde a la Unidad 1?', options: ['Aprendizaje Cooperativo', 'Aprendizaje Basado en Problemas', 'Aprendizaje Basado en Proyectos', 'Clase magistral'], answer: 'Aprendizaje Cooperativo', explanation: 'La Unidad 1 se desarrolla con Aprendizaje Cooperativo.' },
      { topic: 'Unidades', prompt: '¿En qué unidad se estudia Data Warehouse?', options: ['Unidad 1', 'Unidad 2', 'Unidad 3', 'En todas'], answer: 'Unidad 2', explanation: 'Data Warehouse pertenece a la Unidad 2.' },
      { topic: 'Unidades', prompt: '¿Qué metodología usa la Unidad 3?', options: ['Aprendizaje Cooperativo', 'Aprendizaje Basado en Problemas', 'Aprendizaje Basado en Proyectos', 'Estudio individual'], answer: 'Aprendizaje Basado en Proyectos', explanation: 'La Unidad 3 aplica Aprendizaje Basado en Proyectos.' },
      { topic: 'Docencia', prompt: '¿Quién imparte la asignatura?', options: ['Luis Rene Quisaguano Collaguazo', 'Luis Quispe Collaguazo', 'Rene Luis Quisaguano', 'Luis Rene Quisaguano Cevallos'], answer: 'Luis Rene Quisaguano Collaguazo', explanation: 'El docente es Luis Rene Quisaguano Collaguazo.' },
      { topic: 'Proyecto', prompt: '¿Cómo se llama el proyecto articulador sobre microplásticos?', options: ['DataIsla', 'PlasTrack', 'EcoBI', 'IslaSat'], answer: 'PlasTrack', explanation: 'PlasTrack utiliza datos satelitales para apoyar la conservación de ecosistemas insulares.' },
      { topic: 'Habilidades', prompt: '¿Cuál es una práctica ética incluida en el sílabo?', options: ['Compartir datos sensibles sin permiso', 'Evitar sesgos y respetar la confidencialidad', 'Eliminar la validación de datos', 'Publicar toda información recopilada'], answer: 'Evitar sesgos y respetar la confidencialidad', explanation: 'La ética incluye proteger privacidad y confidencialidad, y evitar sesgos y manipulaciones.' },
      { topic: 'Bibliografía', prompt: '¿Dónde se encuentra el libro “Excel y Power BI: el cóctel perfecto”?', options: ['elibro.net', 'Dialnet', 'Microsoft Learn', 'Copernicus'], answer: 'elibro.net', explanation: 'Es una referencia básica disponible en la biblioteca eLibro de la UTC.' },
      { topic: 'Temas', prompt: 'Verdadero o falso: Procesos ETL se estudia en la Unidad 3.', options: ['Verdadero', 'Falso'], answer: 'Verdadero', explanation: 'Procesos ETL forma parte de la Unidad 3, sobre soporte para la toma de decisiones empresariales.' },
      { topic: 'Horas', prompt: 'Verdadero o falso: las horas prácticas suman 48.', options: ['Verdadero', 'Falso'], answer: 'Verdadero', explanation: 'La asignatura contempla 48 horas prácticas.' }
    ],
    calendarChallenges: [
      { from: 'eval1', to: 'eval2', prompt: '¿Cuántos días hay entre EVAL1 y EVAL2?' },
      { from: 'eval2', to: 'eval3', prompt: '¿Cuántos días hay entre EVAL2 y EVAL3?' },
      { from: 'eval1', to: 'eval3', prompt: '¿Cuántos días hay entre EVAL1 y EVAL3?' }
    ],
    levels: [
      { name: 'Aprendiz', minXp: 0 },
      { name: 'Analista', minXp: 250 },
      { name: 'Experto BI', minXp: 700 },
      { name: 'Maestro del Sílabo', minXp: 1400 }
    ],
    badges: [
      { id: 'route', name: 'Ruta completa', description: 'Completa el rompecabezas de unidades.', icon: '⌖' },
      { id: 'memory', name: 'Memoria BI', description: 'Encuentra las ocho parejas.', icon: '▧' },
      { id: 'trivia', name: 'Trivia relámpago', description: 'Termina las doce preguntas.', icon: '✦' },
      { id: 'calendar', name: 'A tiempo', description: 'Completa el reto del calendario.', icon: '◷' },
      { id: 'perfect', name: 'Sin errores', description: 'Completa un juego sin fallos.', icon: '✓' },
      { id: 'streak', name: 'Racha de cinco', description: 'Responde cinco preguntas seguidas correctamente.', icon: '⚡' },
      { id: 'speed', name: 'Tiempo récord', description: 'Completa Memoria BI en menos de 60 segundos.', icon: '↯' }
    ]
  };

  window.SILABO_DATA = Object.freeze(silabo);
})();
