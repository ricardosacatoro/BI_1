# Aula de datos: fundamentos de Business Intelligence

Sitio educativo de tres páginas construido con HTML5, CSS3 y JavaScript vanilla. Presenta conceptos de BI, un proceso ETL interactivo, un cuestionario gamificado, un dashboard de ejemplo de la Liga Pro Ecuador 2026 y una página del sílabo UTC con minijuegos.

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
│   └── games.css
├── js/
│   ├── main.js
│   ├── quiz.js
│   ├── data.js
│   ├── dashboard.js
│   ├── silabo-data.js
│   ├── silabo.js
│   └── games.js
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

## Sílabo y minijuegos

Abre `silabo.html` para consultar la ficha, las evaluaciones con cuenta regresiva, las unidades, habilidades, proyecto, bibliografía y perfil docente. Los cuatro minijuegos guardan XP, mejores marcas e insignias en `localStorage` con la clave `utc-silabo-progress-v1`.

Todo el contenido editable de esa página, incluidos temas y horas por unidad, fechas, enlaces bibliográficos, parejas de memoria y banco de trivia, está centralizado en `js/silabo-data.js`. Conserva los identificadores de unidades y evaluaciones al editar para que el rompecabezas y el reto de calendario sigan relacionando correctamente los datos. `js/silabo.js` renderiza el contenido y la cuenta regresiva; `js/games.js` contiene las reglas y la puntuación.

El tema seleccionado se conserva en `localStorage` con la clave `aula-datos-theme`.
