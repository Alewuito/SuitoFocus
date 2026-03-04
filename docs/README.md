# SuitoFocus

## Descripcion General

SuitoFocus es una aplicacion web de productividad personal desarrollada con tecnologias nativas del navegador (HTML5, CSS3 y JavaScript ES6+), sin dependencias externas de frameworks. Integra en un unico entorno tres areas funcionales principales: gestion de productividad y habitos, control financiero personal y planificacion nutricional. La aplicacion persiste todos los datos localmente mediante la API de localStorage del navegador, lo que garantiza privacidad total y funcionamiento sin necesidad de conexion a servidores externos.

El proyecto cuenta con aproximadamente 14.453 lineas de codigo distribuidas en 22 archivos, organizados en modulos independientes con separacion clara de responsabilidades. Esta disenado para ser operativo en cualquier navegador moderno sin proceso de instalacion: basta con abrir el archivo `index.html`.

---

## Estado Actual del Proyecto

**Version**: 3.0.0  
**Estado**: En desarrollo activo  
**Ultima actualizacion**: Marzo 2026  
**Lineas de codigo totales**: ~14.453  
**Archivos**: 22  
**Dependencias externas**: 0

---

## Arquitectura Tecnica

### Estructura de Archivos

```
suitofocus/
|
|-- index.html                          # Punto de entrada (1.304 lineas)
|-- test-recipes.html                   # Entorno de pruebas del sistema de recetas
|
|-- css/
|   |-- style.css                       # Estilos globales y temas (2.121 lineas)
|   |-- widgets.css                     # Estilos del sistema de widgets
|   |-- intro-screen.css                # Estilos de la pantalla de bienvenida
|   |-- user-onboarding.css             # Estilos del flujo de registro
|
|-- js/
|   |-- script.js                       # Orquestador principal (3.727 lineas)
|   |-- testing-helpers.js              # Utilidades de prueba
|   |
|   |-- core/
|   |   |-- user-system.js              # Gestion de perfiles de usuario (422 lineas)
|   |
|   |-- ui/
|   |   |-- user-interface.js           # Capa de interfaz de usuario (800+ lineas)
|   |
|   |-- nutrition/
|       |-- ingredients-database.js     # Base de datos BEDCA de ingredientes
|       |-- meal-planner-v2.js          # Planificador nutricional V2
|       |-- meal-planner.js             # Planificador nutricional base
|       |-- meal-templates-realistic.js # Plantillas de comidas
|       |-- package-standards.js        # Estandares de empaquetado
|       |-- recipe-generator.js         # Motor de generacion de recetas
|       |-- recipes-loader.js           # Cargador de base de datos de recetas
|
|-- assets/
|   |-- recipes_extended.json           # Base de datos extendida de recetas
|
|-- docs/
    |-- README.md                       # Este documento
    |-- STRUCTURE.md                    # Arquitectura tecnica detallada
    |-- PROJECT_STATS.md                # Metricas y estadisticas del proyecto
    |-- RECIPE_SYSTEM_V3.md             # Documentacion del sistema de recetas
    |-- INTELLIGENT_SYSTEM_V2.md        # Documentacion del sistema nutricional V2
    |-- WIDGETS_GUIDE.md                # Guia del sistema de widgets
    |-- NUTRITION_DATA_SOURCES.md       # Fuentes de datos nutricionales
    |-- (otros documentos de cambios y correcciones)
```

### Tecnologias Utilizadas

| Tecnologia              | Uso                                               |
| ----------------------- | ------------------------------------------------- |
| HTML5                   | Estructura semantica de la aplicacion             |
| CSS3                    | Estilos, temas, animaciones y responsive design   |
| JavaScript ES6+         | Logica de negocio, modulos y manipulacion del DOM |
| LocalStorage API        | Persistencia de datos en el navegador             |
| HTML5 Drag and Drop API | Sistema de widgets reordenables                   |
| Audio API               | Sonidos ambiente en el modo de concentracion      |

### Metricas por Modulo

| Categoria            | Archivos | Lineas aprox. |
| -------------------- | -------- | ------------- |
| HTML                 | 1        | 1.304         |
| CSS                  | 4        | 3.500+        |
| JavaScript Core      | 1        | 422           |
| JavaScript UI        | 1        | 800+          |
| JavaScript Nutricion | 7        | 3.200+        |
| JavaScript Principal | 1        | 3.727         |
| Documentacion        | 12       | 2.000+        |

---

## Modulos Funcionales

### 1. Sistema de Productividad y Habitos

El modulo central de la aplicacion agrupa las herramientas orientadas a la organizacion del tiempo y el seguimiento de habitos personales.

#### Widgets Disponibles

Los widgets son componentes independientes que el usuario puede crear, reordenar y eliminar desde el dashboard. El sistema utiliza un grid dinamico de 3 columnas que crece verticalmente de forma automatica conforme se anaden nuevos elementos.

- **Recordatorio de medicacion**: permite registrar medicamentos con nombre y hora programada, con marcado de toma y reinicio automatico diario.
- **Lista de tareas**: entrada rapida de tareas mediante teclado, marcado de completadas y persistencia indefinida hasta eliminacion manual.
- **Notas rapidas**: area de texto libre con autoguardado en tiempo real sin necesidad de confirmacion.
- **Seguimiento de habitos**: lista de habitos diarios configurables con reinicio automatico cada dia.

#### Temporizadores de Concentracion

- **Pomodoro Timer**: ciclos de trabajo y descanso configurables con notificacion al finalizar cada intervalo.
- **Focus Timer**: temporizador de sesiones de concentracion con estadisticas de tiempo acumulado.

#### Seguimiento de Salud Fisica

- **Contador de agua**: registro diario de consumo hidrico con objetivo configurable.
- **Registro de sueno**: entrada de horas dormidas con historial.
- **Diario de gratitud**: registro de entradas diarias de texto libre.

#### Sistema de Widgets - Detalles Tecnicos

- **Persistencia**: cada widget almacena sus datos en LocalStorage con claves independientes (`pillsReminders`, `todoList`, `quickNotes`, `dailyHabits`, `widgetPositions`).
- **Drag & Drop**: implementado con la API nativa de HTML5. Las posiciones se guardan automaticamente tras cada reordenamiento.
- **Grid**: comienza en 3x1 y expande filas completas al agregar nuevos widgets.
- **Notificaciones**: sistema propio de notificaciones in-app, sin uso de `alert()` del navegador, con auto-cierre a los 4 segundos.
- **Confirmaciones**: modal personalizado para acciones destructivas, con fondo de desenfoque.

---

### 2. Sistema de Control Financiero

Modulo orientado al registro y analisis de las finanzas personales del usuario.

#### Funcionalidades Implementadas

- **Registro de transacciones**: alta de ingresos y gastos con fecha, importe, categoria y descripcion.
- **Categorizacion automatica**: asignacion de categoria por defecto segun palabras clave en la descripcion.
- **Visualizacion grafica**: graficos de distribucion de gastos por categoria, implementados con la libreria Chart.js (unica dependencia cargada de forma externa).
- **Presupuestos mensuales**: definicion de limites por categoria con indicador de progreso en tiempo real.
- **Reportes**: resumen mensual de ingresos, gastos y saldo, con desglose por categoria.

---

### 3. Sistema Nutricional

El modulo de nutricion es el mas extenso del proyecto y ha pasado por dos versiones mayores durante el desarrollo.

#### Version 2.0 - Sistema Inteligente por Ingredientes

La primera iteracion avanzada implemento un motor de generacion dinamica de comidas basado en una base de datos de 63 ingredientes con datos verificados segun la Base de Datos Espanola de Composicion de Alimentos (BEDCA).

**Base de datos de ingredientes (63 items):**

| Categoria         | Cantidad | Ejemplos                                           |
| ----------------- | -------- | -------------------------------------------------- |
| Proteinas         | 20       | Pollo, salmon, merluza, huevos, tofu, tempeh       |
| Carbohidratos     | 15       | Arroz integral, quinoa, avena, lentejas, garbanzos |
| Verduras          | 13       | Brocoli, espinacas, calabacin, pimiento, zanahoria |
| Grasas saludables | 7        | Aceite de oliva, aguacate, almendras, nueces       |
| Frutas            | 5        | Platano, manzana, frutos rojos, naranja            |
| Otros             | 3        | Leche de avena, leche de coco, hummus              |

**Cada ingrediente incluye:**

- Calorias, proteinas, carbohidratos, grasas y fibra por cada 100g (fuente BEDCA)
- Etiquetas de tipo (`meat`, `fish`, `vegan`, `high_protein`, etc.)
- Alergenos declarados
- Coste relativo (`low`, `medium`, `high`)
- Tiempo de preparacion
- Metodos de coccion compatibles
- Temporada de disponibilidad

**Motor de generacion:**

- Seleccion ponderada aleatoria de ingredientes segun plantillas de comida
- Filtrado obligatorio por alergias declaradas por el usuario
- Prioridad doble para alimentos marcados como favoritos
- Exclusion de alimentos marcados como no deseados
- Compatibilidad con dietas vegetarianas, veganas y otras restricciones

#### Version 3.0 - Sistema de Recetas Elaboradas

La version 3.0 supuso una reorientacion del sistema: en lugar de combinar ingredientes sueltos para alcanzar macros, genera **recetas completas reales** con instrucciones de preparacion. Este cambio fue motivado por la falta de coherencia culinaria del sistema anterior (combinaciones como "150.37g de salmon + 23.89g de brocoli + 45.12g de arroz" no representaban platos cocinables reales).

**Base de datos de recetas (29 recetas mediterraneas):**

| Tipo                    | Cantidad |
| ----------------------- | -------- |
| Desayunos               | 6        |
| Snacks / medias mañanas | 5        |
| Comidas                 | 9        |
| Cenas                   | 9        |

**Estructura de cada receta:**

- Nombre del plato
- Tipo de comida (desayuno, snack, comida, cena)
- Lista de ingredientes con cantidades estandarizadas (50g, 100g, 150g, 1 unidad, 250ml, etc.)
- Instrucciones paso a paso
- Tiempo de preparacion en minutos
- Nivel de dificultad (facil, media, dificil)
- Informacion nutricional completa (kcal, proteinas, carbohidratos, grasas)
- Etiquetas funcionales (proteico, vegetariano, rapido, etc.)

**Ejemplos de recetas incluidas:**

- Tostadas con aguacate y huevo (420 kcal, 10 min)
- Gachas de avena con frutas y nueces (450 kcal, 8 min)
- Pollo a la plancha con arroz basmati y verduras (580 kcal, 25 min)
- Salmon al horno con patata y esparragos (550 kcal, 30 min)
- Lentejas estofadas con verduras (520 kcal, 40 min)
- Merluza al vapor con verduras (380 kcal, 20 min)
- Tortilla de espinacas con ensalada (340 kcal, 15 min)

**Distribucion calorica por toma (basada en recomendaciones OMS/WHO):**

| Toma         | Porcentaje calorico diario |
| ------------ | -------------------------- |
| Desayuno     | 22%                        |
| Media manana | 8%                         |
| Comida       | 33%                        |
| Merienda     | 8%                         |
| Cena         | 29%                        |

**Ajuste de porciones:**
El sistema ajusta las porciones de cada receta en cuatro niveles (0.5x, 1x, 1.5x, 2x) para que el plan diario generado se aproxime al objetivo calorico calculado para el usuario.

**Lista de compras automatica:**
A partir del plan semanal generado, el sistema compila la lista de ingredientes necesarios con cantidades agregadas por producto.

#### Calculos Nutricionales Individualizados

El sistema de usuarios calcula el objetivo calorico diario de cada perfil mediante:

1. **TMB (Tasa Metabolica Basal)**: formula de Mifflin-St Jeor
   - Hombres: `(10 × peso_kg) + (6.25 × altura_cm) - (5 × edad) + 5`
   - Mujeres: `(10 × peso_kg) + (6.25 × altura_cm) - (5 × edad) - 161`

2. **GET (Gasto Energetico Total / TDEE)**: multiplicacion de TMB por factor de actividad fisica
   - Sedentario: x1.2
   - Ligeramente activo: x1.375
   - Moderadamente activo: x1.55
   - Muy activo: x1.725
   - Extremadamente activo: x1.9

3. **Ajuste por objetivo**:
   - Perdida de peso: deficit de 500 kcal/dia
   - Mantenimiento: GET sin modificacion
   - Ganancia muscular: supravit de 500 kcal/dia

4. **Minimos OMS obligatorios**: 1.600 kcal para mujeres, 2.000 kcal para hombres. Si el calculo resulta inferior, se aplica el minimo correspondiente.

---

### 4. Sistema de Usuarios

- **Perfiles multiples**: la aplicacion soporta varios perfiles de usuario independientes almacenados en el mismo dispositivo.
- **Onboarding multipasos**: formulario de registro guiado que recoge nombre, sexo, edad, peso, altura, nivel de actividad, objetivo nutricional, alergias y preferencias alimentarias.
- **Historial de peso**: registro cronologico del peso del usuario con fechas.
- **Persitencia local**: todos los datos del perfil se almacenan en localStorage sin transmision a ningun servidor.

---

### 5. Interfaz de Usuario

#### Temas Visuales

La aplicacion incluye cuatro temas de color seleccionables, con nombres estacionales:

| Tema   | Color principal    | Color secundario | Acento  |
| ------ | ------------------ | ---------------- | ------- |
| Autumn | #E67E22 (naranja)  | #D35400          | #F39C12 |
| Winter | #3498DB (azul)     | #2980B9          | #5DADE2 |
| Spring | #2ECC71 (verde)    | #27AE60          | #58D68D |
| Summer | #F39C12 (amarillo) | #F1C40F          | #F4D03F |

Cada tema aplica un conjunto completo de variables CSS que afectan a todos los componentes de la interfaz de forma coherente.

#### Tipografia

- **Principal**: Poppins (pesos 300, 400, 600, 700, 900)
- **Display**: Anton, Righteous, Racing Sans One
- **Alternativas**: Rubik, Bowlby One SC

#### Pantalla de Bienvenida

Animacion de introduccion con branding del proyecto y disclaimer medico antes de acceder a la aplicacion.

#### Modo de Concentracion (Focus Mode)

Panel de configuracion de sesiones de trabajo con control de brillo de pantalla y sonidos ambiente (lluvia, naturaleza, cafe, etc.) reproducidos mediante la Web Audio API.

#### Responsive Design

La interfaz se adapta a los siguientes rangos de pantalla:

- Desktop: 1920x1080px (resolucion optima)
- Laptop: 1366x768px
- Tablet: 768x1024px
- Movil: 375x667px

---

## Seguridad y Privacidad

- Todos los datos se almacenan exclusivamente en el navegador del usuario mediante localStorage.
- No existe comunicacion con ningun servidor externo durante el uso de la aplicacion.
- No se recopilan datos de uso, telemetria ni informacion personal de forma remota.
- El usuario tiene control total para exportar o eliminar sus datos desde la propia interfaz.

### Consideraciones de Salud

- Los calculos nutricionales y los planes de alimentacion generados no constituyen asesoramiento medico ni nutricional profesional.
- La pantalla de bienvenida incluye un disclaimer explicito recomendando la consulta con un profesional de la salud antes de realizar cambios dieteticos significativos.
- Los minimos caloricos de la OMS son aplicados de forma obligatoria como proteccion ante objetivos de deficit extremo.
- Los valores nutricionales de la base de datos provienen de la fuente oficial BEDCA (Base de Datos Espanola de Composicion de Alimentos).

---

## Compatibilidad

### Navegadores Soportados

| Navegador       | Version minima |
| --------------- | -------------- |
| Google Chrome   | 90+            |
| Mozilla Firefox | 88+            |
| Apple Safari    | 14+            |
| Microsoft Edge  | 90+            |

### APIs del Navegador Utilizadas

- LocalStorage API
- HTML5 Drag and Drop API
- Web Audio API
- DOM API estandar

No se requieren permisos especiales del navegador para el funcionamiento basico de la aplicacion.

---

## Instalacion y Puesta en Marcha

La aplicacion no requiere proceso de instalacion, compilacion ni servidor web.

1. Descargar o clonar el repositorio.
2. Abrir el archivo `index.html` con cualquier navegador moderno compatible.
3. Completar el formulario de onboarding para crear el primer perfil de usuario.
4. Los datos se guardan automaticamente a partir de ese momento.

---

## Proyecciones de Desarrollo Futuro

Las siguientes funcionalidades estan identificadas como extensiones naturales del proyecto, organizadas por horizonte temporal estimado.

### Corto Plazo (1 a 3 meses)

- **Regeneracion individual de comidas**: permitir al usuario sustituir una comida concreta dentro del plan sin regenerar el dia completo.
- **Exportacion del plan a PDF**: generacion de documento descargable con el plan nutricional semanal y la lista de compras correspondiente.
- **Ampliacion de la base de recetas**: expansion desde las 29 recetas actuales hasta 100 o mas, incluyendo cocinas regionales y mayor variedad por tipo de dieta.
- **Busqueda y filtrado de recetas**: interfaz para buscar recetas por nombre, ingrediente, tiempo de preparacion o aporte calorico.

### Medio Plazo (3 a 6 meses)

- **Filtrado por presupuesto**: opcion para limitar la generacion de planes a ingredientes dentro de un coste estimado por dia.
- **Filtrado por tiempo de preparacion**: generacion de planes adaptados a la disponibilidad horaria del usuario en cada toma.
- **Sistema de intercambios**: posibilidad de sustituir un ingrediente de una receta por un equivalente nutricional, con recalculo automatico de macros.
- **Calendariozacion de batch cooking**: sugerencia de sesiones de preparacion semanal agrupando recetas compatibles por tecnica de coccion.
- **Estadisticas de habitos**: dashboard de seguimiento historico de habitos, productividad y cumplimiento de objetivos nutricionales.
- **Tests automatizados**: incorporacion de suite de pruebas unitarias para los modulos de calculo nutricional y generacion de planes.

### Largo Plazo (6 a 12 meses)

- **Aplicacion web progresiva (PWA)**: conversion a PWA para instalacion directa en dispositivos moviles, funcionamiento offline completo y notificaciones push para recordatorios.
- **Backend opcional**: capa de servidor (Node.js o similar) que permita sincronizacion de datos entre dispositivos para usuarios que lo deseen, manteniendo el modo local como opcion predeterminada.
- **Aprendizaje de preferencias**: incorporacion de logica de recomendacion que aprenda de las valoraciones y habitos del usuario para priorizar recetas e ingredientes mas adecuados a lo largo del tiempo.
- **Integracion con dispositivos wearable**: lectura de datos de actividad fisica y sueno desde APIs de wearables compatibles para ajustar automaticamente el TDEE calculado.
- **Comunidad de recetas**: modulo opcional para que usuarios puedan compartir y valorar recetas propias dentro de la plataforma.
- **API publica**: documentacion y exposicion de una API REST para que terceros puedan integrar el sistema de generacion de planes nutricionales en otras aplicaciones.
- **Integracion de datos en tiempo real**: conexion con APIs externas para datos meteorologicos reales en el widget de clima y actualizacion de valores nutricionales desde fuentes oficiales.

---

## Documentacion Interna

| Documento                   | Contenido                                                                |
| --------------------------- | ------------------------------------------------------------------------ |
| `STRUCTURE.md`              | Arquitectura tecnica detallada del proyecto y descripcion de cada modulo |
| `PROJECT_STATS.md`          | Metricas de codigo, lista de funcionalidades implementadas y roadmap     |
| `RECIPE_SYSTEM_V3.md`       | Documentacion completa del sistema de recetas V3.0                       |
| `INTELLIGENT_SYSTEM_V2.md`  | Documentacion del sistema de generacion por ingredientes V2.0            |
| `WIDGETS_GUIDE.md`          | Guia de uso y especificaciones tecnicas del sistema de widgets           |
| `NUTRITION_DATA_SOURCES.md` | Tablas de datos BEDCA y fuentes de informacion nutricional               |

---

## Fuentes de Datos y Referencias

- **BEDCA**: Base de Datos Espanola de Composicion de Alimentos — http://www.bedca.net
- **OMS / WHO Nutrition**: Recomendaciones oficiales de la Organizacion Mundial de la Salud — https://www.who.int/nutrition
- **Formula Mifflin-St Jeor**: Mifflin MD et al., 1990. "A new predictive equation for resting energy expenditure in healthy individuals." — https://pubmed.ncbi.nlm.nih.gov/2305711/

## Características Principales

### Sistema de Productividad

- Gestión de tareas con priorización
- Planificador de calendario con vista semanal
- Widgets personalizables (reloj, notas rápidas, clima, estadísticas)
- Sistema de recompensas con monedas virtuales (SuCoins)
- Dashboard con métricas de productividad

### Sistema Financiero

- Registro de ingresos y gastos
- Categorización automática de transacciones
- Análisis de gastos con gráficos
- Presupuestos mensuales
- Reportes financieros detallados

### Sistema de Recetas Elaboradas V3.0 (Basado en OMS)

- Generación de planes con recetas completas reales (no mezcla de ingredientes)
- 29 recetas mediterráneas elaboradas con instrucciones paso a paso
- Cantidades simplificadas y fáciles de calcular (50g, 100g, 150g, etc.)
- Distribución calórica científica según recomendaciones OMS/WHO
- Adaptación automática a objetivos nutricionales (pérdida, mantenimiento, ganancia)
- Ajuste inteligente de porciones (0.5x, 1x, 1.5x, 2x) para cumplir macros
- Incluye tiempo de preparación, dificultad y videos instructivos
- Lista de compras automática generada a partir del plan

## Estructura del Proyecto

```
suitofocus/
│
├── index.html                              # Punto de entrada principal
├── script.js                               # Lógica principal de la aplicación
├── style.css                               # Estilos globales
├── widgets.css                             # Estilos específicos de widgets
│
├── js/
│   ├── ui/
│   │   ├── dashboard.js                    # Gestión del dashboard principal
│   │   ├── widgets.js                      # Sistema de widgets personalizables
│   │   └── theme.js                        # Sistema de temas claro/oscuro
│   │
│   ├── finances/
│   │   ├── transaction-manager.js          # Gestión de transacciones
│   │   ├── budget-manager.js               # Control de presupuestos
│   │   └── analytics.js                    # Análisis financiero y gráficos
│   │
│   ├── nutrition/
│   │   ├── recipes-database.js             # Base de datos de 29 recetas elaboradas reales
│   │   ├── recipe-generator.js             # Generador de planes con recetas completas
│   │   └── meal-planner-v2.js              # Planificador nutricional V3.0
│   │
│   ├── rewards/
│   │   ├── sucoins.js                      # Sistema de monedas virtuales
│   │   └── achievements.js                 # Sistema de logros
│   │
│   └── storage/
│       └── local-storage.js                # Gestión de persistencia local
│
└── docs/
    ├── STRUCTURE.md                        # Arquitectura técnica del proyecto
    ├── PROJECT_STATS.md                    # Estadísticas y métricas del proyecto
    ├── RECIPE_SYSTEM_V3.md                 # Sistema de recetas elaboradas completo
    └── INTELLIGENT_SYSTEM_V2.md            # Documentación legacy (sistema anterior)
```

## Sistema de Nutrición Inteligente

### Fundamento Científico (OMS/WHO)

El sistema de generación de comidas está basado en:

1. **Recomendaciones OMS/WHO**:
   - Mínimo 400g de frutas y verduras diarias (5 porciones)
   - Grasas totales < 30% de la energía total
   - Grasas saturadas < 10%, grasas trans < 1%
   - Azúcares libres < 10% (idealmente < 5%)
   - Sal < 5g/día

2. **Distribución Calórica Científica**:
   - Desayuno: 22% de calorías diarias
   - Media mañana: 8%
   - Comida: 33%
   - Merienda: 8%
   - Cena: 29%

3. **Patrón Mediterráneo**:
   - Alto consumo de frutas, verduras y cereales integrales
   - Consumo moderado de pescado, aves y lácteos
   - Consumo limitado de carnes rojas
   - Grasas saludables (aceite de oliva, frutos secos)

### Ejemplos de Recetas Incluidas

**Desayunos:**

- Tostadas con aguacate y huevo (420 kcal, 10 min)
- Gachas de avena con frutas y nueces (450 kcal, 8 min)
- Bowl de yogur griego con granola (440 kcal, 5 min)

**Comidas:**

- Pollo a la plancha con arroz basmati y verduras (580 kcal, 25 min)
- Salmón al horno con patata y espárragos (550 kcal, 30 min)
- Lentejas estofadas con verduras (520 kcal, 40 min)

**Cenas:**

- Merluza al vapor con verduras (380 kcal, 20 min)
- Tortilla de espinacas con ensalada (340 kcal, 15 min)
- Lubina al horno con verduras asadas (400 kcal, 30 min)

### Cantidades Simplificadas

A diferencia de sistemas que generan cantidades como "147.32g", ahora usamos:

- **50g, 100g, 150g, 200g** para alimentos sólidos
- **1 unidad, 2 unidades** para huevos, frutas
- **250ml, 500ml** para líquidos
- **Al gusto** para especias y condimentos

### Cada Receta Incluye

- Nombre del plato completo
- Lista de ingredientes con cantidades simples
- Instrucciones paso a paso
- Tiempo de preparación
- Nivel de dificultad (fácil, media, difícil)
- Información nutricional completa
- Tags (vegetariano, proteico, rápido, etc.)

## Características Técnicas

### Tecnologías

- HTML5, CSS3, JavaScript ES6+
- LocalStorage para persistencia de datos
- Chart.js para visualizaciones financieras
- Sistema de módulos ES6
- Arquitectura orientada a componentes

### Características de Desarrollo

- Sin dependencias de frameworks externos
- Código modular y mantenible
- Interfaz responsive
- Modo claro/oscuro
- Persistencia local de datos

### Sistema de Widgets

- Reloj digital con fecha
- Notas rápidas persistentes
- Widget de clima
- Estadísticas de productividad
- Layout personalizable

## Instalación y Uso

1. Clonar el repositorio
2. Abrir `index.html` en un navegador moderno
3. No requiere instalación de dependencias
4. Los datos se guardan automáticamente en LocalStorage

## Características de Seguridad

- Datos almacenados localmente en el navegador
- Sin envío de información a servidores externos
- Control total del usuario sobre su información
- Exportación/importación de datos disponible

## Roadmap Futuro

- Sincronización multi-dispositivo
- Integración con APIs externas (clima real, cotizaciones)
- Exportación a PDF de reportes y recetas
- Modo offline completo
- Notificaciones push para recordatorios
- Análisis predictivo de gastos
- Expandir base de datos a 100+ recetas
- Sistema de favoritos y calificación de recetas
- Planificación de batch cooking

## Contribución

Este proyecto está en desarrollo activo. Todas las sugerencias y contribuciones son bienvenidas.

## Licencia

Proyecto de código abierto para uso educativo y personal.

## Documentación Adicional

- **RECIPE_SYSTEM_V3.md**: Documentación completa del sistema de recetas elaboradas
- **INTELLIGENT_SYSTEM_V2.md**: Documentación legacy (sistema anterior)
- **STRUCTURE.md**: Estructura técnica detallada del proyecto
- **PROJECT_STATS.md**: Estadísticas y métricas del código
- **WIDGETS_GUIDE.md**: Guía de uso de widgets personalizables
