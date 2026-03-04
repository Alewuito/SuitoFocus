// ========================================
// SISTEMA DE INTERFAZ DE USUARIO PARA MULTI-USUARIO
// ========================================

class UserInterface {
    constructor() {
        this.userManager = new UserManager();
        this.currentStep = 1;
        this.totalSteps = 7;
        this.formData = {};
        
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        // Pantallas principales
        this.introScreen = document.getElementById('intro-screen');
        this.userSelectionScreen = document.getElementById('user-selection-screen');
        this.onboardingScreen = document.getElementById('onboarding-screen');
        this.dashboardMain = document.querySelector('.dashboard-main');
        
        // Grid de usuarios
        this.usersGrid = document.getElementById('users-grid');
        
        // Formulario de onboarding
        this.onboardingForm = document.getElementById('onboarding-form');
        this.btnPrev = document.getElementById('btn-prev');
        this.btnNext = document.getElementById('btn-next');
        this.progressSteps = document.querySelectorAll('.progress-step');
        this.formSteps = document.querySelectorAll('.onboarding-step');
    }

    attachEventListeners() {
        // Botón de continuar en intro
        const introContinueBtn = document.getElementById('intro-continue-btn');
        if (introContinueBtn) {
            introContinueBtn.addEventListener('click', () => this.hideIntro());
        }
        
        // Navegación del formulario
        this.btnNext.addEventListener('click', () => this.nextStep());
        this.btnPrev.addEventListener('click', () => this.prevStep());
        
        // Validación en tiempo real
        this.onboardingForm.addEventListener('input', () => this.validateCurrentStep());
        
        // Botón de cambiar usuario en el header
        const switchUserBtn = document.getElementById('switch-user-btn');
        if (switchUserBtn) {
            switchUserBtn.addEventListener('click', () => this.showUserSelection());
        }
        
        // Actualizar recomendación de dieta según objetivo
        const goalRadios = document.querySelectorAll('input[name="goal"]');
        goalRadios.forEach(radio => {
            radio.addEventListener('change', () => this.updateDietRecommendation());
        });
        
        // Mostrar/ocultar información de suplementos
        const supplementCheckboxes = document.querySelectorAll('#supplements-group input[type="checkbox"]');
        supplementCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const supplementId = e.target.id.replace('supplement-', '');
                const infoDiv = document.getElementById(`info-${supplementId}`);
                if (infoDiv) {
                    infoDiv.style.display = e.target.checked ? 'block' : 'none';
                }
            });
        });
    }

    hideIntro() {
        this.introScreen.classList.add('fade-out');
        setTimeout(() => {
            this.introScreen.style.display = 'none';
            this.checkUserAndNavigate();
        }, 800);
    }

    checkUserAndNavigate() {
        const currentUser = this.userManager.getCurrentUser();
        
        if (currentUser) {
            // Mostrar mensaje de bienvenida si se cargó desde cookie
            // Usuario cargado desde cookie
            this.loadDashboard();
        } else {
            this.showUserSelection();
        }
    }

    updateDietRecommendation() {
        const selectedGoal = document.querySelector('input[name="goal"]:checked');
        const dietSelect = document.getElementById('diet-type');
        const recommendation = document.querySelector('.diet-recommendation');
        
        if (!selectedGoal || !recommendation) return;
        
        const goal = selectedGoal.value;
        let recommendedDiet = 'balanced';
        let message = '';
        
        switch(goal) {
            case 'lose':
                recommendedDiet = 'low_carb';
                message = 'Recomendado: Baja en Carbohidratos - Estudios muestran mayor efectividad para pérdida de peso';
                dietSelect.value = 'low_carb';
                break;
            case 'gain':
                recommendedDiet = 'high_protein';
                message = 'Recomendado: Alta en Proteína - Óptimo para ganancia muscular';
                dietSelect.value = 'high_protein';
                break;
            case 'maintain':
                recommendedDiet = 'balanced';
                message = 'Recomendado: Balanceada - Ideal para mantenimiento saludable';
                dietSelect.value = 'balanced';
                break;
        }
        
        recommendation.textContent = message;
    }

    // ====== PANTALLA DE SELECCIÓN DE USUARIOS ======
    showUserSelection() {
        const users = this.userManager.loadUsers();
        
        if (users.length === 0) {
            // Si no hay usuarios, ir directo al onboarding
            this.showOnboarding();
            return;
        }
        
        this.renderUsersGrid(users);
        this.userSelectionScreen.classList.remove('hidden');
        this.onboardingScreen.classList.add('hidden');
        if (this.dashboardMain) this.dashboardMain.style.display = 'none';
    }

    renderUsersGrid(users) {
        this.usersGrid.innerHTML = '';
        
        // Renderizar usuarios existentes
        users.forEach(user => {
            // Validar que el usuario tenga los datos mínimos requeridos
            if (user && user.name && user.id) {
                const userCard = this.createUserCard(user);
                this.usersGrid.appendChild(userCard);
            } else {
                console.warn('Usuario con datos incompletos ignorado:', user);
            }
        });
        
        // Botón para nuevo usuario
        const newUserCard = this.createNewUserCard();
        this.usersGrid.appendChild(newUserCard);
    }

    createUserCard(user) {
        if (!user || !user.name) {
            console.error('Usuario inválido:', user);
            return document.createElement('div');
        }
        
        const card = document.createElement('div');
        card.className = 'user-card';
        
        const initials = this.getUserInitials(user.name);
        const gradientClass = this.getAvatarGradient(user.id);
        
        card.innerHTML = `
            <div class="user-card-avatar ${gradientClass}">
                <span>${initials}</span>
            </div>
            <div class="user-card-name">${user.name}</div>
            <div class="user-card-info">
                <div>${user.age} años • ${user.weight}kg</div>
                <div>${this.getGoalLabel(user.goal)}</div>
            </div>
            <button class="user-card-delete" aria-label="Eliminar usuario">×</button>
        `;
        
        // Click en la tarjeta para seleccionar usuario
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('user-card-delete')) {
                this.selectUser(user.id);
            }
        });
        
        // Click en el botón de eliminar
        const deleteBtn = card.querySelector('.user-card-delete');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteUser(user.id);
        });
        
        return card;
    }

    createNewUserCard() {
        const card = document.createElement('div');
        card.className = 'user-card new-user-card';
        
        card.innerHTML = `
            <div class="new-user-icon">+</div>
            <div class="user-card-name">Nuevo Usuario</div>
            <div class="user-card-info">Crear perfil</div>
        `;
        
        card.addEventListener('click', () => this.showOnboarding());
        
        return card;
    }

    getUserInitials(name) {
        if (!name || typeof name !== 'string') {
            return '??';
        }
        return name
            .split(' ')
            .map(word => word[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    }

    getAvatarGradient(id) {
        const gradients = ['gradient-1', 'gradient-2', 'gradient-3', 'gradient-4', 'gradient-5'];
        // Convertir id a número si es string
        const numId = typeof id === 'string' ? parseInt(id) || 0 : id || 0;
        return gradients[numId % gradients.length];
    }

    getGoalLabel(goal) {
        const labels = {
            lose: 'Perder peso',
            maintain: 'Mantener peso',
            gain: 'Ganar peso'
        };
        return labels[goal] || goal;
    }

    selectUser(userId) {
        console.log('👤 Seleccionando usuario:', userId);
        this.userManager.setCurrentUser(userId);
        const currentUser = this.userManager.getCurrentUser();
        console.log('👤 Usuario establecido:', currentUser);
        if (!currentUser) {
            console.error('❌ Error: No se pudo establecer el usuario');
            alert('Error al cargar el usuario. Por favor, recarga la página.');
            return;
        }
        this.loadDashboard();
    }

    deleteUser(userId) {
        if (confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.')) {
            this.userManager.deleteUser(userId);
            this.showUserSelection();
        }
    }

    loadDashboard() {
        const user = this.userManager.getCurrentUser();
        if (!user) {
            console.error('❌ No hay usuario actual al cargar dashboard');
            this.showUserSelection();
            return;
        }
        
        this.userSelectionScreen.classList.add('hidden');
        this.onboardingScreen.classList.add('hidden');
        if (this.dashboardMain) this.dashboardMain.style.display = 'block';
        
        // Mostrar botón de cambiar usuario
        const switchUserBtn = document.getElementById('switch-user-btn');
        if (switchUserBtn) switchUserBtn.style.display = 'inline-block';
        
        // Disparar evento personalizado para que script.js cargue los datos del usuario
        console.log('📤 Disparando evento userLoaded para:', user.name, 'ID:', user.id);
        window.dispatchEvent(new CustomEvent('userLoaded', {
            detail: { user }
        }));
    }

    // ====== FORMULARIO DE ONBOARDING ======
    showOnboarding() {
        this.userSelectionScreen.classList.add('hidden');
        this.onboardingScreen.classList.remove('hidden');
        if (this.dashboardMain) this.dashboardMain.style.display = 'none';
        
        this.currentStep = 1;
        this.resetForm();
        this.updateStepDisplay();
    }

    resetForm() {
        this.onboardingForm.reset();
        this.formData = {};
    }

    nextStep() {
        if (!this.validateCurrentStep()) {
            return;
        }
        
        this.saveCurrentStepData();
        
        if (this.currentStep === this.totalSteps) {
            // Último paso: crear usuario
            this.createUser();
        } else {
            this.currentStep++;
            this.updateStepDisplay();
            
            if (this.currentStep === this.totalSteps) {
                // Generar resumen antes de mostrar el último paso
                this.generateSummary();
            }
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
        }
    }

    updateStepDisplay() {
        // Actualizar pasos en la barra de progreso
        this.progressSteps.forEach((step, index) => {
            if (index < this.currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Mostrar/ocultar secciones del formulario
        this.formSteps.forEach((step, index) => {
            if (index + 1 === this.currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Actualizar botones
        this.btnPrev.style.display = this.currentStep === 1 ? 'none' : 'inline-block';
        this.btnNext.textContent = this.currentStep === this.totalSteps ? '✓ Crear Perfil' : 'Siguiente →';
    }

    validateCurrentStep() {
        const currentStepElement = document.querySelector(`.onboarding-step[data-step="${this.currentStep}"]`);
        const requiredInputs = currentStepElement.querySelectorAll('[required]');
        
        let isValid = true;
        requiredInputs.forEach(input => {
            if (input.type === 'radio') {
                const radioGroup = currentStepElement.querySelectorAll(`[name="${input.name}"]`);
                const isChecked = Array.from(radioGroup).some(radio => radio.checked);
                if (!isChecked) isValid = false;
            } else if (!input.value.trim()) {
                isValid = false;
            }
        });
        
        this.btnNext.disabled = !isValid;
        return isValid;
    }

    saveCurrentStepData() {
        const currentStepElement = document.querySelector(`.onboarding-step[data-step="${this.currentStep}"]`);
        
        switch (this.currentStep) {
            case 1: // Información básica
                this.formData.name = document.getElementById('user-name').value.trim();
                this.formData.age = parseInt(document.getElementById('user-age').value);
                this.formData.gender = document.getElementById('user-gender').value;
                this.formData.weight = parseFloat(document.getElementById('user-weight').value);
                this.formData.height = parseInt(document.getElementById('user-height').value);
                
                // Peso objetivo y fecha (opcionales)
                const targetWeightValue = document.getElementById('user-target-weight').value;
                this.formData.targetWeight = targetWeightValue ? parseFloat(targetWeightValue) : null;
                
                const targetDateValue = document.getElementById('user-target-date').value;
                this.formData.targetDate = targetDateValue || null;
                break;
                
            case 2: // Actividad
                this.formData.activityLevel = document.querySelector('input[name="activity-level"]:checked').value;
                break;
                
            case 3: // Objetivo y dieta
                this.formData.goal = document.querySelector('input[name="goal"]:checked').value;
                this.formData.dietType = document.getElementById('diet-type').value;
                break;
                
            case 4: // Experiencia con dietas
                const expRadio = document.querySelector('input[name="diet-experience"]:checked');
                this.formData.dietExperience = expRadio ? expRadio.value : 'beginner';
                break;
                
            case 5: // Preferencias de cocina y suplementación
                this.formData.cookingTime = document.querySelector('input[name="cooking-time"]:checked').value;
                
                // Capturar si tiene airfryer
                const airfryerRadio = document.querySelector('input[name="has-airfryer"]:checked');
                this.formData.hasAirfryer = airfryerRadio ? airfryerRadio.value === 'yes' : false;
                
                const supplementCheckboxes = document.querySelectorAll('#supplements-group input[type="checkbox"]:checked');
                this.formData.supplements = Array.from(supplementCheckboxes).map(cb => cb.value);
                break;
                
            case 6: // Alergenos y preferencias
                const allergenCheckboxes = document.querySelectorAll('#allergens-group input[type="checkbox"]:checked');
                this.formData.allergens = Array.from(allergenCheckboxes).map(cb => cb.value);
                
                // Añadir otros alergenos
                const otherAllergensText = document.getElementById('other-allergens').value.trim();
                if (otherAllergensText) {
                    const otherAllergens = otherAllergensText.split(',').map(a => a.trim());
                    this.formData.allergens = [...this.formData.allergens, ...otherAllergens];
                }
                
                const dislikedText = document.getElementById('disliked-foods').value.trim();
                this.formData.dislikedFoods = dislikedText ? dislikedText.split(',').map(f => f.trim()) : [];
                
                const preferredText = document.getElementById('preferred-foods').value.trim();
                this.formData.foodPreferences = preferredText ? preferredText.split(',').map(f => f.trim()) : [];
                break;
        }
    }

    generateSummary() {
        const summaryContent = document.getElementById('summary-content');
        
        // Crear un UserProfile temporal para obtener los cálculos
        const tempProfile = new UserProfile(
            Date.now(),
            this.formData.name,
            this.formData.age,
            this.formData.gender,
            this.formData.weight,
            this.formData.height,
            this.formData.activityLevel,
            this.formData.goal,
            this.formData.allergens,
            this.formData.foodPreferences,
            this.formData.dislikedFoods,
            this.formData.dietType
        );
        
        const bmr = Math.round(tempProfile.calculateBMR());
        const tdee = Math.round(tempProfile.calculateTDEE());
        const targetCalories = Math.round(tempProfile.calculateTargetCalories());
        const macros = tempProfile.calculateMacros();
        const bmi = tempProfile.calculateBMI();
        const bmiCategory = tempProfile.getBMICategory();
        
        // Calcular progreso estimado si hay peso objetivo
        let progressInfo = '';
        if (this.formData.targetWeight) {
            const weightDiff = Math.abs(this.formData.weight - this.formData.targetWeight);
            const weeklyLoss = 0.5; // kg por semana (saludable)
            const weeksNeeded = Math.ceil(weightDiff / weeklyLoss);
            const monthsNeeded = Math.ceil(weeksNeeded / 4);
            
            progressInfo = `
                <div class="summary-card highlight">
                    <div class="summary-card-title">📊 Tu Objetivo de Peso</div>
                    <div class="summary-card-content">
                        <p><strong>Peso Actual:</strong> ${this.formData.weight} kg</p>
                        <p><strong>Peso Objetivo:</strong> ${this.formData.targetWeight} kg</p>
                        <p><strong>Diferencia:</strong> ${weightDiff.toFixed(1)} kg</p>
                        <p><strong>Tiempo Estimado:</strong> ${monthsNeeded} ${monthsNeeded === 1 ? 'mes' : 'meses'} (${weeksNeeded} semanas)</p>
                        ${this.formData.targetDate ? `<p><strong>Tu Fecha Meta:</strong> ${new Date(this.formData.targetDate).toLocaleDateString('es-ES')}</p>` : ''}
                        <small style="color: var(--text-color); opacity: 0.8;">💡 Pérdida saludable: 0.5kg/semana</small>
                    </div>
                </div>
            `;
        }
        
        summaryContent.innerHTML = `
            <div class="summary-card">
                <div class="summary-card-title">Información Personal</div>
                <div class="summary-card-content">
                    <p><strong>Nombre:</strong> ${this.formData.name}</p>
                    <p><strong>Edad:</strong> ${this.formData.age} años</p>
                    <p><strong>Sexo:</strong> ${this.getGenderLabel(this.formData.gender)}</p>
                    <p><strong>Peso Actual:</strong> ${this.formData.weight} kg</p>
                    <p><strong>Altura:</strong> ${this.formData.height} cm</p>
                    <p><strong>IMC:</strong> ${bmi} (${bmiCategory})</p>
                    <p class="bmi-warning"><small><strong>Importante:</strong> ${tempProfile.getBMIWarning()}</small></p>
                </div>
            </div>
            
            ${progressInfo}
            
            <div class="summary-card">
                <div class="summary-card-title">Objetivo y Actividad</div>
                <div class="summary-card-content">
                    <p><strong>Objetivo:</strong> ${this.getGoalLabel(this.formData.goal)}</p>
                    <p><strong>Actividad:</strong> ${this.getActivityLabel(this.formData.activityLevel)}</p>
                    <p><strong>Tipo de Dieta:</strong> ${this.getDietTypeLabel(this.formData.dietType)}</p>
                </div>
            </div>
            
            <div class="summary-card">
                <div class="summary-card-title">Preferencias de Cocina</div>
                <div class="summary-card-content">
                    <p><strong>Tiempo disponible:</strong> ${this.getCookingTimeLabel(this.formData.cookingTime)}</p>
                    ${this.formData.supplements && this.formData.supplements.length > 0 ? `
                        <p><strong>Suplementación:</strong> ${this.formData.supplements.map(s => this.getSupplementLabel(s)).join(', ')}</p>
                    ` : '<p><strong>Suplementación:</strong> Ninguna</p>'}
                </div>
            </div>
            
            <div class="summary-card highlight">
                <div class="summary-card-title">Tu Plan Calórico</div>
                <div class="summary-card-content">
                    <p><strong>Metabolismo Basal (BMR):</strong> ${bmr} kcal</p>
                    <p><strong>Gasto Diario (TDEE):</strong> ${tdee} kcal</p>
                    <p class="highlight-value"><strong>Objetivo Diario:</strong> ${targetCalories} kcal</p>
                </div>
            </div>
            
            <div class="summary-card">
                <div class="summary-card-title">Distribución de Macronutrientes</div>
                <div class="summary-card-content">
                    <p><strong>Proteínas:</strong> ${Math.round(macros.protein)}g</p>
                    <p><strong>Carbohidratos:</strong> ${Math.round(macros.carbs)}g</p>
                    <p><strong>Grasas:</strong> ${Math.round(macros.fat)}g</p>
                </div>
            </div>
            
            ${this.formData.allergens.length > 0 ? `
                <div class="summary-card">
                    <div class="summary-card-title">Alergenos</div>
                    <div class="summary-card-content">
                        <p>${this.formData.allergens.join(', ')}</p>
                    </div>
                </div>
            ` : ''}
            
            ${this.formData.dislikedFoods.length > 0 ? `
                <div class="summary-card">
                    <div class="summary-card-title">No me gusta</div>
                    <div class="summary-card-content">
                        <p>${this.formData.dislikedFoods.join(', ')}</p>
                    </div>
                </div>
            ` : ''}
            
            ${this.formData.foodPreferences.length > 0 ? `
                <div class="summary-card">
                    <div class="summary-card-title">Favoritos</div>
                    <div class="summary-card-content">
                        <p>${this.formData.foodPreferences.join(', ')}</p>
                    </div>
                </div>
            ` : ''}
        `;
    }

    getGenderLabel(gender) {
        const labels = { male: 'Masculino', female: 'Femenino', other: 'Otro' };
        return labels[gender] || gender;
    }

    getActivityLabel(level) {
        const labels = {
            sedentary: '🛋️ Sedentario',
            light: '🚶 Ligero',
            moderate: '🏃 Moderado',
            active: '💪 Activo',
            very_active: '🏋️ Muy Activo'
        };
        return labels[level] || level;
    }

    getDietTypeLabel(type) {
        const labels = {
            balanced: 'Balanceada',
            high_protein: 'Alta en Proteína',
            low_carb: 'Baja en Carbohidratos',
            vegetarian: 'Vegetariana',
            vegan: 'Vegana'
        };
        return labels[type] || type;
    }

    getCookingTimeLabel(time) {
        const labels = {
            quick: '⚡ Rápido (10-15 min)',
            moderate: '🍳 Moderado (20-30 min)',
            elaborate: '👨‍🍳 Elaborado (30-45 min)'
        };
        return labels[time] || time;
    }

    getSupplementLabel(supplement) {
        const labels = {
            protein: 'Proteína',
            creatine: 'Creatina',
            omega3: 'Omega-3',
            'vitamin-d': 'Vitamina D3',
            magnesium: 'Magnesio',
            caffeine: 'Cafeína'
        };
        return labels[supplement] || supplement;
    }

    createUser() {
        try {
            console.log('📝 Creando usuario con datos:', this.formData);
            const userId = this.userManager.createUser({
                name: this.formData.name,
                age: this.formData.age,
                gender: this.formData.gender,
                weight: this.formData.weight,
                height: this.formData.height,
                targetWeight: this.formData.targetWeight,
                targetDate: this.formData.targetDate,
                activityLevel: this.formData.activityLevel,
                goal: this.formData.goal,
                allergens: this.formData.allergens || [],
                foodPreferences: this.formData.foodPreferences || [],
                dislikedFoods: this.formData.dislikedFoods || [],
                dietType: this.formData.dietType,
                dietExperience: this.formData.dietExperience || 'beginner',
                cookingTime: this.formData.cookingTime || 'moderate',
                supplements: this.formData.supplements || []
            });
            
            console.log('✅ Usuario creado con ID:', userId);
            
            // Establecer como usuario actual
            this.userManager.setCurrentUser(userId);
            
            // Mostrar mensaje de éxito y cargar dashboard
            this.showSuccessMessage();
            setTimeout(() => this.loadDashboard(), 1500);
        } catch (error) {
            console.error('❌ Error al crear usuario:', error);
            alert('Error al crear el usuario: ' + error.message);
        }
    }

    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-toast';
        message.innerHTML = `
            <div class="success-icon">✓</div>
            <div class="success-text">¡Perfil creado exitosamente!</div>
        `;
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 50px;
            border-radius: 20px;
            font-size: 1.2rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: successPop 0.5s ease;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'successPop 0.3s ease reverse';
            setTimeout(() => message.remove(), 300);
        }, 1200);
    }

    // ====== INICIALIZACIÓN ======
    init() {
        // Verificar si hay un usuario con sesión activa (cookie)
        const currentUser = this.userManager.getCurrentUser();
        const hasUsers = this.userManager.hasUsers();
        
        if (currentUser) {
            // Si hay sesión activa, ir directo al dashboard
            console.log('🔐 Sesión activa detectada:', currentUser.name);
            if (this.introScreen) {
                this.introScreen.style.display = 'none';
            }
            this.userSelectionScreen.classList.add('hidden');
            this.onboardingScreen.classList.add('hidden');
            
            // Cargar dashboard directamente
            this.loadDashboard();
            
            // Mostrar notificación de bienvenida
            setTimeout(() => {
                if (window.showNotification) {
                    window.showNotification(`Bienvenido de nuevo, ${currentUser.name}`, 'info');
                }
            }, 500);
            
        } else if (hasUsers) {
            // Si hay usuarios pero sin sesión, mostrar selección de usuario
            console.log('👥 Usuarios existentes detectados - mostrando selección');
            if (this.introScreen) {
                this.introScreen.style.display = 'none';
            }
            this.showUserSelection();
            
        } else {
            // Si no hay usuarios, mostrar intro para nuevos usuarios
            console.log('👋 Primera vez - mostrando intro');
            if (this.introScreen) {
                this.introScreen.style.display = 'flex';
            }
            
            // Ocultar otras pantallas
            this.userSelectionScreen.classList.add('hidden');
            this.onboardingScreen.classList.add('hidden');
            if (this.dashboardMain) this.dashboardMain.style.display = 'none';
        }
    }
}

// Inicializar el sistema cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.userInterface = new UserInterface();
    window.userInterface.init();
});
