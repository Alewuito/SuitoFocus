import { useState } from 'react'
import { motion } from 'framer-motion'
import { HeartPulse, BookOpen, Dumbbell } from 'lucide-react'
import { INJURY_INFO, EXERCISES } from './exerciseData'
import InjuryOverview from './InjuryOverview'
import ExerciseCard from './ExerciseCard'
import './RehabModule.css'

const TABS = [
  { id: 'study', label: 'Estudio Clínico', icon: <BookOpen size={16} /> },
  { id: 'exercises', label: 'Protocolo de Ejercicios', icon: <Dumbbell size={16} /> },
]

const PHASE_FILTERS = [
  { id: 0, label: 'Todas' },
  { id: 1, label: 'Fase 1 — Pasivo' },
  { id: 2, label: 'Fase 2 — Activo' },
  { id: 3, label: 'Fase 3 — Resistido' },
]

export default function RehabModule() {
  const [tab, setTab] = useState('study')
  const [phaseFilter, setPhaseFilter] = useState(0)

  const filteredExercises = phaseFilter === 0
    ? EXERCISES
    : EXERCISES.filter(e => e.phase === phaseFilter)

  return (
    <motion.div className="rehab" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div className="rehab__header">
        <div className="rehab__header-icon">
          <HeartPulse size={28} />
        </div>
        <div>
          <h1>{INJURY_INFO.title}</h1>
          <p>{INJURY_INFO.subtitle}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="rehab__tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`rehab__tab ${tab === t.id ? 'rehab__tab--active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'study' && <InjuryOverview />}

      {tab === 'exercises' && (
        <div className="rehab__exercises">
          {/* Phase filter */}
          <div className="rehab__phase-filter">
            {PHASE_FILTERS.map(pf => (
              <button
                key={pf.id}
                className={`rehab__phase-btn ${phaseFilter === pf.id ? 'rehab__phase-btn--active' : ''}`}
                onClick={() => setPhaseFilter(pf.id)}
              >
                {pf.label}
              </button>
            ))}
          </div>

          {/* Exercise list */}
          <div className="rehab__exercise-list">
            {filteredExercises.map(ex => (
              <ExerciseCard key={ex.id} exercise={ex} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
