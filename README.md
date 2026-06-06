# 🏁 FORZA HORIZON - SUPER WHEELSPIN & LIVE LEADERBOARD 🏎️

¡Bienvenido al **Street Project Protocol**! Esta aplicación web ha sido diseñada específicamente para la comunidad de coleccionistas, tuners y pilotos de Forza que buscan un desafío único: transformar autos comunes de la ruleta en verdaderas máquinas competitivas de calle, evaluando su rendimiento de forma científica y ordenada.

---

## 🌌 Estética del Proyecto (HUD Style)
La aplicación adopta la identidad visual oficial de los festivales Horizon: un entorno oscuro semi-transparente premium (`#111113`), combinado con destellos de luces de neón **Magenta/Rosa Eléctrico** (`#ff0055`) para las acciones principales y **Cian/Azul Eléctrico** (`#00ccff`) para la organización de la telemetría y los filtros interactivos.

---

## 🔥 ¿Cómo funciona la Aplicación?

El flujo de juego está completamente automatizado y optimizado tanto para computadoras como para dispositivos móviles:

1. **Filtrado Avanzado en Tiempo Real:** Antes de girar, puedes acotar el universo de autos del garaje seleccionando o descartando **Países de Origen**, **Tipos/Categorías** de vehículos o su **Clase de Rendimiento Nativa (D a X)**.
2. **La Súper Ruleta (Super Wheelspin):** Al presionar **GIRAR**, se activa un rodillo vertical con físicas de desaceleración suave controladas por GPU (60 FPS en celulares).
3. **Captura Inteligente del Ganador:** Al detenerse la aguja, el sistema identifica el modelo exacto y extrae de forma automática los metadatos desde el archivo central `autos_fh6.json`.
4. **Despliegue del Formulario de Tiempos (HUD Modal):** Se abrirá un panel flotante de pantalla completa donde la **Categoría** y el **País** ya aparecen auto-rellenados y bloqueados en modo lectura. Tu única tarea será ingresar la telemetría de tus pruebas.

---

## 📜 El Reglamento Oficial: "Proyecto de Calle"

Para que la competencia en la tabla de clasificación sea justa y transparente, cada coche ganado debe pasar por un proceso de evolución estricto dividido en **3 Fases de Rendimiento**:

* **⚡ Fase 1: Pure Stock (De fábrica):** El auto se prueba en el circuito seleccionado tal cual sale de la ruleta, sin una sola modificación mecánica. Esto establece la base de telemetría de la ingeniería original.
* **⚡ Fase 2: Tuned Base (Máximo de su clase):** Se añaden mejoras mecánicas permitidas hasta alcanzar el tope del Índice de Rendimiento (PI) de su misma categoría original (Ej: un Clase B 615 se mejora exactamente hasta el límite de B 700).
* **⚡ Fase 3: Street Project (+1 Categoría arriba):** Es la evolución final del chasis. Siguiendo la regla de oro, el auto se modifica para subir exactamente **UNA categoría completa por encima** de su clase nativa (Ej: de Clase B pasa a competir al tope de la Clase A 800).

### 🛠️ Restricciones estrictas en el Taller de Tuneo:
* **Motor Original Obligatorio:** Queda completamente prohibido realizar Swaps de motor. Se debe exprimir la potencia del bloque original de fábrica.
* **Tracción Original Obligatoria:** Prohibido hacer conversiones de tracción (AWD/RWD/FWD). Si el auto nació tracción delantera, se queda tracción delantera.
* **Compuesto de Neumáticos Limitado:** Máximo un nivel por encima del compuesto original (Si viene de fábrica con llantas de calle, el tope permitido es compuesto deportivo).
* **Piezas Permitidas de Libertad Libre:** Eres libre de ajustar y equipar suspensión de carreras, diferencial ajustable, frenos, reducción de peso, alineación de neumáticos y Forza Aero para optimizar el comportamiento en curvas.
* **Aspiración:** Se permite la adición de Turbos o Supercargadores únicamente si el motor original se queda corto de potencia para alcanzar el PI objetivo de la fase 3.
* **Estética Activa:** ¡Se sugiere intentar cambiar la pintura o el diseño del auto según la fase alcanzada para distinguir visualmente el progreso de tu garaje!

---

## 📊 Arquitectura de Datos y Automatización del Excel

Cuando rellenas la telemetría en el formulario y presionas **"Guardar Datos"**, la aplicación guarda de forma segura los registros en la memoria interna del navegador del usuario (`localStorage`). El archivo de Excel generado dinámicamente (`.xlsx`) incluye fórmulas matemáticas automáticas que calculan:

* **`DELTA TOTAL (s)`:** Una fórmula que analiza los formatos de tiempo ingresados (`mm:ss.000`) y calcula cuántos segundos netos recortó el auto desde que estaba Stock hasta su modificación final.
* **`EFICIENCIA PI`:** Mide de forma exacta cuántos puntos de PI te costó reducir cada segundo en el circuito (`Puntos de PI / Segundos Ganados`).
* **`ESTADO AUTOMÁTICO`:** * **🔥 Matagigantes:** Si el auto logra recortar más de 6 segundos en su evolución.
    * **❌ Inconducible:** Si el auto recorta menos de 3 segundos o se vuelve incontrolable.
    * **🟢 Equilibrado:** Rendimiento óptimo e intermedio.

---

## 🛠️ Botones de Control de la Base de Datos

* **📥 Descargar Excel:** Genera e inicia la descarga instantánea en tu dispositivo de un archivo compilado con formato profesional, listo para ser importado en Power BI, Looker Studio o Excel para crear Dashboards visuales de rendimiento.
* **🗑️ Limpiar Datos:** Cuenta con una alerta de doble confirmación para reiniciar el historial a cero (`Descargar Excel (0)`) cuando decidas iniciar una nueva temporada o cambiar de circuito de pruebas.

---

🏁 *¡Es hora de quemar llanta, registrar tus tiempos y descubrir qué auto es el verdadero rey de las calles bajo el Street Project Protocol!* 🏁
