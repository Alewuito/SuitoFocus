import { AnimatePresence, motion } from 'framer-motion'
import { X, Clock, Flame as FireIcon, Wheat, Droplets, ChevronRight } from 'lucide-react'
import './RecipeModal.css'

export default function RecipeModal({ isOpen, onClose, meal }) {
  if (!meal) return null

  const { desc, kcal, recipe } = meal
  if (!recipe) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="recipe-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="recipe-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="recipe-modal__header">
              <div>
                <h2 className="recipe-modal__title">{desc}</h2>
                <div className="recipe-modal__meta">
                  <span className="recipe-modal__kcal"><FireIcon size={14} /> {kcal} kcal</span>
                  {recipe.time && <span className="recipe-modal__time"><Clock size={14} /> {recipe.time}</span>}
                </div>
              </div>
              <button className="recipe-modal__close" onClick={onClose}><X size={20} /></button>
            </div>

            {/* Macros */}
            {recipe.macros && (
              <div className="recipe-modal__macros">
                <div className="recipe-modal__macro">
                  <Wheat size={16} />
                  <div>
                    <span className="recipe-modal__macro-val">{recipe.macros.carbs}g</span>
                    <span className="recipe-modal__macro-label">Carbos</span>
                  </div>
                </div>
                <div className="recipe-modal__macro">
                  <Droplets size={16} />
                  <div>
                    <span className="recipe-modal__macro-val">{recipe.macros.protein}g</span>
                    <span className="recipe-modal__macro-label">Proteína</span>
                  </div>
                </div>
                <div className="recipe-modal__macro">
                  <FireIcon size={16} />
                  <div>
                    <span className="recipe-modal__macro-val">{recipe.macros.fat}g</span>
                    <span className="recipe-modal__macro-label">Grasas</span>
                  </div>
                </div>
              </div>
            )}

            {/* Ingredients */}
            {recipe.ingredients && (
              <div className="recipe-modal__section">
                <h3>Ingredientes</h3>
                <ul className="recipe-modal__ingredients">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Steps */}
            {recipe.steps && (
              <div className="recipe-modal__section">
                <h3>Preparación</h3>
                <ol className="recipe-modal__steps">
                  {recipe.steps.map((step, i) => (
                    <li key={i}>
                      <span className="recipe-modal__step-num">{i + 1}</span>
                      <p>{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
