# 🧪 GUÍA DE TESTING - Sistema de Progresión Gradual

## 📋 Preparación

1. **Abrir la aplicación** en tu navegador:

   - Abre `index.html` en Chrome/Edge
   - Abre la consola del navegador (F12)

2. **Limpiar datos antiguos**:
   ```javascript
   localStorage.clear();
   location.reload();
   ```

---

## 🧑 TEST 1: Usuario PRINCIPIANTE que quiere PERDER PESO

### Paso 1: Crear Usuario

- **Nombre**: "Ana Pérez"
- **Edad**: 28
- **Sexo**: Mujer
- **Peso**: 75 kg
- **Altura**: 165 cm
- **Peso objetivo**: 65 kg
- **Nivel de actividad**: Sedentario
- **Objetivo**: **Perder Peso**
- **Experiencia con dietas**: **🌱 Primera vez / Principiante**
- **Tipo de dieta**: Balanceada

### ✅ Resultados Esperados (Semana 1):

```
📊 Calorías calculadas:
  - TDEE: ~1800 kcal
  - Objetivo: lose
  - Semana: 1
  - Experiencia: Principiante
  - Resultado: ~1650 kcal (-150 kcal)

🎯 PLAN DE PROGRESIÓN:
Semana 1/12 - Déficit suave (-150 kcal)
```

### 📝 Verificar en el Plan:

- Las porciones deben ser **ligeramente menores** (escalado ~92%)
- Ejemplo: "Pollo con arroz (92% porción): 184g pollo, 92g arroz..."
- Total diario: ~1650 kcal

---

## 💪 TEST 2: Usuario EXPERIMENTADO que quiere GANAR PESO

### Paso 2: Crear Segundo Usuario

- **Nombre**: "Carlos Ruiz"
- **Edad**: 25
- **Sexo**: Hombre
- **Peso**: 70 kg
- **Altura**: 178 cm
- **Peso objetivo**: 80 kg
- **Nivel de actividad**: Moderado
- **Objetivo**: **Ganar Peso**
- **Experiencia con dietas**: **💪 Experimentado**
- **Tipo de dieta**: Alta en Proteína

### ✅ Resultados Esperados (Semana 1):

```
📊 Calorías calculadas:
  - TDEE: ~2400 kcal
  - Objetivo: gain
  - Semana: 1
  - Experiencia: Experimentado
  - Resultado: ~2650 kcal (+250 kcal)

🎯 PLAN DE PROGRESIÓN:
Semana 1/12 - Superávit moderado (+250 kcal)
```

### 📝 Verificar en el Plan:

- Las porciones deben ser **ligeramente mayores** (escalado ~110%)
- Ejemplo: "Pollo con arroz (110% porción): 220g pollo, 110g arroz..."
- Total diario: ~2650 kcal

---

## 🔄 TEST 3: Progresión Semanal (Simulación)

### Avanzar a Semana 3 (Principiante - Perder Peso):

```javascript
// En la consola del navegador
let user = window.userInterface.userManager.getCurrentUser();
console.log("Semana actual:", user.currentWeek);

// Avanzar a semana 3
user.currentWeek = 3;
window.userInterface.userManager.saveUsers();

// Regenerar plan
window.regenerateDietPlan(true);
```

### ✅ Resultado Esperado:

```
📊 Calorías calculadas:
  - Resultado: ~1550 kcal (-250 kcal)

🎯 PLAN DE PROGRESIÓN:
Semana 3/12 - Déficit moderado (-250 kcal)
```

### Verificar:

- Las porciones ahora son **MÁS PEQUEÑAS** que en semana 1
- Escalado: ~86% en lugar de 92%

---

## 🎯 TEST 4: Verificar Diferencias entre Objetivos

### Comparar 3 usuarios con mismo perfil:

| Usuario | Objetivo | Experiencia   | Semana 1  | Diferencia TDEE |
| ------- | -------- | ------------- | --------- | --------------- |
| Ana     | Perder   | Principiante  | -150 kcal | Porciones 92%   |
| Marta   | Mantener | -             | 0 kcal    | Porciones 100%  |
| Carlos  | Ganar    | Experimentado | +250 kcal | Porciones 110%  |

### Verificar en las recetas:

- **Ana**: "Yogur con avena (92% porción): 368g yogur, 46g avena..."
- **Marta**: "Yogur con avena: 400g yogur, 50g avena..."
- **Carlos**: "Yogur con avena (110% porción): 440g yogur, 55g avena..."

---

## 🐛 Errores Comunes

### 1. "currentWeek no está definido"

**Solución**: Borra localStorage y crea usuario nuevo

```javascript
localStorage.clear();
location.reload();
```

### 2. "Las calorías son muy altas"

**Verificar**:

- ¿Pusiste nivel de actividad muy alto? (Usa "Sedentario" o "Ligero")
- ¿El TDEE está calculado correctamente? (Ver consola)

### 3. "No veo diferencia en las porciones"

**Verificar**:

- Mira el log en consola que dice `"Semana X/12 - Déficit/Superávit..."`
- Busca el texto "(X% porción)" en las descripciones de comidas
- Si no aparece, el escalado es cercano al 100%

---

## 📊 Tabla de Progresión Completa

### PERDER PESO - Principiante:

| Semana | Déficit | Calorías (TDEE 1800) | Porción aprox. |
| ------ | ------- | -------------------- | -------------- |
| 1-2    | -150    | 1650                 | 92%            |
| 3-4    | -250    | 1550                 | 86%            |
| 5-6    | -350    | 1450                 | 81%            |
| 7-8    | -400    | 1400                 | 78%            |
| 9+     | -450    | 1350                 | 75%            |

### GANAR PESO - Experimentado:

| Semana | Superávit | Calorías (TDEE 2400) | Porción aprox. |
| ------ | --------- | -------------------- | -------------- |
| 1-2    | +250      | 2650                 | 110%           |
| 3-4    | +350      | 2750                 | 115%           |
| 5-6    | +450      | 2850                 | 119%           |
| 7+     | +500      | 2900                 | 121%           |

---

## ✅ Checklist de Verificación

- [ ] Usuario principiante perder peso → calorías ~TDEE-150 (semana 1)
- [ ] Usuario experimentado ganar peso → calorías ~TDEE+250 (semana 1)
- [ ] Usuario mantener peso → calorías = TDEE exacto
- [ ] Las porciones se escalan correctamente (ver % en descripción)
- [ ] Al avanzar semanas, las calorías cambian progresivamente
- [ ] El log en consola muestra "Semana X/12 - Déficit/Superávit..."
- [ ] No hay errores en consola al crear usuario

---

## 🎓 Explicación Técnica

### ¿Cómo funciona?

1. **Al crear usuario**: Se guarda `dietExperience` y `currentWeek = 1`
2. **Al iniciar sesión**: Se calcula automáticamente la semana según fecha de creación
3. **Al calcular calorías**:
   - Lee `goal` (lose/gain/maintain)
   - Lee `dietExperience` (beginner/experienced)
   - Lee `currentWeek` (1-12)
   - Aplica fórmula progresiva según tabla
4. **Al generar plan**:
   - Calcula TDEE (metabolismo base × actividad)
   - Aplica déficit/superávit según semana
   - Escala porciones de recetas (0.6x a 1.8x)
   - Muestra cantidades ajustadas

### Archivos modificados:

- `js/core/user-system.js` - Lógica de cálculo progresivo
- `js/ui/user-interface.js` - Captura de campo "experiencia"
- `js/nutrition/meal-planner.js` - Escalado de porciones
- `index.html` - Formulario con nuevo campo

---

## 🚀 Próximos Pasos

Una vez verificado que funciona:

1. **Simular paso del tiempo**:

   - Cambiar `user.createdAt` a 14 días atrás → debe mostrar semana 3
   - Cambiar a 60 días atrás → debe mostrar semana 9+

2. **Avance manual** (botón en UI futuro):

   ```javascript
   user.advanceWeek();
   window.regenerateDietPlan(true);
   ```

3. **Notificaciones semanales**:
   - "¡Nueva semana! Tus calorías se ajustan a 1550 kcal"
   - "Progreso: Has completado 4/12 semanas del plan"

---

¡Prueba y me cuentas qué tal funciona! 🎉
