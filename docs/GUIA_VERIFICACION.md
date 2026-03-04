# 🎯 GUÍA RÁPIDA - VERIFICACIÓN DE CAMBIOS

## ✅ Checklist de Implementación

### 1. Fórmulas Calóricas ✅

- [x] `js/core/user-system.js` actualizado con Harris-Benedict
- [x] Fórmula hombres: `88.362 + (13.397 × peso)...`
- [x] Fórmula mujeres: `447.593 + (9.247 × peso)...`

### 2. Sistema de Envases ✅

- [x] `js/nutrition/package-standards.js` creado
- [x] 25+ ingredientes con estándares definidos
- [x] Funciones `adjustToPackageStandard()` y `getPackageDisplay()`

### 3. Catálogo Actualizado ✅

- [x] 6 desayunos estandarizados
- [x] 8 comidas estandarizadas
- [x] 6 snacks estandarizados
- [x] 8 cenas estandarizadas

### 4. Interfaz Mejorada ✅

- [x] `generateDescription()` usa envases comerciales
- [x] Fallback manual si package-standards no carga
- [x] Descripciones amigables ("2 rebanadas" en vez de "60g")

### 5. HTML Actualizado ✅

- [x] Referencia a `package-standards.js` añadida
- [x] Carga antes de `meal-planner.js`

---

## 🧪 PRUEBAS RÁPIDAS

### Prueba 1: Abrir la Aplicación

```
1. Abre index.html en el navegador
2. Abre consola (F12)
3. Verifica que aparezca: "📦 Sistema de envases estandarizados cargado"
4. Verifica que aparezca: "🍽️ Meal Planner cargado"
```

**Resultado esperado**: Sin errores en consola

---

### Prueba 2: Verificar Estándares

```javascript
// En consola del navegador:
console.table(PACKAGE_STANDARDS);
```

**Resultado esperado**: Tabla con 25+ ingredientes

---

### Prueba 3: Probar Conversiones

```javascript
// En consola:
console.log(getPackageDisplay("pan", 60));
console.log(getPackageDisplay("aceite", 10));
console.log(getPackageDisplay("huevos", 2));
console.log(getPackageDisplay("pollo", 200));
console.log(getPackageDisplay("yogur", 400));
```

**Resultado esperado**:

```
"2 rebanadas (60g)"
"1 cucharada (10ml)"
"2 huevos (L)"
"1 filete grande (200g)"
"1 envase Alpro (400g)"
```

---

### Prueba 4: Crear Usuario y Ver Plan

```
1. Ir a la aplicación
2. Completar registro:
   - Nombre: Test
   - Edad: 30
   - Peso: 80kg
   - Altura: 175cm
   - Género: Hombre
   - Actividad: Moderada
   - Objetivo: Perder peso
   - Experiencia: Principiante
3. Completar preferencias y alérgenos
4. Ir a "Mi Plan Semanal"
5. Ver un día completo
```

**Resultado esperado en descripciones**:

- ✅ "2 rebanadas" en lugar de "60g pan"
- ✅ "1 cucharada" en lugar de "10ml aceite"
- ✅ "2 huevos (L)" en lugar de "2 huevos"
- ✅ "1 filete grande (200g)" en lugar de "200g pollo"

---

### Prueba 5: Verificar Calorías Harris-Benedict

```
Perfil de prueba:
- Hombre, 30 años, 80kg, 175cm, actividad moderada

Cálculo manual Harris-Benedict:
BMR = 88.362 + (13.397 × 80) + (4.799 × 175) - (5.677 × 30)
BMR = 88.362 + 1071.76 + 839.825 - 170.31
BMR ≈ 1829.64 kcal

TDEE = BMR × 1.55 (actividad moderada)
TDEE ≈ 2835 kcal

Perder peso (semana 1-2, principiante):
Target = TDEE - 150
Target ≈ 2685 kcal
```

**Verificar en app**:

1. Crear usuario con estos datos
2. Abrir consola: `th.showUserInfo()`
3. Verificar que `targetCalories` sea ~2685 kcal

---

## 📊 COMPARATIVA VISUAL

### DESAYUNO: Tostadas con aguacate

**ANTES**:

```
Tostadas integrales con aguacate y huevo:
80g pan, 80g aguacate, 2 huevos, 5ml aceite
```

**AHORA**:

```
Tostadas integrales con aguacate y huevo:
2 rebanadas (60g), 1/2 aguacate (100g), 2 huevos (L), 1 cucharadita (5ml)
```

---

### COMIDA: Pollo con boniato

**ANTES**:

```
Pollo al airfryer con boniato y brócoli:
200g pollo, 200g boniato, 200g brocoli, 15ml aceite
```

**AHORA**:

```
Pollo al airfryer con boniato y brócoli:
1 filete grande (200g) pollo, 1 boniato grande (200g), 1 bol (200g) brócoli, 1.5 cucharadas (15ml) aceite
```

---

### CENA: Ensalada con garbanzos

**ANTES**:

```
Ensalada completa con garbanzos y atún:
200g garbanzos, 120g atun, 200g verduras, 1 huevo, 15ml aceite
```

**AHORA**:

```
Ensalada completa con garbanzos y atún:
200g garbanzos secos (~500g cocidos), 1 lata (120g) atún, 200g verduras, 1 huevo (L), 1.5 cucharadas (15ml) aceite
```

---

## 🚨 Posibles Problemas y Soluciones

### Problema 1: "PACKAGE_STANDARDS is not defined"

**Causa**: `package-standards.js` no se cargó
**Solución**:

1. Verificar que `index.html` tiene `<script src="js/nutrition/package-standards.js"></script>`
2. Verificar que está ANTES de `meal-planner.js`
3. Recargar página (Ctrl+F5)

---

### Problema 2: Descripciones siguen mostrando solo gramos

**Causa**: Fallback manual activado
**Solución**:

- Es normal, el sistema tiene fallback
- Verificar en consola: `typeof window.getPackageDisplay`
- Debe ser "function", si es "undefined" hay problema de carga

---

### Problema 3: Calorías muy altas/bajas

**Causa**: Cambio de fórmula Mifflin → Harris-Benedict
**Solución**:

- Es normal, Harris-Benedict da ~10-15% más calorías
- Usuario puede ajustar con sistema de progresión semanal
- Usar `th.setWeek(n)` para probar diferentes semanas

---

## 📝 COMANDOS ÚTILES DE CONSOLA

```javascript
// Ver información completa del usuario
th.showUserInfo();

// Ver tabla de progresión semanal
th.showWeeklyProgression();

// Avanzar a siguiente semana
th.nextWeek();

// Establecer semana específica
th.setWeek(5);

// Ver estándares de un ingrediente
console.log(PACKAGE_STANDARDS.pan);

// Probar conversión de cantidad
adjustToPackageStandard("arroz", 85); // Debería devolver 80 o 100

// Ver display de cantidad
getPackageDisplay("proteina", 30); // "1 scoop (30g)"
```

---

## ✅ VALIDACIÓN FINAL

Marca cada item cuando lo hayas verificado:

- [ ] Aplicación abre sin errores
- [ ] Consola muestra "📦 Sistema de envases estandarizados cargado"
- [ ] PACKAGE_STANDARDS existe en consola
- [ ] getPackageDisplay() funciona correctamente
- [ ] Registro de usuario funciona (7 pasos)
- [ ] Plan semanal se genera correctamente
- [ ] Descripciones muestran cantidades amigables
- [ ] Calorías calculadas con Harris-Benedict
- [ ] Sistema de progresión funciona
- [ ] Comandos `th.*` funcionan en consola

**Si todos los items están marcados: ¡Sistema 100% funcional! 🎉**

---

## 📧 FEEDBACK AL USUARIO

Cuando pruebes el sistema, fíjate en:

1. ¿Las cantidades son más fáciles de entender?
2. ¿Es más sencillo hacer la compra?
3. ¿Las calorías parecen correctas?
4. ¿Hay algún ingrediente con cantidades raras?
5. ¿Falta algún formato de envase común?

---

**Versión**: 3.1  
**Fecha**: Implementación de Sistema de Cantidades Estandarizadas  
**Estado**: ✅ LISTO PARA PRUEBAS
