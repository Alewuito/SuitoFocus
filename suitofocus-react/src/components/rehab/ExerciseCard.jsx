import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, ChevronDown, Target, Repeat, BarChart3 } from 'lucide-react'
import './ExerciseCard.css'

const DIFFICULTY_LABELS = ['', 'Básico', 'Intermedio', 'Avanzado']
const DIFFICULTY_COLORS = ['', 'var(--success)', 'var(--warning)', 'var(--danger)']

export default function ExerciseCard({ exercise }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      className={`exercise-card ${expanded ? 'exercise-card--expanded' : ''}`}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header — always visible */}
      <div className="exercise-card__header" onClick={() => setExpanded(!expanded)}>
        <div className="exercise-card__info">
          <span className="exercise-card__phase">{exercise.phaseLabel}</span>
          <h3 className="exercise-card__name">{exercise.name}</h3>
          <div className="exercise-card__meta">
            <span className="exercise-card__target"><Target size={13} /> {exercise.target}</span>
            <span className="exercise-card__sets"><Repeat size={13} /> {exercise.sets} · {exercise.reps}</span>
            <span className="exercise-card__diff" style={{ color: DIFFICULTY_COLORS[exercise.difficulty] }}>
              <BarChart3 size={13} /> {DIFFICULTY_LABELS[exercise.difficulty]}
            </span>
          </div>
        </div>
        <ChevronDown size={18} className={`exercise-card__chevron ${expanded ? 'exercise-card__chevron--open' : ''}`} />
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="exercise-card__body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Video placeholder */}
            <div className="exercise-card__demo">
              <div className="exercise-card__video-placeholder">
                <Play size={40} />
                <span>Demostración visual</span>
                <p className="exercise-card__video-alt">Vídeo demostrativo: {exercise.name}</p>
              </div>
            </div>

            {/* Description */}
            <p className="exercise-card__description">{exercise.description}</p>

            {/* Steps */}
            <div className="exercise-card__steps">
              <h4>Instrucciones paso a paso</h4>
              <ol>
                {exercise.steps.map((step, i) => (
                  <li key={i}>
                    <span className="exercise-card__step-num">{i + 1}</span>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
