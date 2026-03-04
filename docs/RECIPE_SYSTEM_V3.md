# Sistema de Recetas Elaboradas V3.0

## Resumen Ejecutivo

El Sistema de Recetas Elaboradas V3.0 representa una evolución completa del planificador nutricional, pasando de un sistema que mezclaba ingredientes sueltos para cumplir macros, a un sistema que genera **recetas completas reales** con instrucciones de preparación, cantidades simples y facilidad de uso.

## Problema Identificado

### Sistema Anterior (V2.0)

- Generaba combinaciones de ingredientes sin coherencia culinaria
- Ejemplo: "150.37g de salmón + 23.89g de brócoli + 45.12g de arroz"
- No proporcionaba recetas reales ni instrucciones
- Cantidades con decimales complicados
- No reflejaba platos reales que la gente cocina

### Solución Implementada (V3.0)

- Base de datos de recetas elaboradas reales
- Cantidades simplificadas (50g, 100g, 150g, 200g, 1 unidad, etc.)
- Instrucciones paso a paso de preparación
- Recetas basadas en cocina mediterránea tradicional
- Ajuste automático de porciones para cumplir objetivos calóricos

## Arquitectura del Sistema

### 1. Base de Datos de Recetas (recipes-database.js)

**Estructura de una Receta:**

```javascript
{
    id: 'C001',
    nombre: 'Pollo a la plancha con arroz basmati y verduras',
    tipo: 'comida',
    porciones: 1,
    tiempo_preparacion: 25,  // minutos
    dificultad: 'facil',
    ingredientes: [
        { nombre: 'Pechuga de pollo', cantidad: 150, unidad: 'g' },
        { nombre: 'Arroz basmati', cantidad: 80, unidad: 'g' },
        { nombre: 'Brócoli', cantidad: 150, unidad: 'g' }
        // ... más ingredientes con cantidades SIMPLES
    ],
    instrucciones: [
        'Cocinar el arroz basmati según instrucciones del paquete (unos 15 minutos)',
        'Cocinar el brócoli al vapor durante 8 minutos',
        'Sazonar la pechuga de pollo con especias',
        // ... instrucciones claras paso a paso
    ],
    info_nutricional: {
        kcal: 580,
        proteinas: 45,
        carbohidratos: 68,
        grasas: 12
    },
    tags: ['proteico', 'saludable', 'equilibrado']
}
```

**Recetas Disponibles:**

#### Desayunos (6 recetas)

1. **Tostadas con aguacate y huevo** (420 kcal)

   - Pan integral 80g + Aguacate 100g + 2 Huevos
   - 10 minutos de preparación

2. **Gachas de avena con frutas y nueces** (450 kcal)

   - Avena 60g + Leche 250ml + Plátano 100g + Nueces 20g
   - 8 minutos

3. **Tortilla francesa con jamón york y queso** (400 kcal)

   - 2 Huevos + Jamón york 50g + Queso 30g + Pan integral 60g
   - 8 minutos

4. **Bowl de yogur griego con granola y frutas** (440 kcal)

   - Yogur griego 200g + Granola 40g + Fresas 100g + Arándanos 50g
   - 5 minutos

5. **Batido verde energético** (380 kcal)

   - Espinacas 50g + Plátano 100g + Manzana 100g + Leche avena 250ml
   - 5 minutos

6. **Tostadas de pan integral con jamón serrano y tomate** (380 kcal)
   - Pan integral 100g + Tomate 100g + Jamón serrano 40g
   - 7 minutos

#### Snacks (5 recetas)

1. **Tostada de pan integral con tomate** (180 kcal) - 5 min
2. **Yogur natural con frutos secos** (220 kcal) - 2 min
3. **Palitos de zanahoria con hummus** (150 kcal) - 5 min
4. **Manzana con mantequilla de almendras** (180 kcal) - 3 min
5. **Frutos secos mixtos** (240 kcal) - 1 min

#### Comidas (6 recetas)

1. **Pollo a la plancha con arroz basmati y verduras** (580 kcal)

   - Pechuga 150g + Arroz 80g + Brócoli 150g + Zanahoria 100g
   - 25 minutos

2. **Salmón al horno con patata y espárragos** (550 kcal)

   - Salmón 150g + Patata 200g + Espárragos 150g
   - 30 minutos

3. **Lentejas estofadas con verduras** (520 kcal, 2 porciones)

   - Lentejas 200g + Zanahoria 100g + Cebolla 100g + Pimiento 100g
   - 40 minutos

4. **Pasta integral con pollo y verduras** (560 kcal)

   - Pasta integral 80g + Pollo 120g + Calabacín 100g
   - 20 minutos

5. **Ensalada completa mediterránea** (580 kcal)

   - Lechuga + Atún 120g + 2 Huevos cocidos + Queso 50g
   - 15 minutos

6. **Paella de verduras** (600 kcal, 2 porciones)
   - Arroz 160g + Judías verdes 100g + Pimiento 100g
   - 35 minutos

#### Cenas (6 recetas)

1. **Merluza al vapor con verduras** (380 kcal) - 20 min
2. **Tortilla de espinacas con ensalada** (340 kcal) - 15 min
3. **Pechuga de pollo con ensalada variada** (420 kcal) - 18 min
4. **Crema de verduras con huevo pochado** (360 kcal) - 25 min
5. **Lubina al horno con verduras asadas** (400 kcal) - 30 min
6. **Revuelto de champiñones y gambas** (320 kcal) - 12 min

**Total: 29 recetas elaboradas**

### 2. Generador de Recetas (recipe-generator.js)

**Clase:** `RecipeBasedMealGenerator`

**Funciones Principales:**

#### a) Cálculo de Calorías Objetivo

```javascript
calcularKcalObjetivo() {
    // Fórmula Mifflin-St Jeor (más precisa que Harris-Benedict)
    // TMB = (10 × peso kg) + (6.25 × altura cm) - (5 × edad) + factor_sexo
    // TDEE = TMB × factor_actividad
    // Ajuste según objetivo (déficit -500 kcal, superávit +300 kcal)
}
```

#### b) Selección de Receta Apropiada

```javascript
seleccionarReceta(tipoComida, kcalObjetivo, preferencias) {
    // 1. Filtra recetas por tipo (desayuno, comida, cena, snack)
    // 2. Aplica preferencias (vegetariano, vegano, etc.)
    // 3. Busca receta con calorías más cercanas al objetivo
    // 4. Ajusta porciones si es necesario
}
```

#### c) Sistema de Ajuste de Porciones

```javascript
ajustarPorciones(receta, multiplicador) {
    // Factores permitidos: 0.5, 1, 1.5, 2, 2.5, 3
    // Redondeo inteligente:
    // - Cantidades > 100g → redondear a decenas (120, 130, 140...)
    // - Cantidades 10-100g → redondear a múltiplos de 5 (15, 20, 25...)
    // - Cantidades < 10g → redondear a enteros (1, 2, 3...)
}
```

**Ejemplo de Ajuste:**

- Receta original: Pollo 150g (580 kcal)
- Usuario necesita: 750 kcal
- Multiplicador: 750 / 580 = 1.29
- Factor aplicado: **1.5** (más cercano)
- Cantidades ajustadas: Pollo **230g** (redondeado de 225g)

### 3. Planificador (meal-planner-v2.js)

**Distribución Calórica OMS:**

- Desayuno: 22% de calorías diarias
- Media mañana: 8%
- Comida: 33%
- Merienda: 8%
- Cena: 29%

**Flujo de Generación de Plan:**

```
1. Calcular calorías objetivo usuario (ej: 2000 kcal/día)
2. Distribuir según OMS:
   - Desayuno: 440 kcal → Seleccionar receta cercana
   - Media mañana: 160 kcal → Snack apropiado
   - Comida: 660 kcal → Comida completa
   - Merienda: 160 kcal → Snack
   - Cena: 580 kcal → Cena ligera
3. Ajustar porciones si es necesario
4. Generar HTML con receta completa + instrucciones
```

## Ventajas del Nuevo Sistema

### 1. Cantidades Simples

**Antes (V2.0):**

```
Salmón: 147.32g
Brócoli: 86.74g
Arroz: 54.19g
```

**Ahora (V3.0):**

```
Salmón: 150g
Espárragos: 150g
Patata: 200g
```

### 2. Recetas Reales

**Antes:** Lista de ingredientes sin coherencia
**Ahora:** Recetas completas con nombre, ingredientes e instrucciones

### 3. Instrucciones de Preparación

Cada receta incluye pasos detallados:

```
1. Precalentar el horno a 200°C
2. Cortar la patata en rodajas y colocar en una bandeja
3. Limpiar los espárragos y añadir a la bandeja
4. Colocar el salmón sobre las verduras
5. Rociar con aceite, ajo picado y hierbas
6. Exprimir limón por encima
7. Hornear durante 20-25 minutos
8. Servir caliente
```

### 4. Información Completa

- Tiempo de preparación
- Nivel de dificultad
- Número de porciones
- Tags (vegetariano, proteico, rápido, etc.)
- Videos de YouTube relacionados

### 5. Cumplimiento Científico OMS

- Distribución calórica basada en recomendaciones OMS
- Recetas mediterráneas saludables
- Balance de macronutrientes
- Variedad alimentaria

## Comparativa Antes/Después

### Ejemplo: Comida de 600 kcal

**Sistema V2.0 (Ingredientes sueltos):**

```
Comida: Mezcla de ingredientes
- 147.32g de pechuga de pollo
- 73.45g de arroz integral
- 112.88g de brócoli
- 34.12g de zanahoria

Instrucciones: [No disponibles]
Tiempo: [No especificado]
```

**Sistema V3.0 (Receta elaborada):**

```
Pollo a la plancha con arroz basmati y verduras
Tiempo: 25 minutos | Dificultad: Fácil | 1 porción

Ingredientes:
- 150g de Pechuga de pollo
- 80g de Arroz basmati
- 150g de Brócoli
- 100g de Zanahoria
- 15ml de Aceite de oliva
- 1 unidad de Limón
- Especias al gusto

Instrucciones:
1. Cocinar el arroz basmati según instrucciones del paquete (unos 15 minutos)
2. Cocinar el brócoli al vapor durante 8 minutos
3. Cortar la zanahoria en rodajas y cocinar al vapor también
4. Sazonar la pechuga de pollo con especias
5. Cocinar el pollo a la plancha 6-7 minutos por cada lado
6. Rociar el pollo con jugo de limón
7. Servir el pollo con el arroz y las verduras al lado

Información Nutricional:
580 kcal | Proteínas: 45g | Carbohidratos: 68g | Grasas: 12g

Tags: proteico, saludable, equilibrado
```

## Funcionalidades Adicionales

### 1. Lista de Compras Automática

```javascript
generator.generarListaCompras(planDiario);
```

Genera lista agregada de todos los ingredientes necesarios.

### 2. Exportación a JSON

```javascript
generator.exportarPlanJSON(plan);
```

Exporta plan completo en formato JSON para compartir o guardar.

### 3. Filtrado por Preferencias

```javascript
preferencias = {
  vegetariano: true,
  vegano: false,
};
```

Sistema respeta preferencias alimentarias del usuario.

### 4. HTML Generado Automáticamente

```javascript
generator.generarHTMLReceta(receta);
generator.generarHTMLPlanDiario(planDiario);
```

Genera HTML con formato bonito y responsive.

## Cumplimiento Científico OMS/WHO

### Recomendaciones Aplicadas:

- ✅ 400g frutas/verduras diarias (5 porciones)
- ✅ Grasas <30% energía total
- ✅ Grasas saturadas <10%
- ✅ Azúcares libres <10%
- ✅ Sal <5g/día
- ✅ Variedad alimentaria
- ✅ Patrón mediterráneo

### Distribución Macronutrientes:

- Proteínas: 15-30% (recomendación: 10-35%)
- Carbohidratos: 50-60% (recomendación: 45-65%)
- Grasas: 20-30% (recomendación: 20-35%)

## Uso en Código

### Generar Plan Diario:

```javascript
const userProfile = {
  sexo: "hombre",
  edad: 30,
  peso: 75,
  altura: 175,
  actividad: "moderado",
  objetivo: "mantener_peso",
};

const generator = new RecipeBasedMealGenerator(userProfile);
const plan = generator.generarPlanDiario();

console.log(plan);
// Output: Plan con 5 recetas (desayuno, snacks, comida, cena)
```

### Generar Plan Semanal:

```javascript
const planSemanal = generator.generarPlanSemanal({
  vegetariano: true,
});

console.log(planSemanal.semana.Lunes);
// Output: Plan completo del lunes con recetas vegetarianas
```

### Mostrar Receta en UI:

```javascript
const htmlReceta = generator.generarHTMLReceta(receta);
document.getElementById("receta-container").innerHTML = htmlReceta;
```

## Estructura de Archivos

```
js/nutrition/
├── recipes-database.js          # 29 recetas elaboradas mediterráneas
├── recipe-generator.js          # Generador basado en recetas
└── meal-planner-v2.js           # Planificador V3.0 integrado
```

## Próximas Mejoras

### Fase 4 (Futuro):

- [ ] Expandir base de datos a 100+ recetas
- [ ] Integrar API de recetas externa (opcional)
- [ ] Sistema de favoritos de usuario
- [ ] Historial de recetas cocinadas
- [ ] Calificación y reviews de recetas
- [ ] Sustitución inteligente de ingredientes
- [ ] Recetas por temporada
- [ ] Planificación de batch cooking

## Referencias

- Base de datos de recetas: Cocina mediterránea tradicional
- Inspiración: https://github.com/josephrmartinez/recipe-dataset
- Normas OMS/WHO: https://www.who.int/news-room/fact-sheets/detail/healthy-diet
- Fórmula Mifflin-St Jeor (cálculo TMB más preciso)
- Patrón dietético mediterráneo (evidencia científica)

## Conclusión

El Sistema de Recetas Elaboradas V3.0 transforma la experiencia de planificación nutricional de:

**"Mezclar ingredientes para cumplir macros"**

a

**"Cocinar recetas reales con instrucciones claras"**

Esto hace que el sistema sea:

- ✅ Más fácil de usar
- ✅ Más realista y práctico
- ✅ Más educativo (enseña a cocinar)
- ✅ Más motivador (recetas apetecibles)
- ✅ Científicamente válido (OMS compliant)
