# ✅ SISTEMA DE PROGRESIÓN IMPLEMENTADO

## 🎯 Qué se ha hecho

### 1. **Nuevo campo en formulario**: Experiencia con Dietas

- Paso 3.5 añadido después de "Objetivo"
- Opciones: Principiante / Experimentado
- Con explicación de por qué importa

### 2. **Sistema de 12 semanas progresivas**

- `currentWeek` se calcula automáticamente según fecha de creación
- Se actualiza cada vez que el usuario inicia sesión
- Métodos nuevos en `UserProfile`:
  - `updateCurrentWeek()` - Calcula semana según días transcurridos
  - `advanceWeek()` - Avanza manualmente (testing)
  - `getPlanDescription()` - Devuelve descripción del plan

### 3. **Cálculo de calorías progresivo**

- Reemplazado método `calculateTargetCalories()` completo
- Ahora usa `goal`, `dietExperience` y `currentWeek`
- Progresión gradual diferente para principiantes vs experimentados

### 4. **Escalado inteligente de porciones**

- Modificado `meal-planner.js` función `pickVaried()`
- Ahora calcula `scaleFactor` basado en objetivo calórico
- Crea `scaledQty` con cantidades ajustadas
- Rango: 0.6x a 1.8x (60%-180%)

### 5. **Visualización mejorada**

- Muestra porcentaje si difiere del 100%
- Ejemplo: "Pollo con arroz (85% porción): 170g pollo..."
- Log en consola al generar plan

### 6. **Herramientas de testing**

- Nuevo archivo `js/testing-helpers.js`
- Comandos en consola para probar funcionalidad
- Atajo `th` disponible globalmente

---

## 📱 Cómo probar

### Paso 1: Abrir aplicación

1. Abre `index.html` en tu navegador
2. Abre consola (F12)
3. Escribe: `localStorage.clear()` y recarga

### Paso 2: Crear usuario de prueba

**Ejemplo**: Mujer, 28 años, 75kg, 165cm, sedentaria

- Objetivo: **Perder Peso**
- Experiencia: **Principiante**

### Paso 3: Verificar en consola

Deberías ver:

```
📊 Calorías calculadas:
  - TDEE: 1800 kcal
  - Objetivo: lose
  - Semana: 1
  - Experiencia: Principiante
  - Resultado: 1650 kcal

🎯 PLAN DE PROGRESIÓN:
Semana 1/12 - Déficit suave (-150 kcal)
```

### Paso 4: Revisar plan nutricional

- Ve a "Plan Nutricional"
- Busca las porciones escaladas
- Ejemplo: "Yogur con avena (92% porción): 368g yogur, 46g avena..."

### Paso 5: Probar herramientas de testing

```javascript
// Ver info completa
testHelpers.showUserInfo();
// o usa el atajo:
th.showUserInfo();

// Simular semana 5
th.setWeek(5);

// Ver progresión completa
th.showWeeklyProgression();

// Comparar objetivos
th.compareGoals();
```

---

## 📊 Tabla de Progresión

### PERDER PESO

| Experiencia       | Semana 1-2 | Semana 3-4 | Semana 5-6 | Semana 7-8 | Semana 9+ |
| ----------------- | ---------- | ---------- | ---------- | ---------- | --------- |
| **Principiante**  | -150 kcal  | -250 kcal  | -350 kcal  | -400 kcal  | -450 kcal |
| **Experimentado** | -300 kcal  | -400 kcal  | -500 kcal  | -550 kcal  | -550 kcal |

### GANAR PESO

| Experiencia       | Semana 1-2 | Semana 3-4 | Semana 5-6 | Semana 7-8 | Semana 9+ |
| ----------------- | ---------- | ---------- | ---------- | ---------- | --------- |
| **Principiante**  | +100 kcal  | +200 kcal  | +300 kcal  | +350 kcal  | +400 kcal |
| **Experimentado** | +250 kcal  | +350 kcal  | +450 kcal  | +500 kcal  | +500 kcal |

### MANTENER PESO

**Todas las semanas**: TDEE exacto (sin déficit ni superávit)

---

## 🔍 Comandos de testing disponibles

```javascript
// Ver toda la información del usuario
th.showUserInfo();

// Avanzar a siguiente semana
th.nextWeek();

// Ir a semana específica (1-12)
th.setWeek(5);

// Ver tabla de progresión semanal
th.showWeeklyProgression();

// Comparar perder/mantener/ganar
th.compareGoals();

// Resetear todo
th.reset();

// Ver ayuda
th.help();
```

---

## 📝 Ejemplo de output esperado

### Usuario Principiante - Perder Peso - Semana 1:

```
TDEE: 1800 kcal
Objetivo: -150 kcal
Resultado: 1650 kcal
Porción: ~92%

Ejemplo de comida:
"Pollo al airfryer con boniato y brócoli (92% porción):
 184g pollo, 184g boniato, 184g brócoli, 14ml aceite"
```

### Usuario Experimentado - Ganar Peso - Semana 5:

```
TDEE: 2400 kcal
Objetivo: +450 kcal
Resultado: 2850 kcal
Porción: ~119%

Ejemplo de comida:
"Pollo al airfryer con boniato y brócoli (119% porción):
 238g pollo, 238g boniato, 238g brócoli, 18ml aceite"
```

---

## 🐛 Solución de problemas

### "No veo diferencia en las calorías"

✅ Verifica que el usuario tiene `dietExperience` configurado
✅ Mira la consola para ver el log de cálculo
✅ Compara con diferentes objetivos usando `th.compareGoals()`

### "Las porciones no se escalan"

✅ Busca el texto "(X% porción)" en las descripciones
✅ Si es cercano al 100%, no se muestra el porcentaje
✅ Prueba con semanas más avanzadas: `th.setWeek(8)`

### "Errores en consola"

✅ Haz `localStorage.clear()` y recarga
✅ Crea un usuario nuevo desde cero
✅ Verifica que todos los archivos están cargados

---

## 📂 Archivos modificados

1. **js/core/user-system.js**

   - Añadidos campos: `dietExperience`, `currentWeek`
   - Reescrito: `calculateTargetCalories()` con progresión
   - Nuevos métodos: `updateCurrentWeek()`, `advanceWeek()`, `getPlanDescription()`
   - Actualizado: `toJSON()` para guardar nuevos campos
   - Modificado: `setCurrentUser()` para actualizar semana automáticamente

2. **js/ui/user-interface.js**

   - Añadida captura de campo `dietExperience` en paso 3
   - Actualizado `createUser()` para incluir nuevo campo

3. **js/nutrition/meal-planner.js**

   - Modificado `pickVaried()` para escalar porciones
   - Añadido cálculo de `scaleFactor`, `scaledQty`, `actualKcal`
   - Actualizado `generateDescription()` para mostrar porcentajes
   - Actualizado `buildDay()` para usar calorías escaladas

4. **js/script.js**

   - Añadido log de información de progresión al generar plan

5. **index.html**

   - Añadido paso 3.5: "Experiencia con Dietas"
   - Actualizadas descripciones de objetivos
   - Cargado nuevo script: `testing-helpers.js`

6. **js/testing-helpers.js** (NUEVO)

   - Herramientas de debug y testing en consola
   - Atajo global `th` disponible

7. **TESTING_PROGRESION.md** (NUEVO)
   - Guía completa de testing paso a paso
   - Tablas de referencia
   - Casos de prueba

---

## 🚀 Próximos pasos sugeridos

1. **Notificaciones semanales**

   - Detectar cuando cambia la semana
   - Mostrar: "¡Nueva semana! Tus calorías se ajustan a X kcal"

2. **Progreso visual**

   - Barra de progreso 1-12 semanas
   - Gráfico de evolución de calorías

3. **Ajuste automático**

   - Si el usuario pesa menos/más, recalcular TDEE
   - Ajustar plan automáticamente

4. **Exportar progreso**
   - Descargar CSV con evolución semanal
   - Gráficos de peso vs calorías

---

✅ **Todo implementado y listo para probar**
📖 Lee `TESTING_PROGRESION.md` para guía detallada
🧪 Usa comandos `th.*` en consola para testing rápido
