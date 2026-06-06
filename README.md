# 🏎️ Forza Horizon - Super Wheelspin & Live Leaderboard Pro

¡Añade emoción a tus partidas de Forza Horizon! Esta aplicación web está diseñada para creadores de contenido, streamers o jugadores entusiastas que quieren añadir un sistema de desafíos aleatorios a sus sesiones de juego mediante una ruleta (_Wheelspin_) automatizada y un registro estricto de telemetría por circuitos.

Disfruta de la versión en vivo aquí: **[https://morfis845.github.io/ForzaHorizon/](https://morfis845.github.io/ForzaHorizon/)**

---

## 📝 ¿Qué es este proyecto?

Este sistema resuelve el problema de elegir qué auto usar en Forza Horizon mediante una ruleta mecánica interactiva tipo _slot machine_. A diferencia de una ruleta común, esta lee una base de datos local en formato JSON y te permite filtrar tu garaje por **País de origen**, **Tipo de vehículo** o **Clase de rendimiento (D a X)** antes de girar.

Una vez que la ruleta selecciona un auto al azar, la aplicación despliega un módulo dinámico de telemetría para que pongas a prueba el vehículo en la pista e ingreses tus métricas competitivas directas, guardándolas automáticamente en un Leaderboard local permanente.

---

## 🌟 Características Principales

- **Super Wheelspin Inteligente:** Animación física de desaceleración (_cubic-bezier_) que selecciona autos basándose únicamente en los filtros activos.
- **Filtros Reactivos:** Sistema de tags interactivos para segmentar tu garaje en tiempo real.
- **Captura de Telemetría Unificada:** Registra en un solo paso los datos clave de la prueba: **Circuito**, **Tracción manual (AWD, RWD, FWD)**, **PI**, **Tiempo de vuelta** y **Clase**.
- **Leaderboard Pro:** Tabla interactiva en pantalla que permite ordenar los tiempos de manera ascendente o descente haciendo clic en los encabezados.
- **Exportación Limpia a Excel:** Convierte tu historial almacenado en un archivo `.xlsx` perfectamente plano y estructurado para bases de datos con un solo botón.
- **Persistencia Local:** Los datos se quedan guardados de forma segura en el navegador (`localStorage`) para que no pierdas tu progreso al cerrar la pestaña.

---

## 🎮 ¿Cómo utilizar la aplicación? (Reglas del Juego)

El flujo de juego está optimizado para ser rápido, directo y cómodo, ideal para usarse desde el celular mientras juegas en la consola o PC:

### Paso 1: Filtrar tu Garaje

Utiliza los paneles superiores de **Países**, **Tipos** o **Clases** para elegir qué tipo de reto quieres hacer. El contador dinámico te indicará cuántos autos tienes disponibles en ese grupo.

### Paso 2: Girar el Wheelspin

Presiona el botón **GIRAR**. El rodillo comenzará a moverse rápidamente y se detendrá de forma suave en tu auto asignado.

### Paso 3: Registro Único de Telemetría

Lleva el auto seleccionado a la pista. A diferencia de sistemas anteriores, **no es necesario realizar múltiples fases de pruebas**. Completarás una única carrera de prueba para medir el rendimiento puro del coche. Tras la carrera, llena el formulario en pantalla con los siguientes datos obligatorios:

1. Digita el nombre del **Circuito** o pista de la prueba.
2. Ingresa manualmente la **Tracción** con la que configuraste el coche (`AWD`, `RWD`, `FWD`).
3. Ajusta el **PI** y la **Clase** final del tuneo.
4. Escribe tu mejor **Tiempo** de vuelta obtenido.
5. Presiona **Guardar Datos**.

### Paso 4: Administrar y Exportar tus Tiempos

- El auto aparecerá al instante en el **Leaderboard Live Pro**.
- Puedes hacer clic en columnas como **TIEMPO** o **PI** para ordenar la tabla de mejor a peor.
- Cuando termines tu sesión, presiona **Descargar Excel** para generar tu archivo plano `.xlsx` con todas las columnas limpias y ordenadas por ID.

---

## 🛠️ Instalación y Tecnologías

El proyecto fue construido utilizando tecnologías nativas del estándar web para garantizar un rendimiento instantáneo y cero dependencias pesadas:

- **HTML5 / CSS3** (Diseño moderno _Dark Mode_ adaptado a móviles).
- **Vanilla JavaScript** (Lógica de filtrado, estados y animaciones).
- **SheetJS (XLSX Library)** (Librería externa vía CDN para procesar la descarga a Excel).
