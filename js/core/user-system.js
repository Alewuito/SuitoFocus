// ===== SISTEMA DE GESTIÓN DE USUARIOS =====

class UserProfile {
    constructor(data) {
        this.id = data.id || Date.now().toString();
        this.name = data.name;
        this.age = data.age;
        this.gender = data.gender; // 'male', 'female', 'other'
        this.weight = data.weight; // kg
        this.height = data.height; // cm
        this.targetWeight = data.targetWeight || null; // kg objetivo
        this.targetDate = data.targetDate || null; // fecha objetivo
        this.activityLevel = data.activityLevel; // 'sedentary', 'light', 'moderate', 'active', 'very_active'
        this.goal = data.goal; // 'maintain', 'lose', 'gain'
        this.allergens = data.allergens || []; // Array de alergenos
        this.foodPreferences = data.foodPreferences || []; // Alimentos preferidos
        this.dislikedFoods = data.dislikedFoods || []; // Alimentos no deseados
        this.dietType = data.dietType || 'balanced'; // 'balanced', 'low_carb', 'high_protein', 'vegetarian', 'vegan'
        this.dietExperience = data.dietExperience || 'beginner'; // 'beginner', 'experienced'
        this.currentWeek = data.currentWeek || 1; // Semana actual del plan (1-12)
        
        // Nuevos campos
        this.cookingTime = data.cookingTime || 'moderate'; // 'quick', 'moderate', 'elaborate'
        this.supplements = data.supplements || []; // Array de suplementos: ['protein', 'creatine', 'omega3', etc.]
        this.hasAirfryer = data.hasAirfryer || false; // Boolean: si tiene freidora de aire
        
        this.createdAt = data.createdAt || new Date().toISOString();
        this.lastUpdated = new Date().toISOString();
        
        // Historial de peso y progreso
        this.weightHistory = data.weightHistory || [{
            date: new Date().toISOString().split('T')[0],
            weight: this.weight
        }];
        
        this.mealHistory = data.mealHistory || []; // Historial de comidas completadas
    }

    // Calcular TMB (Tasa Metabólica Basal) usando fórmula Mifflin-St Jeor (más precisa)
    calculateBMR() {
        let bmr;
        if (this.gender === 'male') {
            // Mifflin-St Jeor para hombres: (10 × peso) + (6.25 × altura) - (5 × edad) + 5
            bmr = (10 * this.weight) + (6.25 * this.height) - (5 * this.age) + 5;
        } else if (this.gender === 'female') {
            // Mifflin-St Jeor para mujeres: (10 × peso) + (6.25 × altura) - (5 × edad) - 161
            bmr = (10 * this.weight) + (6.25 * this.height) - (5 * this.age) - 161;
        } else {
            // Promedio para 'other'
            const maleBMR = (10 * this.weight) + (6.25 * this.height) - (5 * this.age) + 5;
            const femaleBMR = (10 * this.weight) + (6.25 * this.height) - (5 * this.age) - 161;
            bmr = (maleBMR + femaleBMR) / 2;
        }
        return Math.round(bmr);
    }

    // Calcular TDEE (Gasto Energético Diario Total)
    calculateTDEE() {
        const bmr = this.calculateBMR();
        // Multiplicadores AJUSTADOS para ser más conservadores y realistas
        const activityMultipliers = {
            sedentary: 1.15,     // Poco o ningún ejercicio (trabajo de oficina, sentado todo el día)
            light: 1.25,         // Ejercicio ligero 1-2 días/semana (paseos, actividad mínima)
            moderate: 1.4,       // Ejercicio moderado 3-4 días/semana (gimnasio regular)
            active: 1.55,        // Ejercicio intenso 5-6 días/semana (deportista activo)
            very_active: 1.7     // Ejercicio muy intenso diario + trabajo físico (atleta)
        };
        return Math.round(bmr * (activityMultipliers[this.activityLevel] || 1.15));
    }

    // Calcular calorías objetivo según meta CON PROGRESIÓN GRADUAL
    calculateTargetCalories() {
        const tdee = this.calculateTDEE();
        let targetCalories;

        // MÍNIMOS ABSOLUTOS según OMS
        const MIN_CALORIES_FEMALE = 1400; // Mínimo seguro para mujeres
        const MIN_CALORIES_MALE = 1600;   // Mínimo seguro para hombres
        const minCalories = this.gender === 'female' ? MIN_CALORIES_FEMALE : MIN_CALORIES_MALE;

        // PROGRESIÓN SEGÚN EXPERIENCIA Y SEMANA
        const week = this.currentWeek || 1;
        const isExperienced = this.dietExperience === 'experienced';
        
        // FACTOR DE AJUSTE según peso (para personas con sobrepeso, déficit más agresivo)
        const weightFactor = this.weight > 90 ? 1.3 : (this.weight > 80 ? 1.15 : 1.0);
        
        switch (this.goal) {
            case 'lose':
                // PÉRDIDA DE PESO: Progresión gradual para evitar rebote
                let weeklyDeficit;
                
                if (isExperienced) {
                    // Experimentado: Déficit más agresivo desde el inicio
                    // Semana 1-2: -300 kcal (base)
                    // Semana 3-4: -400 kcal
                    // Semana 5-6: -500 kcal
                    // Semana 7+: -600 kcal (máximo)
                    if (week <= 2) weeklyDeficit = 300;
                    else if (week <= 4) weeklyDeficit = 400;
                    else if (week <= 6) weeklyDeficit = 500;
                    else weeklyDeficit = 600;
                } else {
                    // Principiante: Progresión gradual pero efectiva
                    // Semana 1-2: -200 kcal (adaptación)
                    // Semana 3-4: -300 kcal
                    // Semana 5-6: -400 kcal
                    // Semana 7-8: -500 kcal
                    // Semana 9+: -550 kcal (máximo)
                    if (week <= 2) weeklyDeficit = 200;
                    else if (week <= 4) weeklyDeficit = 300;
                    else if (week <= 6) weeklyDeficit = 400;
                    else if (week <= 8) weeklyDeficit = 500;
                    else weeklyDeficit = 550;
                }
                
                // Aplicar factor de peso (personas con más peso pueden tener déficit mayor)
                weeklyDeficit = Math.round(weeklyDeficit * weightFactor);
                
                targetCalories = tdee - weeklyDeficit;
                
                // NUNCA bajar del mínimo OMS
                if (targetCalories < minCalories) {
                    console.warn(`⚠️ Déficit ajustado: ${Math.round(targetCalories)} → ${minCalories} kcal (mínimo OMS)`);
                    targetCalories = minCalories;
                }
                break;
                
            case 'gain':
                // GANANCIA DE PESO: Progresión gradual para masa limpia
                let weeklySurplus;
                
                if (isExperienced) {
                    // Experimentado: Superávit moderado-alto
                    // Semana 1-2: +250 kcal
                    // Semana 3-4: +350 kcal
                    // Semana 5-6: +450 kcal
                    // Semana 7+: +500 kcal (máximo)
                    if (week <= 2) weeklySurplus = 250;
                    else if (week <= 4) weeklySurplus = 350;
                    else if (week <= 6) weeklySurplus = 450;
                    else weeklySurplus = 500;
                } else {
                    // Principiante: Superávit muy controlado
                    // Semana 1-2: +100 kcal (adaptación digestiva)
                    // Semana 3-4: +200 kcal
                    // Semana 5-6: +300 kcal
                    // Semana 7-8: +350 kcal
                    // Semana 9+: +400 kcal (máximo)
                    if (week <= 2) weeklySurplus = 100;
                    else if (week <= 4) weeklySurplus = 200;
                    else if (week <= 6) weeklySurplus = 300;
                    else if (week <= 8) weeklySurplus = 350;
                    else weeklySurplus = 400;
                }
                
                targetCalories = tdee + weeklySurplus;
                break;
                
            case 'maintain':
            default:
                // MANTENIMIENTO: Dieta equilibrada = TDEE exacto
                targetCalories = tdee;
                break;
        }

        const finalCalories = Math.max(minCalories, Math.round(targetCalories));
        
        // Log para debugging
        console.log(`📊 Calorías calculadas:
        - Peso: ${this.weight} kg (factor: ${weightFactor}x)
        - TDEE: ${tdee} kcal
        - Objetivo: ${this.goal}
        - Semana: ${week}
        - Experiencia: ${isExperienced ? 'Experimentado' : 'Principiante'}
        - Resultado: ${finalCalories} kcal`);
        
        return finalCalories;
    }

    // Calcular distribución de macronutrientes
    calculateMacros() {
        const calories = this.calculateTargetCalories();
        let proteinPercentage, carbsPercentage, fatPercentage;

        switch (this.dietType) {
            case 'high_protein':
                proteinPercentage = 0.35;
                carbsPercentage = 0.35;
                fatPercentage = 0.30;
                break;
            case 'low_carb':
                proteinPercentage = 0.30;
                carbsPercentage = 0.20;
                fatPercentage = 0.50;
                break;
            case 'vegetarian':
            case 'vegan':
                proteinPercentage = 0.20;
                carbsPercentage = 0.50;
                fatPercentage = 0.30;
                break;
            case 'balanced':
            default:
                proteinPercentage = 0.30;
                carbsPercentage = 0.40;
                fatPercentage = 0.30;
                break;
        }

        // Si el objetivo es ganar peso, aumentar proteína
        if (this.goal === 'gain') {
            proteinPercentage = Math.min(0.40, proteinPercentage + 0.05);
            carbsPercentage -= 0.05;
        }

        return {
            protein: Math.round((calories * proteinPercentage) / 4), // 4 kcal por gramo
            carbs: Math.round((calories * carbsPercentage) / 4),     // 4 kcal por gramo
            fats: Math.round((calories * fatPercentage) / 9)         // 9 kcal por gramo
        };
    }

    // Calcular IMC (Índice de Masa Corporal)
    calculateBMI() {
        const heightInMeters = this.height / 100;
        const bmi = this.weight / (heightInMeters * heightInMeters);
        return Math.round(bmi * 10) / 10;
    }

    // Obtener categoría de IMC
    getBMICategory() {
        const bmi = this.calculateBMI();
        if (bmi < 18.5) return 'Bajo peso';
        if (bmi < 25) return 'Peso normal';
        if (bmi < 30) return 'Sobrepeso';
        return 'Obesidad';
    }

    // Información adicional sobre composición corporal
    getBMIWarning() {
        return 'El IMC es una medida orientativa. No distingue entre masa muscular y grasa corporal. Una persona musculada puede tener un IMC alto sin tener exceso de grasa. Se recomienda consultar con un especialista para una evaluación completa de la composición corporal.';
    }

    // Calcular peso objetivo saludable
    getHealthyWeightRange() {
        const heightInMeters = this.height / 100;
        const minWeight = Math.round(18.5 * heightInMeters * heightInMeters);
        const maxWeight = Math.round(24.9 * heightInMeters * heightInMeters);
        return { min: minWeight, max: maxWeight };
    }

    // Validar si una receta es compatible con el usuario
    isRecipeCompatible(recipe) {
        // Verificar alergenos
        if (recipe.allergens && recipe.allergens.length > 0) {
            for (const allergen of this.allergens) {
                if (recipe.allergens.includes(allergen)) {
                    return false;
                }
            }
        }

        // Verificar alimentos no deseados
        if (recipe.ingredients && this.dislikedFoods.length > 0) {
            for (const disliked of this.dislikedFoods) {
                if (recipe.ingredients.some(ing => ing.toLowerCase().includes(disliked.toLowerCase()))) {
                    return false;
                }
            }
        }

        // Verificar tipo de dieta
        if (this.dietType === 'vegetarian' && recipe.type === 'meat') {
            return false;
        }
        if (this.dietType === 'vegan' && (recipe.type === 'meat' || recipe.type === 'dairy')) {
            return false;
        }

        return true;
    }

    // Calcular la semana actual basada en la fecha de creación
    updateCurrentWeek() {
        const now = new Date();
        const created = new Date(this.createdAt);
        const daysSinceCreation = Math.floor((now - created) / (1000 * 60 * 60 * 24));
        const weeksSinceCreation = Math.floor(daysSinceCreation / 7) + 1; // +1 porque empezamos en semana 1
        
        // Máximo 12 semanas, después se mantiene en 12
        this.currentWeek = Math.min(12, weeksSinceCreation);
        
        console.log(`📅 Semana actualizada: ${this.currentWeek} (${daysSinceCreation} días desde creación)`);
        return this.currentWeek;
    }

    // Avanzar manualmente a la siguiente semana (útil para testing)
    advanceWeek() {
        if (this.currentWeek < 12) {
            this.currentWeek++;
            this.lastUpdated = new Date().toISOString();
            console.log(`⏭️ Avanzado a semana ${this.currentWeek}`);
        } else {
            console.log(`⚠️ Ya estás en la semana máxima (12)`);
        }
        return this.currentWeek;
    }

    // Obtener descripción del plan actual
    getPlanDescription() {
        const tdee = this.calculateTDEE();
        const targetCals = this.calculateTargetCalories();
        const difference = targetCals - tdee;
        const weekInfo = `Semana ${this.currentWeek}/12`;
        
        let planType = '';
        if (this.goal === 'lose') {
            planType = difference < -400 ? 'Déficit agresivo' : difference < -200 ? 'Déficit moderado' : 'Déficit suave';
        } else if (this.goal === 'gain') {
            planType = difference > 400 ? 'Superávit alto' : difference > 200 ? 'Superávit moderado' : 'Superávit suave';
        } else {
            planType = 'Mantenimiento';
        }
        
        return `${weekInfo} - ${planType} (${difference > 0 ? '+' : ''}${difference} kcal)`;
    }

    // Convertir a objeto plano para guardar
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            age: this.age,
            gender: this.gender,
            weight: this.weight,
            height: this.height,
            targetWeight: this.targetWeight,
            targetDate: this.targetDate,
            activityLevel: this.activityLevel,
            goal: this.goal,
            allergens: this.allergens,
            foodPreferences: this.foodPreferences,
            dislikedFoods: this.dislikedFoods,
            dietType: this.dietType,
            dietExperience: this.dietExperience,
            currentWeek: this.currentWeek,
            cookingTime: this.cookingTime,
            supplements: this.supplements,
            createdAt: this.createdAt,
            lastUpdated: this.lastUpdated,
            weightHistory: this.weightHistory,
            mealHistory: this.mealHistory
        };
    }
}

// ===== GESTOR DE USUARIOS =====

class UserManager {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
    }

    // Cargar usuarios de localStorage
    loadUsers() {
        const usersData = localStorage.getItem('suitofocus_users');
        if (!usersData) return [];
        
        try {
            const parsed = JSON.parse(usersData);
            // Filtrar usuarios válidos (con nombre e id)
            const validUsers = parsed.filter(data => {
                const isValid = data && data.name && data.id;
                if (!isValid) {
                    console.warn('⚠️ Usuario con datos incompletos ignorado:', data);
                }
                return isValid;
            });
            
            if (validUsers.length !== parsed.length) {
                console.warn(`⚠️ Se encontraron ${parsed.length - validUsers.length} usuarios con datos incompletos`);
                // Guardar solo los usuarios válidos
                localStorage.setItem('suitofocus_users', JSON.stringify(validUsers));
            }
            
            return validUsers.map(data => new UserProfile(data));
        } catch (error) {
            console.error('❌ Error al cargar usuarios:', error);
            // Limpiar datos corruptos
            localStorage.removeItem('suitofocus_users');
            return [];
        }
    }

    // Guardar usuarios en localStorage
    saveUsers() {
        const usersData = this.users.map(user => user.toJSON());
        localStorage.setItem('suitofocus_users', JSON.stringify(usersData));
    }

    // Crear nuevo usuario
    createUser(userData) {
        const newUser = new UserProfile(userData);
        this.users.push(newUser);
        this.saveUsers();
        console.log('✅ Usuario creado:', newUser.name, 'ID:', newUser.id);
        return newUser.id; // Devolver el ID, no el objeto completo
    }

    // Obtener usuario por ID
    getUserById(id) {
        return this.users.find(user => user.id === id);
    }

    // Actualizar usuario
    updateUser(id, updates) {
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex === -1) return null;

        Object.assign(this.users[userIndex], updates);
        this.users[userIndex].lastUpdated = new Date().toISOString();
        this.saveUsers();
        return this.users[userIndex];
    }

    // Eliminar usuario
    deleteUser(id) {
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex === -1) return false;

        this.users.splice(userIndex, 1);
        this.saveUsers();
        
        // Si era el usuario actual, limpiar todo
        if (this.currentUser && this.currentUser.id === id) {
            this.currentUser = null;
            localStorage.removeItem('suitofocus_current_user_id');
            this.clearUserCookie();
        }
        
        return true;
    }

    // Establecer usuario actual
    setCurrentUser(id) {
        console.log('🔧 setCurrentUser llamado con ID:', id);
        const user = this.getUserById(id);
        console.log('🔧 Usuario encontrado:', user);
        if (!user) {
            console.error('❌ Usuario no encontrado con ID:', id);
            return false;
        }

        // Actualizar semana automáticamente cuando se carga el usuario
        user.updateCurrentWeek();
        
        this.currentUser = user;
        localStorage.setItem('suitofocus_current_user_id', id);
        
        // Guardar usuario actualizado
        this.saveUsers();
        
        // Guardar cookie de sesión que expira en 30 días
        this.setUserCookie(id);
        console.log('✅ Usuario actual establecido:', user.name, '- Semana:', user.currentWeek);
        return true;
    }

    // Guardar cookie de sesión del usuario
    setUserCookie(userId) {
        const expirationDays = 30;
        const date = new Date();
        date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = `suitofocus_user=${userId};${expires};path=/;SameSite=Strict`;
    }

    // Obtener cookie de sesión del usuario
    getUserCookie() {
        const name = "suitofocus_user=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');
        
        for (let cookie of cookieArray) {
            cookie = cookie.trim();
            if (cookie.indexOf(name) === 0) {
                return cookie.substring(name.length, cookie.length);
            }
        }
        return null;
    }

    // Eliminar cookie de sesión
    clearUserCookie() {
        document.cookie = "suitofocus_user=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
    }

    // Cargar usuario actual desde localStorage o cookie
    // Cargar usuario actual desde localStorage o cookie
    loadCurrentUser() {
        // Primero intentar desde localStorage
        let currentUserId = localStorage.getItem('suitofocus_current_user_id');
        
        // Si no está en localStorage, intentar desde cookie
        if (!currentUserId) {
            currentUserId = this.getUserCookie();
            if (currentUserId) {
                // Sincronizar cookie con localStorage
                localStorage.setItem('suitofocus_current_user_id', currentUserId);
            }
        }
        
        if (!currentUserId) return null;

        const user = this.getUserById(currentUserId);
        if (user) {
            this.currentUser = user;
            // Actualizar cookie para extender la sesión
            this.setUserCookie(currentUserId);
        } else {
            // Usuario no existe, limpiar cookie y localStorage
            this.clearUserCookie();
            localStorage.removeItem('suitofocus_current_user_id');
        }
        return user;
    }

    // Obtener usuario actual
    getCurrentUser() {
        return this.currentUser;
    }

    // Obtener todos los usuarios
    getAllUsers() {
        return this.users;
    }

    // Verificar si hay usuarios
    hasUsers() {
        return this.users.length > 0;
    }

    // Cerrar sesión del usuario actual
    logout() {
        this.currentUser = null;
        localStorage.removeItem('suitofocus_current_user_id');
        this.clearUserCookie();
    }
}

// Exportar para uso global
window.UserProfile = UserProfile;
window.UserManager = UserManager;
