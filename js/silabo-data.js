/* Fuente única de contenido académico para la página del sílabo. */
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
  };

  window.SILABO_DATA = Object.freeze(silabo);
})();
