# Aula de datos: fundamentos de Business Intelligence

Sitio educativo de tres páginas construido con HTML5, CSS3 y JavaScript vanilla. Presenta conceptos de BI, un proceso ETL interactivo, un cuestionario, un dashboard de ejemplo de la Liga Pro Ecuador 2026 y un resumen académico del sílabo UTC.

Los resultados de la liga son sintéticos y se muestran exclusivamente con fines educativos. No representan estadísticas oficiales.

## Estructura

```text
/
├── index.html
├── dashboard.html
├── silabo.html
├── README.md
├── css/
│   ├── styles.css
│   ├── quiz.css
│   ├── dashboard.css
│   ├── silabo.css
├── js/
│   ├── main.js
│   ├── quiz.js
│   ├── data.js
│   ├── dashboard.js
│   ├── silabo-data.js
│   ├── silabo.js
└── img/
```

## Ejecutar en Codespaces

1. Abre el proyecto en Codespaces e instala la extensión **Live Server** si aún no está disponible.
2. En el explorador de archivos, haz clic derecho en `index.html` y selecciona **Open with Live Server**.
3. Usa los enlaces de la barra superior para alternar entre fundamentos, dashboard y sílabo.

La página principal funciona con los archivos locales. El dashboard necesita conexión a internet para cargar Chart.js desde CDN; Google Fonts también se sirve desde CDN. No se necesita backend ni proceso de compilación.

## Editar el cuestionario

En `js/quiz.js`, modifica el arreglo `questions`. Cada objeto incluye `topic`, `type`, `prompt`, `options`, `answer` y `explanation`. Para preguntas de verdadero o falso, usa `type: 'boolean'` y las opciones `Verdadero` y `Falso`. El puntaje máximo posible por respuesta correcta combina 100 puntos base, un bonus por rapidez y un bonus por racha. El mejor puntaje se guarda en `localStorage` con la clave `aula-datos-quiz-best`.

## Editar los datos de liga

En `js/data.js`, ajusta los equipos, su fortaleza simulada, capacidad estimada del estadio y lista de goleadores. El calendario genera 30 fechas de ida y vuelta de forma reproducible; los marcadores, tarjetas y asistencia se derivan de esos valores. `js/dashboard.js` contiene los filtros, agregaciones y visualizaciones. Chart.js se carga desde CDN en `dashboard.html`.

## Sílabo

Abre `silabo.html` para consultar los datos generales de la asignatura, su objetivo, distribución horaria, fechas de evaluación, unidades, proyecto articulador y perfil docente.

El contenido editable está centralizado en `js/silabo-data.js`. `js/silabo.js` renderiza la ficha y la cuenta regresiva de evaluaciones.

El tema seleccionado se conserva en `localStorage` con la clave `aula-datos-theme`.
