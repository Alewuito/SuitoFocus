# Estructura del Proyecto SuitoFocus# 🎨 Estructura Visual del Proyecto SuitoFocus

## Organización General```

📁 suitofocus/

````│

suitofocus/├── 📄 index.html                         # 🏠 Página principal (1,304 líneas)

├── index.html├── 📄 README.md                          # 📖 Documentación completa del proyecto

├── README.md├── 📄 PROJECT_STATS.md                   # 📊 Estadísticas y métricas

├── PROJECT_STATS.md├── 📄 .gitignore                         # 🚫 Control de versiones

├── STRUCTURE.md│

├── .gitignore├── 📂 css/                               # 🎨 ESTILOS (3,500+ líneas)

├── css/│   ├── 📄 style.css                      # ⭐ Estilos principales (2,121 líneas)

│   ├── style.css│   │                                     #    - Variables CSS y temas

│   ├── widgets.css│   │                                     #    - Layout principal

│   ├── focus-settings.css│   │                                     #    - Componentes reutilizables

│   ├── user-onboarding.css│   │                                     #    - Responsive design

│   └── intro-screen.css│   │

├── js/│   ├── 📄 widgets.css                    # 🔧 Widgets de productividad

│   ├── core/│   │                                     #    - Pomodoro Timer

│   │   └── user-system.js│   │                                     #    - Task List

│   ├── ui/│   │                                     #    - Habit Tracker

│   │   └── user-interface.js│   │

│   ├── nutrition/│   ├── 📄 focus-settings.css             # 🎯 Modo Focus

│   │   ├── ingredients-database.js│   │                                     #    - Controles de brillo

│   │   ├── meal-generator.js│   │                                     #    - Sonidos ambiente

│   │   ├── meal-planner-v2.js│   │

│   │   ├── meal-planner.js│   ├── 📄 user-onboarding.css            # 👤 Formulario de registro

│   │   └── recipes-database.js│   │                                     #    - Multi-paso

│   └── script.js│   │                                     #    - Validaciones visuales

├── docs/│   │

│   ├── INTELLIGENT_SYSTEM_V2.md│   └── 📄 intro-screen.css               # 🌟 Pantalla de bienvenida

│   ├── CRITICAL_NUTRITION_FIX.md│                                         #    - Animaciones

│   ├── NUTRITION_DATA_SOURCES.md│                                         #    - Disclaimer médico

│   ├── WIDGETS_GUIDE.md│

│   ├── RECIPES_COMPLETENESS_AUDIT.md├── 📂 js/                                # 💻 JAVASCRIPT (8,149+ líneas)

│   └── PLAN_CALORICO_AJUSTADO.md│   │

└── assets/│   ├── 📄 script.js                      # 🎯 ORQUESTADOR PRINCIPAL (3,727 líneas)

```│   │                                     #    - Widgets de productividad

│   │                                     #    - Renderizado de planes

---│   │                                     #    - Gestión de temas

│   │                                     #    - Event listeners globales

## Arquitectura de Capas│   │

│   ├── 📂 core/                          # 🏗️ LÓGICA CENTRAL

### 1. Capa de Presentación│   │   └── 📄 user-system.js             # 👥 Sistema de usuarios (422 líneas)

**Ubicación**: `index.html` + `css/*`│   │                                     #    ✅ Clase UserProfile

│   │                                     #    ✅ Cálculo BMR (Mifflin-St Jeor)

**Responsabilidades**:│   │                                     #    ✅ Cálculo TDEE

- Estructura HTML del documento│   │                                     #    ✅ Calorías objetivo

- Estilos visuales y temas│   │                                     #    ✅ Mínimos OMS (1600F/2000M)

- Diseño responsive│   │                                     #    ✅ Distribución de macros

- Animaciones y transiciones│   │                                     #    ✅ Persistencia LocalStorage

│   │

**Archivos**:│   ├── 📂 ui/                            # 🖼️ INTERFACES DE USUARIO

- `index.html`: Estructura completa de la aplicación│   │   └── 📄 user-interface.js          # 📋 Gestión de UI (800+ líneas)

- `css/style.css`: Estilos globales, variables CSS, temas│   │                                     #    - Onboarding multi-paso

- `css/widgets.css`: Estilos específicos de widgets de productividad│   │                                     #    - Selección de usuario

- `css/focus-settings.css`: Estilos del modo focus│   │                                     #    - Validación de formularios

- `css/user-onboarding.css`: Estilos del formulario de registro│   │                                     #    - Navegación entre pantallas

- `css/intro-screen.css`: Estilos de la pantalla inicial│   │

│   └── 📂 nutrition/                     # 🍎 SISTEMA NUTRICIONAL (3,200+ líneas)

---│       │

│       ├── 📄 ingredients-database.js    # 📊 BASE DE DATOS (1,000+ líneas)

### 2. Capa de Interfaz│       │                                 #    ┌─────────────────────────┐

**Ubicación**: `js/ui/`│       │                                 #    │   63 INGREDIENTES       │

│       │                                 #    ├─────────────────────────┤

**Responsabilidades**:│       │                                 #    │ 🥩 Proteínas:      20   │

- Gestión de pantallas y navegación│       │                                 #    │ 🍚 Carbohidratos:  15   │

- Validación de formularios│       │                                 #    │ 🥦 Verduras:       13   │

- Renderizado de componentes de usuario│       │                                 #    │ 🥑 Grasas:          7   │

- Gestión de sesiones│       │                                 #    │ 🍎 Frutas:          5   │

│       │                                 #    │ 🥛 Otros:           3   │

**Archivos**:│       │                                 #    └─────────────────────────┘

- `js/ui/user-interface.js`: Onboarding, selección de usuario, validaciones│       │                                 #    Datos BEDCA por 100g:

│       │                                 #    - kcal, proteína, carbs, grasa, fibra

---│       │                                 #    - tags, alérgenos, coste

│       │                                 #    - tiempo cocción, preparación

### 3. Capa de Lógica de Aplicación│       │

**Ubicación**: `js/script.js`│       ├── 📄 meal-generator.js          # 🤖 MOTOR INTELIGENTE (500+ líneas)

│       │                                 #    ┌─────────────────────────┐

**Responsabilidades**:│       │                                 #    │  ALGORITMO DE GENERACIÓN│

- Orquestación general del sistema│       │                                 #    ├─────────────────────────┤

- Event listeners globales│       │                                 #    │ 1️⃣ Filtrar por alergias │

- Coordinación entre módulos│       │                                 #    │ 2️⃣ Priorizar favoritos  │

- Gestión del estado de la aplicación│       │                                 #    │ 3️⃣ Excluir dislikes     │

- Renderizado de widgets y planes nutricionales│       │                                 #    │ 4️⃣ Aplicar restricciones│

│       │                                 #    │ 5️⃣ Seleccionar proteína │

**Funcionalidades principales**:│       │                                 #    │ 6️⃣ Seleccionar carbos   │

- Pomodoro Timer│       │                                 #    │ 7️⃣ Añadir verduras      │

- Focus Timer│       │                                 #    │ 8️⃣ Calcular grasa       │

- Task List│       │                                 #    │ 9️⃣ Sumar macros auto    │

- Habit Tracker│       │                                 #    └─────────────────────────┘

- Water Intake Tracker│       │                                 #    11 Plantillas de comidas

- Sleep Tracker│       │                                 #    Clase MealGenerator

- Gratitude Journal│       │                                 #    Combinaciones clásicas

- Renderizado de planes de dieta│       │

│       ├── 📄 meal-planner-v2.js         # 🗓️ PLANIFICADOR V2 (200 líneas)

---│       │                                 #    ✅ Genera 4 semanas × 7 días

│       │                                 #    ✅ Formato compatible con UI

### 4. Capa de Negocio│       │                                 #    ✅ Búsqueda de videos

**Ubicación**: `js/core/` + `js/nutrition/`│       │                                 #    ✅ Persistencia LocalStorage

│       │                                 #    API Pública: MealPlanner

#### Módulo Core (`js/core/user-system.js`)│       │

**Responsabilidades**:│       ├── 📄 meal-planner.js            # 📦 [LEGACY] V1.0 (291 líneas)

- Gestión de perfiles de usuario│       │                                 #    ⚠️ 28 recetas fijas

- Cálculos nutricionales base│       │                                 #    ⚠️ Sistema antiguo

- Validación de datos de salud│       │                                 #    ✅ Exporta LEGACY_CATALOG

│       │

**Funcionalidades**:│       └── 📄 recipes-database.js        # 📚 [LEGACY] Recetas (800+ líneas)

- Cálculo BMR (Mifflin-St Jeor)│                                         #    16 recetas con pasos detallados

- Cálculo TDEE (Total Daily Energy Expenditure)│                                         #    Videos de YouTube

- Cálculo de calorías objetivo│                                         #    Usado para mostrar instrucciones

- Aplicación de mínimos OMS│

- Distribución de macronutrientes├── 📂 docs/                              # 📚 DOCUMENTACIÓN (1,500+ líneas)

- Persistencia de perfiles│   │

│   ├── 📄 INTELLIGENT_SYSTEM_V2.md       # 🚀 Sistema Inteligente Completo

#### Módulo Nutrition (`js/nutrition/`)│   │                                     #    - Arquitectura detallada

│   │                                     #    - Ejemplos de generación

**`ingredients-database.js`**:│   │                                     #    - Comparativa V1 vs V2

- Base de datos de 63 ingredientes│   │                                     #    - Guía para desarrolladores

- Datos BEDCA (por 100g)│   │

- Categorización: proteínas, carbohidratos, verduras, grasas, frutas│   ├── 📄 CRITICAL_NUTRITION_FIX.md      # ⚠️ Corrección Crítica

- Información de alérgenos, coste, tiempo de cocción│   │                                     #    - Problema: Calorías < 1000 kcal

│   │                                     #    - Solución: Mínimos OMS

**`meal-generator.js`**:│   │                                     #    - Before/After comparison

- Motor de generación inteligente de comidas│   │

- 11 plantillas de comidas│   ├── 📄 NUTRITION_DATA_SOURCES.md      # 📊 Datos BEDCA

- Algoritmos de filtrado y selección│   │                                     #    - Tablas completas por ingrediente

- Cálculo automático de macronutrientes│   │                                     #    - Cálculos detallados

- Respeto de restricciones dietéticas│   │                                     #    - Referencias oficiales

│   │

**`meal-planner-v2.js`**:│   ├── 📄 WIDGETS_GUIDE.md               # 🔧 Guía de Widgets

- Generación de planes semanales│   │                                     #    - Configuración

- Formateo de datos para UI│   │                                     #    - Uso de cada widget

- Persistencia de planes│   │

- Búsqueda de videos relacionados│   ├── 📄 RECIPES_COMPLETENESS_AUDIT.md  # ✅ Auditoría de Recetas

│   │                                     #    - 16 recetas completas

**`meal-planner.js`** [LEGACY]:│   │                                     #    - 12 pendientes

- Sistema antiguo de 28 recetas fijas│   │

- Mantenido para compatibilidad│   └── 📄 PLAN_CALORICO_AJUSTADO.md      # 📈 Ajustes Calóricos

│                                         #    - Distribución de macros

**`recipes-database.js`** [LEGACY]:│                                         #    - Ejemplos por usuario

- 16 recetas con instrucciones detalladas│

- Videos de YouTube└── 📂 assets/                            # 🎵 RECURSOS

- Usado para mostrar pasos de preparación    └── (Archivos de audio externos)      #    - Sonidos ambiente (URLs)

````

---

---

## Flujo de Datos del Sistema

## 🔄 Flujo de Datos

### Flujo Principal de Generación de Plan

````

```┌─────────────────────────────────────────────────────────────────┐

Usuario → user-interface.js (captura datos)│                          USUARIO                                │

    ↓│                            ↓                                     │

user-system.js (cálculos BMR/TDEE/calorías)│                   [Completa Perfil]                             │

    ↓│                            ↓                                     │

ingredients-database.js (fuente de datos)│     ┌──────────────────────────────────────────────┐           │

    ↓│     │         js/core/user-system.js               │           │

meal-generator.js (genera comidas personalizadas)│     │  ┌────────────────────────────────────────┐  │           │

    ↓│     │  │ UserProfile                            │  │           │

meal-planner-v2.js (organiza en plan semanal)│     │  │ - edad, peso, altura, género          │  │           │

    ↓│     │  │ - objetivo (perder/mantener/ganar)    │  │           │

script.js (renderiza en pantalla)│     │  │ - alergias: ['nuts', 'lactose']       │  │           │

    ↓│     │  │ - favoritos: ['salmon', 'brocoli']    │  │           │

Usuario ve su plan personalizado│     │  │ - dislikes: ['berenjena']             │  │           │

```│     │  └────────────────────────────────────────┘  │           │

│     │            ↓                                  │           │

### Algoritmo de Generación de Comidas│     │    calculateBMR() → 1450 kcal                │           │

│     │    calculateTDEE() → 2248 kcal               │           │

1. **Filtrado**: Excluir ingredientes según alergias y dislikes│     │    calculateTargetCalories() → 1748 kcal     │           │

2. **Priorización**: Duplicar probabilidad de ingredientes favoritos│     └──────────────────────────────────────────────┘           │

3. **Selección de Proteína**: 30% de calorías objetivo│                            ↓                                     │

4. **Selección de Carbohidratos**: 40% de calorías objetivo│     ┌──────────────────────────────────────────────┐           │

5. **Adición de Verduras**: 1-2 porciones│     │   js/nutrition/ingredients-database.js       │           │

6. **Cálculo de Grasa**: 30% de calorías restantes│     │  ┌────────────────────────────────────────┐  │           │

7. **Suma Automática**: Calcular macros totales de la combinación│     │  │ INGREDIENTS_DATABASE                   │  │           │

8. **Generación de Descripción**: Formatear para mostrar al usuario│     │  │ - proteins: 20 ingredientes            │  │           │

│     │  │ - carbs: 15 ingredientes               │  │           │

---│     │  │ - vegetables: 13 ingredientes          │  │           │

│     │  │ - fats: 7 ingredientes                 │  │           │

## Dependencias entre Módulos│     │  │ - fruits: 5 ingredientes               │  │           │

│     │  └────────────────────────────────────────┘  │           │

### Orden de Carga Crítico│     └──────────────────────────────────────────────┘           │

│                            ↓                                     │

Los scripts deben cargarse en este orden específico:│     ┌──────────────────────────────────────────────┐           │

│     │    js/nutrition/meal-generator.js            │           │

```│     │  ┌────────────────────────────────────────┐  │           │

1. user-system.js        → Define UserProfile, cálculos base│     │  │ MealGenerator                          │  │           │

2. user-interface.js     → Usa UserSystem│     │  │ 1. filterIngredients()                 │  │           │

3. ingredients-database.js → Define INGREDIENTS_DATABASE│     │  │    → Excluir: nuts, lactose            │  │           │

4. meal-generator.js     → Usa INGREDIENTS_DATABASE│     │  │    → Excluir: berenjena                │  │           │

5. meal-planner-v2.js    → Usa MealGenerator│     │  │ 2. prioritizePreferred()               │  │           │

6. recipes-database.js   → Define RECIPES_DATABASE│     │  │    → Salmon (prioridad 2)              │  │           │

7. script.js             → Usa todos los anteriores│     │  │    → Brocoli (prioridad 2)             │  │           │

```│     │  │ 3. selectWeightedRandom()              │  │           │

│     │  │    → Más probabilidad favoritos        │  │           │

### Relaciones de Dependencia│     │  │ 4. generateMeal(targetKcal)            │  │           │

│     │  │    → Proteína: Salmon 102g (184 kcal)  │  │           │

```│     │  │    → Carbs: Quinoa 204g (245 kcal)     │  │           │

script.js│     │  │    → Verduras: Brocoli 150g            │  │           │

  ├─→ MealPlanner (meal-planner-v2.js)│     │  │    → Grasa: Aceite 20ml                │  │           │

  │     └─→ MealGenerator (meal-generator.js)│     │  │ 5. calculateNutrition()                │  │           │

  │           └─→ INGREDIENTS_DATABASE (ingredients-database.js)│     │  │    → SUMA AUTOMÁTICA de macros         │  │           │

  ├─→ UserSystem (user-system.js)│     │  │    → Total: 608 kcal, 34P, 62C, 35F    │  │           │

  ├─→ UserInterface (user-interface.js)│     │  └────────────────────────────────────────┘  │           │

  │     └─→ UserSystem (user-system.js)│     └──────────────────────────────────────────────┘           │

  └─→ RECIPES_DATABASE (recipes-database.js)│                            ↓                                     │

```│     ┌──────────────────────────────────────────────┐           │

│     │   js/nutrition/meal-planner-v2.js            │           │

---│     │  ┌────────────────────────────────────────┐  │           │

│     │  │ MealPlanner                            │  │           │

## Sistema de Almacenamiento│     │  │ generateWeeklyPlanForUser()            │  │           │

│     │  │ - Genera 4 semanas × 7 días            │  │           │

### LocalStorage Keys│     │  │ - Cada día: 5 comidas                  │  │           │

│     │  │ - Total: 140 comidas únicas            │  │           │

```│     │  │ formatDayForUI()                       │  │           │

suitofocus_users           → Array de perfiles de usuario│     │  │ - Convierte a formato compatible       │  │           │

suitofocus_active_user     → ID del usuario activo│     │  │ savePlanForUser()                      │  │           │

suitofocus_session         → Datos de sesión activa│     │  │ - Guarda en LocalStorage               │  │           │

meal_plan_[userId]         → Plan de comidas del usuario│     │  └────────────────────────────────────────┘  │           │

legacy_plan_[userId]       → Plan antiguo (compatibilidad)│     └──────────────────────────────────────────────┘           │

focus_settings             → Configuración de modo focus│                            ↓                                     │

widget_states              → Estado de widgets│     ┌──────────────────────────────────────────────┐           │

```│     │         js/script.js (Main)                  │           │

│     │  ┌────────────────────────────────────────┐  │           │

---│     │  │ createDietPlanHTML()                   │  │           │

│     │  │ - Renderiza plan en pantalla           │  │           │

## Extensibilidad│     │  │ - Muestra macros por comida            │  │           │

│     │  │ - Modal con detalles                   │  │           │

### Añadir Nuevos Ingredientes│     │  │ - Totales diarios                      │  │           │

│     │  └────────────────────────────────────────┘  │           │

**Archivo**: `js/nutrition/ingredients-database.js`│     └──────────────────────────────────────────────┘           │

│                            ↓                                     │

```javascript│                      [USUARIO VE SU PLAN]                       │

INGREDIENTS_DATABASE.proteins.nuevo_ingrediente = {│       "Salmón (102g), Quinoa (204g), Brócoli (150g)..."        │

    name: 'Nombre del ingrediente',│                  608 kcal | 34P | 62C | 35F                     │

    kcal_per_100g: 150,└─────────────────────────────────────────────────────────────────┘

    protein_per_100g: 20,```

    carbs_per_100g: 5,

    fat_per_100g: 3,---

    fiber_per_100g: 1,

    tags: ['lean', 'high_protein'],## 📦 Sistema de Módulos

    allergens: [],

    cost: 'medium',```

    cookingTime: 'quick',┌────────────────────────────────────────────────────────────┐

    preparation: ['plancha', 'horno'],│                    CAPA DE PRESENTACIÓN                    │

    season: 'all'├────────────────────────────────────────────────────────────┤

};│  index.html + css/*.css                                    │

```│  - Estructura HTML                                         │

│  - Estilos y temas                                         │

### Añadir Nuevas Plantillas de Comidas│  - Responsive design                                       │

└────────────────────────────────────────────────────────────┘

**Archivo**: `js/nutrition/meal-generator.js`                            ↓

┌────────────────────────────────────────────────────────────┐

```javascript│                    CAPA DE INTERFAZ                        │

MEAL_TEMPLATES.push({├────────────────────────────────────────────────────────────┤

    type: 'lunch',│  js/ui/user-interface.js                                   │

    name: 'Nueva Plantilla',│  - Onboarding                                              │

    structure: {│  - Selección de usuario                                    │

        protein: { portion: [120, 200], required: true },│  - Validaciones                                            │

        carbs: { portion: [150, 250], required: true },└────────────────────────────────────────────────────────────┘

        vegetables: { portion: [100, 200], count: [1, 2] },                            ↓

        fats: { portion: [10, 30], required: true }┌────────────────────────────────────────────────────────────┐

    },│                    CAPA DE LÓGICA                          │

    tags: ['balanced', 'complete']├────────────────────────────────────────────────────────────┤

});│  js/script.js (Orquestador)                                │

```│  - Coordina todo el sistema                                │

│  - Event listeners                                         │

### Añadir Nuevos Widgets│  - Renderizado                                             │

│  - Gestión de estado                                       │

1. Crear función en `js/script.js`└────────────────────────────────────────────────────────────┘

2. Añadir estilos en `css/widgets.css`                            ↓

3. Registrar event listeners┌────────────────────────────────────────────────────────────┐

4. Añadir a sistema de persistencia│                    CAPA DE NEGOCIO                         │

├────────────────────────────────────────────────────────────┤

---│  js/core/user-system.js                                    │

│  - Cálculos BMR/TDEE                                       │

## Consideraciones de Rendimiento│  - Validación de mínimos OMS                               │

│  - Gestión de perfiles                                     │

### Optimizaciones Implementadas│                                                            │

│  js/nutrition/meal-generator.js                            │

- **Event Delegation**: Un listener para múltiples elementos│  - Algoritmo de generación                                 │

- **Debouncing**: En inputs de búsqueda y filtros│  - Filtrado inteligente                                    │

- **Lazy Loading**: Audio cargado bajo demanda│  - Cálculo de macros                                       │

- **LocalStorage**: Caché de datos calculados│                                                            │

- **CSS Variables**: Cambio de temas sin recarga│  js/nutrition/meal-planner-v2.js                           │

│  - Generación de planes semanales                          │

### Métricas de Carga│  - Formateo de datos                                       │

└────────────────────────────────────────────────────────────┘

- Carga inicial: < 1 segundo                            ↓

- Generación de plan (28 días): ~1 segundo┌────────────────────────────────────────────────────────────┐

- Cambio de tema: instantáneo│                    CAPA DE DATOS                           │

- Tamaño total: ~500KB (sin audio)├────────────────────────────────────────────────────────────┤

│  js/nutrition/ingredients-database.js                      │

---│  - 63 ingredientes con datos BEDCA                         │

│  - Estructura normalizada                                  │

## Arquitectura de Datos│                                                            │

│  LocalStorage                                              │

### Modelo de Usuario│  - Persistencia de usuarios                                │

│  - Persistencia de planes                                  │

```javascript│  - Sesiones                                                │

{└────────────────────────────────────────────────────────────┘

    id: String,```

    name: String,

    age: Number,---

    gender: String,

    height: Number,## 🎯 Ventajas de la Nueva Estructura

    weight: Number,

    activityLevel: String,### ✅ Antes (Todo en raíz)

    goal: String,

    dietType: String,```

    allergens: Array<String>,suitofocus/

    foodPreferences: Array<String>,├── style.css

    dislikedFoods: Array<String>,├── widgets.css

    bmr: Number,├── focus-settings.css

    tdee: Number,├── user-onboarding.css

    targetCalories: Number,├── intro-screen.css

    macroDistribution: { protein: Number, carbs: Number, fat: Number }├── user-system.js

}├── user-interface.js

```├── ingredients-database.js

├── meal-generator.js

### Modelo de Comida Generada├── meal-planner-v2.js

├── meal-planner.js

```javascript├── recipes-database.js

{├── script.js

    type: String,              // 'breakfast', 'lunch', 'dinner', 'snack'├── CRITICAL_NUTRITION_FIX.md

    name: String,              // Descripción legible├── INTELLIGENT_SYSTEM_V2.md

    ingredients: Array<{├── NUTRITION_DATA_SOURCES.md

        id: String,└── ... (20 archivos en un solo nivel)

        name: String,```

        amount: Number,        // en gramos

        kcal: Number,❌ Difícil de navegar

        protein: Number,❌ No hay separación lógica

        carbs: Number,❌ Mezcla código con documentación

        fat: Number

    }>,### ✅ Ahora (Organizado)

    totalNutrition: {

        kcal: Number,```

        protein: Number,suitofocus/

        carbs: Number,├── index.html

        fat: Number,├── README.md

        fiber: Number├── css/           (5 archivos CSS)

    },├── js/

    video: String|null,        // URL de YouTube│   ├── core/      (1 archivo - usuarios)

    instructions: Array<String>|null│   ├── ui/        (1 archivo - interfaces)

}│   ├── nutrition/ (5 archivos - sistema nutricional)

```│   └── script.js  (orquestador)

├── docs/          (6 archivos de documentación)

---└── assets/        (recursos)

````

## Mantenimiento y Actualización

✅ Fácil de navegar

### Tareas Comunes✅ Separación clara por responsabilidad

✅ Código separado de documentación

**Actualizar datos BEDCA**:✅ Escalable para futuro

- Archivo: `js/nutrition/ingredients-database.js`

- Verificar en: http://www.bedca.net/---

**Modificar cálculos nutricionales**:## 📈 Beneficios Prácticos

- Archivo: `js/core/user-system.js`

- Métodos: `calculateBMR()`, `calculateTDEE()`, `calculateTargetCalories()`### Para Desarrollo

**Cambiar algoritmo de generación**:1. **Encontrar archivos**: `css/` → estilos, `js/nutrition/` → comidas

- Archivo: `js/nutrition/meal-generator.js`2. **Añadir funcionalidad**: Ubicación obvia por módulo

- Clase: `MealGenerator`3. **Colaboración**: Estructura estándar reconocible

4. **Git**: Mejor organización de commits por carpeta

**Actualizar estilos visuales**:

- Archivo: `css/style.css`### Para Mantenimiento

- Sección: `:root` (variables CSS)

1. **CSS**: Modificar solo `css/style.css` para estilos globales

---2. **Nutrición**: Todo en `js/nutrition/` aislado

3. **UI**: Cambios de interfaz solo en `js/ui/`

## Comparativa: Antes vs Después4. **Documentación**: Todo en `docs/` accesible

### Estructura Antigua (V1.0)### Para Escalabilidad

```1. **Nuevos módulos**: Crear nueva carpeta en `js/`

Todos los archivos en raíz (20 archivos mezclados)2. **Temas**: Añadir en `css/`

- Sin separación lógica3. **Assets**: Organizar en subcarpetas de `assets/`

- Difícil navegación4. **Tests**: Crear `tests/` en el futuro

- Código mezclado con documentación

- 28 recetas fijas---

- Macros calculados manualmente

```## 🔮 Preparado para el Futuro



### Estructura Actual (V2.0)La estructura actual permite fácilmente:



```

Organización modular por responsabilidadsuitofocus/

- Separación clara: css/, js/, docs/├── css/

- Subdivisión lógica: core/, ui/, nutrition/├── js/

- Código separado de documentación│ ├── core/

- 63 ingredientes → combinaciones infinitas│ ├── ui/

- Macros calculados automáticamente│ ├── nutrition/

````│ ├── widgets/      # 🔮 FUTURO: Separar widgets

│   ├── analytics/    # 🔮 FUTURO: Tracking y métricas

---│   └── api/          # 🔮 FUTURO: Backend integration

├── docs/

## Preparación para Futuro├── assets/

│   ├── images/       # 🔮 FUTURO: Logos, iconos

### Posibles Extensiones│   ├── audio/        # 🔮 FUTURO: Sonidos locales

│   └── fonts/        # 🔮 FUTURO: Fuentes custom

**Backend Integration** (`js/api/`):├── tests/            # 🔮 FUTURO: Unit tests

- Sincronización en la nube└── build/            # 🔮 FUTURO: Producción optimizada

- Compartir planes```

- Analytics

---

**Testing** (`tests/`):

- Unit tests (Jest)**Estructura actualizada**: Noviembre 2, 2025

- Integration tests**Versión**: 2.0.0 - Organizada Profesionalmente

- E2E tests (Playwright)

**Build Process** (`build/`):
- Minificación CSS/JS
- Optimización de imágenes
- Bundle para producción

**Componentes Adicionales**:
- `js/widgets/`: Separar widgets del script principal
- `js/analytics/`: Tracking y métricas
- `assets/images/`: Logos e iconos
- `assets/fonts/`: Fuentes personalizadas

---

**Versión del Documento**: 2.0.0
**Última Actualización**: Noviembre 2, 2025
````
