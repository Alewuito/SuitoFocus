// ===== CARGADOR Y FILTRADOR DE RECETAS DATASET =====
// Procesa el dataset de 64K recetas y filtra según preferencias del usuario

(function() {
    console.log('Recipes Loader inicializado');

    let recipesDatabase = null;
    let loadingPromise = null;

    // Términos relacionados con airfryer en las instrucciones
    const AIRFRYER_KEYWORDS = [
        'air fryer', 'airfryer', 'air-fryer',
        'freidora de aire', 'freidora aire',
        'fry in air fryer', 'cook in air fryer',
        'place in air fryer', 'air frying'
    ];

    // Cargar el dataset de recetas
    async function loadRecipesDatabase() {
        if (recipesDatabase) {
            return recipesDatabase;
        }

        if (loadingPromise) {
            return loadingPromise;
        }

        loadingPromise = fetch('assets/recipes_extended.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo cargar el dataset de recetas');
                }
                return response.json();
            })
            .then(data => {
                console.log(`Dataset cargado: ${data.length} recetas`);
                recipesDatabase = data;
                return recipesDatabase;
            })
            .catch(error => {
                console.error('Error cargando recetas:', error);
                loadingPromise = null;
                return [];
            });

        return loadingPromise;
    }

    // Detectar si una receta es apta para airfryer
    function isAirfryerFriendly(recipe) {
        const directionsText = (recipe.directions_text || '').toLowerCase();
        const title = (recipe.recipe_title || '').toLowerCase();
        const category = (recipe.category || '').toLowerCase();
        
        return AIRFRYER_KEYWORDS.some(keyword => 
            directionsText.includes(keyword) || 
            title.includes(keyword) || 
            category.includes(keyword)
        );
    }

    // Filtrar recetas según perfil del usuario
    function filterRecipesByUserProfile(recipes, userProfile) {
        if (!recipes || !userProfile) return [];

        return recipes.filter(recipe => {
            // 1. Filtrar por airfryer si el usuario lo tiene
            if (userProfile.hasAirfryer) {
                if (!isAirfryerFriendly(recipe)) {
                    return false;
                }
            }

            // 2. Filtrar por tipo de dieta
            if (userProfile.dietType === 'vegan') {
                // Buscar "vegan" en título o categoría
                const text = `${recipe.recipe_title} ${recipe.category}`.toLowerCase();
                if (!text.includes('vegan')) {
                    return false;
                }
            }
            if (userProfile.dietType === 'vegetarian') {
                const text = `${recipe.recipe_title} ${recipe.category}`.toLowerCase();
                if (!text.includes('vegetarian') && !text.includes('vegan')) {
                    // Excluir carnes
                    const hasMeat = recipe.ingredient_text && (
                        recipe.ingredient_text.includes('chicken') ||
                        recipe.ingredient_text.includes('beef') ||
                        recipe.ingredient_text.includes('pork') ||
                        recipe.ingredient_text.includes('fish')
                    );
                    if (hasMeat) return false;
                }
            }

            // 3. Filtrar por alergenos
            const userAllergens = userProfile.allergens || [];
            const ingredientText = (recipe.ingredient_text || '').toLowerCase();
            
            if (userAllergens.includes('gluten')) {
                if (ingredientText.includes('wheat') || 
                    ingredientText.includes('flour') || 
                    ingredientText.includes('bread')) {
                    return false;
                }
            }
            if (userAllergens.includes('nuts')) {
                if (ingredientText.includes('nut') || 
                    ingredientText.includes('almond') || 
                    ingredientText.includes('peanut')) {
                    return false;
                }
            }
            if (userAllergens.includes('lactose')) {
                if (ingredientText.includes('milk') || 
                    ingredientText.includes('cheese') || 
                    ingredientText.includes('cream') ||
                    ingredientText.includes('butter')) {
                    return false;
                }
            }

            // 4. Filtrar por tiempo de cocina
            const numSteps = recipe.num_steps || 10;
            if (userProfile.cookingTime === 'quick' && numSteps > 5) {
                return false;
            }
            if (userProfile.cookingTime === 'moderate' && numSteps > 10) {
                return false;
            }

            return true;
        });
    }

    // Buscar recetas por tipo de comida y preferencias
    async function getRecipesForMeal(mealType, userProfile, count = 10) {
        const allRecipes = await loadRecipesDatabase();
        
        // Filtrar por perfil del usuario
        let filtered = filterRecipesByUserProfile(allRecipes, userProfile);

        // Filtrar adicionalmente por tipo de comida (category o subcategory)
        const categoryMapping = {
            'breakfast': ['breakfast', 'brunch'],
            'lunch': ['lunch', 'main dish', 'entree', 'soup', 'salad'],
            'dinner': ['dinner', 'main dish', 'entree'],
            'snack': ['snack', 'appetizer', 'side dish', 'dessert']
        };

        const validCategories = categoryMapping[mealType] || ['main dish'];
        
        filtered = filtered.filter(recipe => {
            const category = (recipe.category || '').toLowerCase();
            const subcategory = (recipe.subcategory || '').toLowerCase();
            const title = (recipe.recipe_title || '').toLowerCase();
            
            return validCategories.some(valid => 
                category.includes(valid) || 
                subcategory.includes(valid) ||
                title.includes(valid)
            );
        });

        // Priorizar recetas con menos ingredientes (más simples)
        filtered.sort((a, b) => (a.num_ingredients || 99) - (b.num_ingredients || 99));

        // Retornar las mejores N recetas
        return filtered.slice(0, count);
    }

    // Convertir receta del dataset al formato de nuestro sistema
    function convertToOurFormat(datasetRecipe) {
        // Estimar calorías base (aproximación basada en ingredientes y tipo)
        const estimatedKcal = estimateCalories(datasetRecipe);
        
        return {
            name: datasetRecipe.recipe_title,
            baseQty: parseIngredients(datasetRecipe.ingredients_raw || datasetRecipe.ingredients),
            baseKcal: estimatedKcal,
            macros: estimateMacros(datasetRecipe, estimatedKcal),
            video: '', // El dataset no tiene videos
            tags: buildTags(datasetRecipe),
            allergens: buildAllergens(datasetRecipe),
            ingredients: parseIngredientsList(datasetRecipe.ingredients_canonical || datasetRecipe.ingredients),
            directions: datasetRecipe.directions_raw || datasetRecipe.directions || [],
            cookTime: datasetRecipe.num_steps * 5, // Aproximar 5 min por paso
            difficulty: datasetRecipe.num_steps <= 5 ? 'easy' : (datasetRecipe.num_steps <= 10 ? 'medium' : 'hard'),
            numIngredients: datasetRecipe.num_ingredients || 0,
            numSteps: datasetRecipe.num_steps || 0
        };
    }

    // Estimar calorías (aproximación simple)
    function estimateCalories(recipe) {
        const numIngredients = recipe.num_ingredients || 5;
        const category = (recipe.category || '').toLowerCase();
        const ingredientText = (recipe.ingredient_text || '').toLowerCase();
        
        let baseCalories = 400; // Base por defecto
        
        // Ajustar según categoría
        if (category.includes('dessert') || category.includes('baked goods')) {
            baseCalories = 500;
        } else if (category.includes('salad') || category.includes('vegetable')) {
            baseCalories = 250;
        } else if (category.includes('breakfast')) {
            baseCalories = 350;
        } else if (category.includes('snack') || category.includes('appetizer')) {
            baseCalories = 200;
        }
        
        // Ajustar según ingredientes principales
        if (ingredientText.includes('chicken') || ingredientText.includes('turkey')) {
            baseCalories += 50;
        } else if (ingredientText.includes('beef') || ingredientText.includes('pork')) {
            baseCalories += 100;
        } else if (ingredientText.includes('cheese') || ingredientText.includes('cream')) {
            baseCalories += 80;
        } else if (ingredientText.includes('pasta') || ingredientText.includes('rice')) {
            baseCalories += 60;
        }
        
        // Ajustar según número de ingredientes (más ingredientes = más calorías generalmente)
        baseCalories += (numIngredients - 5) * 20;
        
        return Math.round(Math.max(150, Math.min(800, baseCalories))); // Entre 150-800 kcal
    }

    // Estimar macros (aproximación)
    function estimateMacros(recipe, totalKcal) {
        const category = (recipe.category || '').toLowerCase();
        const ingredientText = (recipe.ingredient_text || '').toLowerCase();
        
        let proteinRatio = 0.25;
        let carbsRatio = 0.45;
        let fatRatio = 0.30;
        
        // Ajustar según categoría y ingredientes
        if (ingredientText.includes('chicken') || ingredientText.includes('fish') || ingredientText.includes('turkey')) {
            proteinRatio = 0.40;
            carbsRatio = 0.30;
            fatRatio = 0.30;
        } else if (ingredientText.includes('beef') || ingredientText.includes('pork')) {
            proteinRatio = 0.30;
            carbsRatio = 0.25;
            fatRatio = 0.45;
        } else if (ingredientText.includes('pasta') || ingredientText.includes('rice') || ingredientText.includes('bread')) {
            proteinRatio = 0.15;
            carbsRatio = 0.60;
            fatRatio = 0.25;
        } else if (category.includes('salad') || category.includes('vegetable')) {
            proteinRatio = 0.15;
            carbsRatio = 0.55;
            fatRatio = 0.30;
        } else if (category.includes('dessert')) {
            proteinRatio = 0.10;
            carbsRatio = 0.65;
            fatRatio = 0.25;
        }
        
        return {
            protein: Math.round((totalKcal * proteinRatio) / 4), // 4 kcal/g
            carbs: Math.round((totalKcal * carbsRatio) / 4),
            fat: Math.round((totalKcal * fatRatio) / 9) // 9 kcal/g
        };
    }

    // Parsear ingredientes a formato de cantidades
    function parseIngredients(ingredientsList) {
        // Crear objeto de cantidades base simplificado
        const baseQty = {};
        
        if (!Array.isArray(ingredientsList)) return baseQty;
        
        ingredientsList.forEach(ing => {
            // Extraer nombre del ingrediente (última parte después de números)
            const cleanIng = ing
                .replace(/^\d+\/?\d*\s*(cup|tablespoon|teaspoon|pound|ounce|g|kg|ml|l)s?\s*/i, '')
                .trim()
                .toLowerCase();
            
            // Asignar cantidad genérica de 100g por defecto
            if (cleanIng) {
                baseQty[cleanIng] = 100;
            }
        });
        
        return baseQty;
    }

    // Extraer lista de ingredientes
    function parseIngredientsList(ingredientsList) {
        if (Array.isArray(ingredientsList)) {
            return ingredientsList.map(ing => ing.toLowerCase());
        }
        return [];
    }

    // Construir tags
    function buildTags(recipe) {
        const tags = [];
        const category = (recipe.category || '').toLowerCase();
        const ingredientText = (recipe.ingredient_text || '').toLowerCase();
        
        // Tags de dieta
        if (category.includes('vegan')) {
            tags.push('vegan');
        }
        if (category.includes('vegetarian') || category.includes('vegan')) {
            tags.push('veg');
        }
        
        // Tags de proteína
        if (ingredientText.includes('chicken') || ingredientText.includes('turkey') || 
            ingredientText.includes('beef') || ingredientText.includes('pork')) {
            tags.push('meat');
        }
        if (ingredientText.includes('fish') || ingredientText.includes('salmon') || 
            ingredientText.includes('tuna')) {
            tags.push('fish');
        }
        
        // Tags de estilo de cocina
        if (isAirfryerFriendly(recipe)) {
            tags.push('airfryer');
        }
        
        return tags;
    }

    // Construir alergenos
    function buildAllergens(recipe) {
        const allergens = [];
        const ingredientText = (recipe.ingredient_text || '').toLowerCase();
        
        if (ingredientText.includes('gluten') || ingredientText.includes('wheat') || 
            ingredientText.includes('flour') || ingredientText.includes('bread')) {
            allergens.push('gluten');
        }
        if (ingredientText.includes('milk') || ingredientText.includes('cheese') || 
            ingredientText.includes('cream') || ingredientText.includes('butter') ||
            ingredientText.includes('yogurt')) {
            allergens.push('lactose');
        }
        if (ingredientText.includes('nut') || ingredientText.includes('almond') || 
            ingredientText.includes('peanut') || ingredientText.includes('walnut')) {
            allergens.push('nuts');
        }
        if (ingredientText.includes('egg')) {
            allergens.push('eggs');
        }
        if (ingredientText.includes('soy') || ingredientText.includes('tofu')) {
            allergens.push('soy');
        }
        
        return allergens;
    }

    // Obtener estadísticas del dataset
    async function getDatasetStats() {
        const recipes = await loadRecipesDatabase();
        
        const airfryerCount = recipes.filter(r => isAirfryerFriendly(r)).length;
        
        const veganCount = recipes.filter(r => {
            const text = `${r.recipe_title} ${r.category}`.toLowerCase();
            return text.includes('vegan');
        }).length;
        
        const vegetarianCount = recipes.filter(r => {
            const text = `${r.recipe_title} ${r.category}`.toLowerCase();
            return text.includes('vegetarian') || text.includes('vegan');
        }).length;
        
        const quickCount = recipes.filter(r => {
            return (r.num_steps || 99) <= 5;
        }).length;
        
        const breakfastCount = recipes.filter(r => {
            const category = (r.category || '').toLowerCase();
            return category.includes('breakfast');
        }).length;
        
        return {
            total: recipes.length,
            airfryer: airfryerCount,
            vegan: veganCount,
            vegetarian: vegetarianCount,
            quick: quickCount,
            breakfast: breakfastCount
        };
    }

    // API pública
    window.RecipesLoader = {
        loadRecipesDatabase,
        getRecipesForMeal,
        filterRecipesByUserProfile,
        convertToOurFormat,
        getDatasetStats,
        isAirfryerFriendly
    };

    console.log('RecipesLoader API exportada');
})();
