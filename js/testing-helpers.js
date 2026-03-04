// ===== HERRAMIENTAS DE TESTING Y DEBUG =====
// Cargar en consola para facilitar pruebas del sistema de progresión

window.testHelpers = {
    // Ver información completa del usuario actual
    showUserInfo() {
        const user = window.userInterface?.userManager?.getCurrentUser();
        if (!user) {
            console.error('❌ No hay usuario activo');
            return;
        }
        
        const tdee = user.calculateTDEE();
        const target = user.calculateTargetCalories();
        const diff = target - tdee;
        
        console.log(`
╔══════════════════════════════════════════════════════════════╗
║           INFORMACIÓN DEL USUARIO ACTUAL                      ║
╚══════════════════════════════════════════════════════════════╝

👤 Nombre: ${user.name}
📊 Datos: ${user.age} años, ${user.gender}, ${user.weight}kg, ${user.height}cm
🎯 Objetivo: ${user.goal} (${user.targetWeight ? user.targetWeight + 'kg' : 'no especificado'})
💪 Nivel: ${user.activityLevel}
🍽️ Dieta: ${user.dietType}
📚 Experiencia: ${user.dietExperience || 'beginner'}

📅 PROGRESIÓN:
   Semana actual: ${user.currentWeek || 1}/12
   Fecha creación: ${new Date(user.createdAt).toLocaleDateString()}
   
⚡ METABOLISMO:
   BMR: ${user.calculateBMR()} kcal (metabolismo basal)
   TDEE: ${tdee} kcal (gasto diario total)
   
🎯 PLAN ACTUAL:
   Calorías objetivo: ${target} kcal
   Diferencia TDEE: ${diff > 0 ? '+' : ''}${diff} kcal
   ${user.getPlanDescription ? user.getPlanDescription() : ''}
   
📈 MACROS:
   ${JSON.stringify(user.calculateMacros(), null, 2)}
        `);
        
        return user;
    },
    
    // Avanzar a la siguiente semana
    nextWeek() {
        const user = window.userInterface?.userManager?.getCurrentUser();
        if (!user) {
            console.error('❌ No hay usuario activo');
            return;
        }
        
        const oldWeek = user.currentWeek || 1;
        user.advanceWeek();
        const newWeek = user.currentWeek;
        
        window.userInterface.userManager.saveUsers();
        
        console.log(`✅ Avanzado de semana ${oldWeek} → ${newWeek}`);
        console.log('🔄 Regenerando plan nutricional...');
        
        window.regenerateDietPlan(true);
        
        setTimeout(() => this.showUserInfo(), 1000);
    },
    
    // Simular paso de tiempo (cambiar semana manualmente)
    setWeek(weekNumber) {
        const user = window.userInterface?.userManager?.getCurrentUser();
        if (!user) {
            console.error('❌ No hay usuario activo');
            return;
        }
        
        if (weekNumber < 1 || weekNumber > 12) {
            console.error('❌ La semana debe estar entre 1 y 12');
            return;
        }
        
        const oldWeek = user.currentWeek || 1;
        user.currentWeek = weekNumber;
        user.lastUpdated = new Date().toISOString();
        
        window.userInterface.userManager.saveUsers();
        
        console.log(`✅ Cambiado de semana ${oldWeek} → ${weekNumber}`);
        console.log('🔄 Regenerando plan nutricional...');
        
        window.regenerateDietPlan(true);
        
        setTimeout(() => this.showUserInfo(), 1000);
    },
    
    // Ver evolución de calorías por semanas
    showWeeklyProgression() {
        const user = window.userInterface?.userManager?.getCurrentUser();
        if (!user) {
            console.error('❌ No hay usuario activo');
            return;
        }
        
        const tdee = user.calculateTDEE();
        const originalWeek = user.currentWeek;
        const isExperienced = user.dietExperience === 'experienced';
        
        console.log(`
╔══════════════════════════════════════════════════════════════╗
║        PROGRESIÓN SEMANAL - ${user.name}                     ║
║        ${user.goal.toUpperCase()} | ${isExperienced ? 'EXPERIMENTADO' : 'PRINCIPIANTE'}                      ║
╚══════════════════════════════════════════════════════════════╝

TDEE Base: ${tdee} kcal
        `);
        
        console.table([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(week => {
            user.currentWeek = week;
            const target = user.calculateTargetCalories();
            const diff = target - tdee;
            const portion = Math.round((target / tdee) * 100);
            
            return {
                'Semana': week,
                'Calorías': target + ' kcal',
                'vs TDEE': (diff > 0 ? '+' : '') + diff + ' kcal',
                'Porción': portion + '%'
            };
        }));
        
        // Restaurar semana original
        user.currentWeek = originalWeek;
    },
    
    // Comparar 3 objetivos (mantener, perder, ganar)
    compareGoals() {
        const user = window.userInterface?.userManager?.getCurrentUser();
        if (!user) {
            console.error('❌ No hay usuario activo');
            return;
        }
        
        const tdee = user.calculateTDEE();
        const originalGoal = user.goal;
        const week = user.currentWeek || 1;
        
        console.log(`
╔══════════════════════════════════════════════════════════════╗
║        COMPARACIÓN DE OBJETIVOS (Semana ${week})              ║
╚══════════════════════════════════════════════════════════════╝

TDEE Base: ${tdee} kcal
        `);
        
        const results = [];
        
        ['lose', 'maintain', 'gain'].forEach(goal => {
            user.goal = goal;
            const target = user.calculateTargetCalories();
            const diff = target - tdee;
            const portion = Math.round((target / tdee) * 100);
            
            results.push({
                'Objetivo': goal === 'lose' ? '📉 Perder' : goal === 'gain' ? '📈 Ganar' : '➡️ Mantener',
                'Calorías': target + ' kcal',
                'vs TDEE': (diff > 0 ? '+' : '') + diff + ' kcal',
                'Porción': portion + '%'
            });
        });
        
        console.table(results);
        
        // Restaurar objetivo original
        user.goal = originalGoal;
    },
    
    // Reset completo
    reset() {
        if (confirm('⚠️ Esto borrará TODOS los datos. ¿Continuar?')) {
            localStorage.clear();
            console.log('✅ Datos borrados. Recargando...');
            location.reload();
        }
    },
    
    // Mostrar ayuda
    help() {
        console.log(`
╔══════════════════════════════════════════════════════════════╗
║              HERRAMIENTAS DE TESTING                          ║
╚══════════════════════════════════════════════════════════════╝

Comandos disponibles:

📊 testHelpers.showUserInfo()
   → Muestra información completa del usuario actual

⏭️ testHelpers.nextWeek()
   → Avanza a la siguiente semana y regenera plan

📅 testHelpers.setWeek(5)
   → Cambia a una semana específica (1-12)

📈 testHelpers.showWeeklyProgression()
   → Muestra tabla de progresión por semanas

⚖️ testHelpers.compareGoals()
   → Compara calorías entre perder/mantener/ganar

🔄 testHelpers.reset()
   → Borra todos los datos y recarga

❓ testHelpers.help()
   → Muestra esta ayuda

═══════════════════════════════════════════════════════════════

Ejemplos de uso:

// Ver información del usuario
testHelpers.showUserInfo()

// Simular 4 semanas de progreso
testHelpers.setWeek(4)

// Ver cómo cambian las calorías semanalmente
testHelpers.showWeeklyProgression()

// Comparar objetivos
testHelpers.compareGoals()
        `);
    }
};

// Mostrar mensaje de bienvenida
console.log(`
🧪 Herramientas de testing cargadas!
Escribe testHelpers.help() para ver comandos disponibles
`);

// Exportar también como variable global para facilitar acceso
window.th = window.testHelpers;
console.log('💡 Atajo disponible: th (equivalente a testHelpers)');
console.log('   Ejemplo: th.showUserInfo()');
