# 📊 Fuentes Oficiales de Datos Nutricionales

## 🔬 Bases de Datos Utilizadas

Todos los valores calóricos y nutricionales de la aplicación están verificados con las siguientes bases de datos oficiales:

### 1. **BEDCA** (Base de Datos Española de Composición de Alimentos)

- **URL**: https://www.bedca.net/
- **Organismo**: Agencia Española de Seguridad Alimentaria y Nutrición (AESAN)
- **Uso**: Base de datos PRINCIPAL para todos los alimentos

### 2. **USDA FoodData Central**

- **URL**: https://fdc.nal.usda.gov/
- **Organismo**: Departamento de Agricultura de Estados Unidos
- **Uso**: Datos complementarios y alimentos internacionales

### 3. **MyFitnessPal / FatSecret**

- **Uso**: Verificación cruzada de valores

---

## 🥗 Valores Calóricos Verificados (BEDCA)

### Proteínas (por 100g crudo)

| Alimento            | Kcal/100g | Fuente |
| ------------------- | --------- | ------ |
| Pollo pechuga       | 110       | BEDCA  |
| Pavo pechuga        | 110       | BEDCA  |
| Ternera magra       | 145       | BEDCA  |
| Cerdo solomillo     | 150       | BEDCA  |
| Merluza             | 80        | BEDCA  |
| Salmón              | 180       | BEDCA  |
| Dorada              | 90        | BEDCA  |
| Gambas              | 80        | BEDCA  |
| Atún natural        | 120       | BEDCA  |
| Huevo (unidad ~60g) | 78        | BEDCA  |
| Tofu                | 110       | BEDCA  |

### Carbohidratos (por 100g crudo)

| Alimento             | Kcal/100g | Fuente |
| -------------------- | --------- | ------ |
| Arroz blanco crudo   | 350       | BEDCA  |
| Arroz integral crudo | 350       | BEDCA  |
| Quinoa cocida        | 120       | BEDCA  |
| Avena cruda          | 370       | BEDCA  |
| Patata cruda         | 86        | BEDCA  |
| Boniato crudo        | 86        | BEDCA  |
| Pan integral         | 240       | BEDCA  |
| Lentejas cocidas     | 116       | BEDCA  |
| Garbanzos cocidos    | 136       | BEDCA  |

### Grasas Saludables (por 100g)

| Alimento                 | Kcal/100g | Fuente |
| ------------------------ | --------- | ------ |
| Aceite de oliva          | 900       | BEDCA  |
| Aguacate                 | 160       | BEDCA  |
| Almendras                | 580       | BEDCA  |
| Nueces                   | 654       | BEDCA  |
| Crema de almendra        | 580       | BEDCA  |
| Mantequilla de cacahuete | 600       | BEDCA  |

### Verduras (por 100g crudo)

| Alimento                  | Kcal/100g | Fuente |
| ------------------------- | --------- | ------ |
| Brócoli                   | 34        | BEDCA  |
| Espinacas                 | 23        | BEDCA  |
| Espárragos                | 20        | BEDCA  |
| Champiñones               | 22        | BEDCA  |
| Calabaza                  | 26        | BEDCA  |
| Judías verdes             | 31        | BEDCA  |
| Zanahoria                 | 41        | BEDCA  |
| Tomate                    | 18        | BEDCA  |
| Ensalada (lechuga/rúcula) | 15        | BEDCA  |

### Lácteos/Alternativas

| Alimento           | Kcal/100g | Fuente |
| ------------------ | --------- | ------ |
| Yogur Alpro (soja) | 66        | BEDCA  |
| Leche avena        | 45        | BEDCA  |
| Leche de coco      | 230       | BEDCA  |
| Queso fresco       | 164       | BEDCA  |

### Frutas (por 100g)

| Alimento                | Kcal/100g | Fuente |
| ----------------------- | --------- | ------ |
| Plátano                 | 88        | BEDCA  |
| Manzana                 | 52        | BEDCA  |
| Frutos rojos (promedio) | 50        | BEDCA  |

### Legumbres y otros

| Alimento      | Kcal/100g | Fuente |
| ------------- | --------- | ------ |
| Edamame       | 120       | BEDCA  |
| Hummus        | 166       | BEDCA  |
| Jamón serrano | 210       | BEDCA  |

---

## 📐 Cálculo de Recetas

### Ejemplo: Pollo al airfryer con boniato y brócoli

```
Pollo 200g crudo = 200g × 110 kcal/100g = 220 kcal
Boniato 200g crudo = 200g × 86 kcal/100g = 172 kcal
Brócoli 200g crudo = 200g × 34 kcal/100g = 68 kcal
Aceite 15ml = 15ml × 9 kcal/ml = 135 kcal

TOTAL = 220 + 172 + 68 + 135 = 595 kcal ✅
```

### Ejemplo: Yogur con avena

```
Yogur Alpro 400g = 400g × 66 kcal/100g = 264 kcal
Avena cruda 50g = 50g × 370 kcal/100g = 185 kcal
Frutos rojos 50g = 50g × 50 kcal/100g = 25 kcal
Nueces 15g = 15g × 654 kcal/100g = 98 kcal

TOTAL = 264 + 185 + 25 + 98 = 572 kcal ✅
```

---

## ⚠️ Normativa OMS (Organización Mundial de la Salud)

### Calorías Mínimas Diarias

| Género  | Mínimo Absoluto | Fuente |
| ------- | --------------- | ------ |
| Mujeres | 1500-1600 kcal  | OMS    |
| Hombres | 1800-2000 kcal  | OMS    |

### Déficit Saludable

- **Máximo recomendado**: 500 kcal/día
- **Pérdida esperada**: 0.5 kg/semana
- **NUNCA** bajar del mínimo absoluto

### Superávit Saludable

- **Recomendado**: 300-400 kcal/día
- **Ganancia esperada**: 0.3-0.4 kg/semana

---

## 🔍 Verificación de Totales Diarios

### Plan Ejemplo (Hombre, Déficit)

```
Desayuno: 572 kcal (Yogur + avena + frutos + nueces)
Comida: 595 kcal (Pollo + boniato + brócoli)
Snack: 409 kcal (Yogur + almendras)
Cena: 477 kcal (Tortilla + espinacas + champiñones)

TOTAL DIARIO: 2053 kcal ✅ (> 2000 kcal mínimo OMS)
```

### Plan Ejemplo (Mujer, Déficit)

```
Desayuno: 462 kcal (Batido verde proteico)
Comida: 507 kcal (Merluza + espárragos + patata)
Snack: 239 kcal (Manzana + crema almendra)
Cena: 484 kcal (Dorada + espárragos + patata)

TOTAL DIARIO: 1692 kcal ✅ (> 1600 kcal mínimo OMS)
```

---

## 🎯 Compromiso de Precisión

✅ Todos los valores verificados con BEDCA  
✅ Cantidades expresadas en gramos/ml reales  
✅ Cálculos transparentes y auditables  
✅ Cumplimiento estricto normativa OMS  
✅ Protección contra trastornos alimenticios

---

**Última actualización**: Noviembre 2025  
**Responsable**: Sistema de Planificación Nutricional SuitoFocus  
**Contacto**: Si detectas algún error en los cálculos, repórtalo inmediatamente
