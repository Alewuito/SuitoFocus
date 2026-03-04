# 📋 Guía de Widgets - SuitoFocus

## ✨ Mejoras Implementadas

### 1. **Sistema de Notificaciones Discreto**

- ✅ Reemplazadas todas las alertas del navegador
- ✅ Notificaciones en la esquina superior derecha
- ✅ Diseño minimalista con iconos visuales
- ✅ Auto-cierre después de 4 segundos
- ✅ Tipos: info (ℹ️), success (✓), error (✗), warning (⚠)

### 2. **Confirmaciones Elegantes**

- ✅ Modal de confirmación personalizado
- ✅ Botones claramente diferenciados (Confirmar/Cancelar)
- ✅ Fondo con blur effect
- ✅ Se cierra al hacer clic fuera

### 3. **Borrado Completo de Widgets**

- ✅ Al eliminar un widget se borran TODOS sus datos
- ✅ Se limpian los inputs/textareas
- ✅ Se elimina del localStorage
- ✅ Se resetea completamente para poder crear nuevos

### 4. **Grid Dinámico Inteligente 3x1**

- ✅ **Grid inicial**: 3 columnas x 1 fila (4 slots)
- ✅ **Posición 1**: Plan del Día (fijo)
- ✅ **Posición 2**: Contador de Agua (fijo)
- ✅ **Posición 3-4**: Espacios libres para widgets opcionales
- ✅ **Crecimiento**: Al añadir más widgets, se agregan filas automáticamente (3x2, 3x3, etc.)
- ✅ Los widgets se pueden arrastrar entre posiciones
- ✅ Las posiciones se guardan automáticamente
- ✅ **Sin límite**: El grid crece infinitamente según necesidad

### 5. **Drag & Drop Funcional**

- ✅ Arrastra widgets entre posiciones
- ✅ Feedback visual al arrastrar (hover effect)
- ✅ Guarda automáticamente la nueva posición
- ✅ Restaura posiciones al recargar la página

### 6. **Interfaz Compacta**

- ✅ Reducida la separación entre widgets y plan nutricional
- ✅ Scroll indicator más discreto
- ✅ Mejor aprovechamiento del espacio vertical

## 🎯 Cómo Usar

### Crear un Widget

1. Haz clic en el botón **+** (abajo del grid)
2. Selecciona el tipo de widget: 💊 Pastillas / ✓ Tareas / 📝 Notas / 🎯 Hábitos
3. El widget aparecerá en la primera posición disponible

### Reposicionar un Widget

1. Haz clic y mantén presionado sobre el widget
2. Arrastra hasta la posición deseada
3. Suelta el widget - se guardará automáticamente

### Eliminar un Widget

1. Haz clic en el botón **×** en la esquina del widget
2. Confirma la eliminación en el modal
3. ⚠️ **Importante**: Se borrarán TODOS los datos del widget

### Usar los Widgets

#### 💊 Pastillas

- Introduce nombre y hora
- Marca como tomada con el checkbox
- Se resetea cada día automáticamente

#### ✓ Tareas

- Escribe la tarea y presiona Enter o +
- Marca como completada (permanece hasta que la elimines)

#### 📝 Notas

- Escribe libremente
- **Auto-guardado** - No necesitas hacer nada

#### 🎯 Hábitos

- Lista de hábitos diarios
- Se resetean cada día automáticamente
- Marca como completados durante el día

## 🎨 Detalles de Diseño

### Notificaciones

```
┌─────────────────────────────────┐
│ ✓ Pastilla añadida correctamente │  ← Auto-cierra en 4s
└─────────────────────────────────┘
```

### Confirmaciones

```
┌─────────────────────────────────────┐
│  ¿Eliminar widget de pastillas?    │
│  Se borrarán todos los datos.      │
│                                     │
│  [Cancelar]     [Confirmar]        │
└─────────────────────────────────────┘
```

### Grid Layout

```
┌──────────┬──────────┬──────────┐
│ Plan Hoy │  Agua    │  Libre   │  ← Fila 1 (inicial 3x1)
├──────────┼──────────┼──────────┤
│  Libre   │ Widget 1 │ Widget 2 │  ← Fila 2 (se crea al añadir widgets)
├──────────┼──────────┼──────────┤
│ Widget 3 │ Widget 4 │ Widget 5 │  ← Fila 3 (se crea al llenar fila 2)
└──────────┴──────────┴──────────┘
         ↓
    (Crece infinitamente)
```

**Distribución:**

- **Grid inicial**: 3 columnas × 1 fila = 4 slots totales
- **Al añadir widget 3**: 3 columnas × 2 filas = 6 slots
- **Al añadir widget 6**: 3 columnas × 3 filas = 9 slots
- Y así sucesivamente...

## 🔧 Características Técnicas

- **LocalStorage**: Persistencia de datos

  - `pillsReminders`: Lista de pastillas
  - `todoList`: Lista de tareas
  - `quickNotes`: Contenido de notas
  - `dailyHabits`: Lista de hábitos
  - `widgetPositions`: Posiciones en el grid

- **Reset Diario**: Pills y Hábitos se resetean cada día
- **Auto-guardado**: Notas se guardan en cada cambio
- **Drag & Drop**: HTML5 Drag and Drop API

## ⚡ Atajos de Teclado

- **Enter** en input de nombre de pastilla → Salta a hora
- **Enter** en input de hora → Añade pastilla
- **Enter** en input de tarea → Añade tarea
- **Enter** en input de hábito → Añade hábito

## 📱 Responsive

El grid se adapta automáticamente:

- **Desktop (>900px)**: 3 columnas (Plan + Agua + 2 libres en fila 1)
- **Tablet (600-900px)**: 2 columnas (se reorganiza automáticamente)
- **Mobile (<600px)**: 1 columna (apilados verticalmente)

## 🔄 Cambios Recientes (v2.2)

### Versión 2.2

- ✅ **Nuevo**: Grid cambiado de 2x2 a **3x1 inicial** (3 columnas, crece verticalmente)
- ✅ **Mejorado**: 4 slots iniciales en lugar de 4 (primera fila completa)
- ✅ **Optimizado**: Crecimiento más eficiente del grid (múltiplos de 3)
- ✅ **Ajustado**: Max-width aumentado a 1200px para acomodar 3 columnas

### Versión 2.1

- ✅ **Arreglado**: Error al crear widgets (ya no dice "widget ya activo" cuando no lo está)
- ✅ **Mejorado**: Detección de widgets activos mediante `data-slot` en vez de `display`
- ✅ **Reducido**: Separación entre widgets y plan nutricional (más compacto)
- ✅ **Optimizado**: Indicador de scroll más discreto y pequeño
- ✅ **Ajustado**: Márgenes y padding para mejor aprovechamiento del espacio

---

**Versión**: 2.2  
**Última actualización**: Octubre 2025
