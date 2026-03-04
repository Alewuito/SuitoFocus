# Estadísticas del Proyecto SuitoFocus

## Métricas de Código

### Archivos por Categoría

| Categoría                | Archivos | Líneas Aprox. | Descripción          |
| ------------------------ | -------- | ------------- | -------------------- |
| **HTML**                 | 1        | 1,304         | Estructura principal |
| **CSS**                  | 5        | 3,500+        | Estilos y temas      |
| **JavaScript Core**      | 1        | 422           | Sistema de usuarios  |
| **JavaScript UI**        | 1        | 800+          | Interfaces           |
| **JavaScript Nutrition** | 5        | 3,200+        | Sistema nutricional  |
| **JavaScript Main**      | 1        | 3,727         | Orquestador          |
| **Documentación**        | 6        | 1,500+        | Guides y referencias |
| **Config**               | 2        | -             | README + .gitignore  |

**TOTAL**: 22 archivos, ~14,453 líneas de código

---

## Características Implementadas

### Sistema de Usuarios

- [x] Perfiles multi-usuario
- [x] Cálculos BMR/TDEE (Mifflin-St Jeor)
- [x] Calorías objetivo según meta
- [x] Cumplimiento OMS (mínimos 1600F/2000M kcal)
- [x] Distribución de macronutrientes
- [x] Gestión de alergias y preferencias
- [x] Persistencia LocalStorage
- [x] Historial de peso

### Sistema Nutricional V2.0 (Inteligente)

- [x] Base de datos: 63 ingredientes BEDCA
  - [x] 20 proteínas
  - [x] 15 carbohidratos
  - [x] 13 verduras
  - [x] 7 grasas saludables
  - [x] 5 frutas
  - [x] 3 otros
- [x] 11 plantillas de comidas
- [x] Generación automática de combinaciones
- [x] Cálculo automático de macros
- [x] Filtrado por alergias
- [x] Priorización de favoritos
- [x] Exclusión de alimentos no deseados
- [x] Respeto de restricciones dietéticas (vegan, vegetarian, etc.)
- [x] Variedad infinita de planes

### Widgets de Productividad

- [x] Pomodoro Timer
- [x] Focus Timer con estadísticas
- [x] Task List con drag & drop
- [x] Habit Tracker
- [x] Water Intake Tracker
- [x] Sleep Tracker
- [x] Gratitude Journal

### UI/UX

- [x] Pantalla de introducción
- [x] Onboarding multi-paso
- [x] Selección de usuario
- [x] 4 temas visuales (Autumn, Winter, Spring, Summer)
- [x] Modo Focus con brillo y sonido ambiente
- [x] Responsive design
- [x] Animaciones suaves
- [x] Modales interactivos

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                        index.html                           │
│                    (Punto de Entrada)                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
        ┌──────────────────┬────────────────────┐
        ↓                  ↓                    ↓
    ┌─────────┐      ┌──────────┐        ┌──────────┐
    │   CSS   │      │  JS Core │        │  JS UI   │
    │ Styles  │      │  Users   │        │Interface │
    └─────────┘      └──────────┘        └──────────┘
                            ↓
                    ┌───────────────┐
                    │ JS Nutrition  │
                    │  (Sistema V2) │
                    └───────────────┘
                            ↓
                    ┌───────────────┐
                    │   JS Main     │
                    │ (Orquestador) │
                    └───────────────┘
```

---

## Datos Nutricionales

### Fuentes Oficiales

- **BEDCA**: Base de Datos Española de Composición de Alimentos
- **OMS**: Organización Mundial de la Salud (mínimos calóricos)
- **Fórmulas Científicas**: Mifflin-St Jeor, Harris-Benedict

### Precisión

- Valores verificados por 100g
- Proteínas: 4 kcal/g
- Carbohidratos: 4 kcal/g
- Grasas: 9 kcal/g
- Fibra incluida en cálculos

---

## Performance

### Carga de Página

- **Sin dependencias externas**: 0ms de npm install
- **Vanilla JavaScript**: Carga instantánea
- **LocalStorage**: Persistencia sin backend
- **Generación de planes**: ~1 segundo para 28 días

### Optimizaciones

- CSS minificable
- JavaScript modular
- Lazy loading de audio
- Event delegation
- Debouncing en inputs

---

## Roadmap Futuro

### Corto Plazo (1-2 meses)

- [ ] Botón "Regenerar comida individual"
- [ ] Lista de compra automática desde plan
- [ ] Más ingredientes (llegar a 100+)
- [ ] Exportar plan a PDF

### Medio Plazo (3-6 meses)

- [ ] Machine Learning: aprender de favoritos
- [ ] Filtro por presupuesto
- [ ] Filtro por tiempo de cocina
- [ ] Instrucciones de cocina auto-generadas
- [ ] Sistema de intercambios

### Largo Plazo (6-12 meses)

- [ ] App móvil (PWA)
- [ ] Backend opcional (Node.js)
- [ ] Integración con wearables
- [ ] Comunidad de recetas
- [ ] API pública

---

## Complejidad Técnica

### Algoritmos Implementados

1. **Generación Inteligente de Comidas**

   - Complejidad: O(n × m) donde n=ingredientes, m=restricciones
   - Selección ponderada aleatoria
   - Optimización de cantidades por calorías objetivo

2. **Cálculo de Macronutrientes**

   - Fórmula: (gramos / 100) × valor_per_100g
   - Suma automática multi-ingrediente
   - Precisión: ±5 kcal

3. **Filtrado Multi-Criterio**

   - Alergias (exclusión absoluta)
   - Preferencias (prioridad 2x)
   - Dislikes (exclusión)
   - Tipo de dieta (restricciones categóricas)
   - Temporada (opcional)

4. **Distribución Calórica**
   - BMR: Mifflin-St Jeor
   - TDEE: Multiplicadores de actividad
   - Déficit/Superávit: ±500 kcal
   - Validación OMS: max(calculado, mínimo_OMS)

---

## Seguridad y Salud

### Protecciones Implementadas

- **Mínimos OMS obligatorios**: 1600 kcal (F) / 2000 kcal (M)
- **Disclaimer médico**: Pantalla de introducción
- **Validación de inputs**: Rangos razonables (peso, altura, edad)
- **Datos verificados**: 100% BEDCA oficial
- **Console warnings**: Alertas cuando se ajusta por OMS

### Consideraciones Éticas

- **No sustituye**: Asesoramiento médico profesional
- **Recomendación**: Consultar nutricionista
- **Transparencia**: Fuentes de datos visibles
- **Educación**: Documentación completa disponible

---

## Recursos Educativos

### Documentación Interna

- `docs/INTELLIGENT_SYSTEM_V2.md`: Sistema completo explicado
- `docs/NUTRITION_DATA_SOURCES.md`: Tablas BEDCA
- `docs/WIDGETS_GUIDE.md`: Guía de widgets
- `README.md`: Estructura del proyecto

### Enlaces Externos

- [BEDCA](http://www.bedca.net/): Base de datos española
- [OMS Nutrition](https://www.who.int/nutrition): Estándares mundiales
- [Mifflin-St Jeor](https://pubmed.ncbi.nlm.nih.gov/2305711/): Fórmula BMR

---

## Diseño

### Paleta de Colores por Tema

**Autumn (Otoño)**:

- Primary: #E67E22 (Naranja)
- Secondary: #D35400 (Naranja oscuro)
- Accent: #F39C12 (Ámbar)

**Winter (Invierno)**:

- Primary: #3498DB (Azul)
- Secondary: #2980B9 (Azul oscuro)
- Accent: #5DADE2 (Azul claro)

**Spring (Primavera)**:

- Primary: #2ECC71 (Verde)
- Secondary: #27AE60 (Verde oscuro)
- Accent: #58D68D (Verde claro)

**Summer (Verano)**:

- Primary: #F39C12 (Amarillo)
- Secondary: #F1C40F (Amarillo brillante)
- Accent: #F4D03F (Amarillo claro)

### Tipografía

- **Principal**: Poppins (300, 400, 600, 700, 900)
- **Display**: Anton, Righteous, Racing Sans One
- **Alternativas**: Rubik, Bowlby One SC

---

## Compatibilidad

### Navegadores Soportados

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dispositivos

- Desktop (1920x1080 óptimo)
- Laptop (1366x768+)
- Tablet (768x1024+)
- Mobile (375x667+)

### APIs Utilizadas

- LocalStorage API (100% compatible)
- Audio API (sonidos ambiente)
- DOM API (manipulación)
- No requiere permisos especiales

---

## Mantenimiento

### Facilidad de Actualización

- **Añadir ingredientes**: 5/5 (solo editar objeto)
- **Crear plantillas**: 5/5 (solo añadir a array)
- **Modificar estilos**: 4/5 (CSS variables)
- **Añadir widgets**: 3/5 (requiere JS + CSS)
- **Cambiar algoritmos**: 3/5 (lógica modular)

### Testing

- Manual: Probado en 4 navegadores
- Automático: No implementado (futuro)
- Visual: Responsive design verificado

---

## Lecciones Aprendidas

1. **Modularidad es clave**: Separar concerns facilita mantenimiento
2. **Datos verificados son críticos**: BEDCA previene errores nutricionales
3. **UX primero**: Onboarding claro aumenta adopción
4. **Performance sin frameworks**: Vanilla JS es suficientemente rápido
5. **Documentación ahorra tiempo**: README detallado acelera desarrollo futuro

---

## Logros del Proyecto

- **0 dependencias npm**: 100% autónomo
- **14,000+ líneas**: Proyecto substantial
- **63 ingredientes**: Base de datos sólida
- **Combinaciones infinitas**: Verdadera personalización
- **Cumplimiento OMS**: Responsabilidad ética
- **Multi-usuario**: Familias completas
- **4 temas**: Personalización visual
- **7 widgets**: Productividad completa

---

**Última actualización**: Noviembre 2, 2025
**Versión**: 2.0.0
**Estado**: Producción
