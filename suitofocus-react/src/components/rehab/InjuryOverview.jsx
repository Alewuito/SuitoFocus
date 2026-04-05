import { motion } from 'framer-motion'
import { AlertTriangle, Activity, Clock, ShieldAlert, MoveRight } from 'lucide-react'
import { INJURY_INFO } from './exerciseData'
import './RehabModule.css'

export default function InjuryOverview() {
  const info = INJURY_INFO
  const severityColor = (sev) => sev === 'Crítico' ? 'var(--danger)' : 'var(--warning)'

  return (
    <div className="injury-overview">
      {/* Anatomy */}
      <motion.div className="injury-section" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h3 className="injury-section__title">
          <Activity size={16} /> {info.anatomy.title}
        </h3>
        <p className="injury-section__text">{info.anatomy.content}</p>
      </motion.div>

      {/* Immobilization effects */}
      <motion.div
        className="injury-section"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="injury-section__title">
          <ShieldAlert size={16} /> {info.immobilization.title}
        </h3>
        <div className="injury-effects">
          {info.immobilization.items.map((item, i) => (
            <div key={i} className="injury-effect">
              <div className="injury-effect__header">
                <AlertTriangle size={14} />
                <strong>{item.label}</strong>
              </div>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Critical movements */}
      <motion.div
        className="injury-section"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="injury-section__title">
          <MoveRight size={16} /> {info.criticalMovements.title}
        </h3>
        <div className="injury-movements">
          {['extension', 'supination', 'flexion', 'pronation'].map(key => {
            const mov = info.criticalMovements[key]
            return (
              <div key={key} className="injury-movement">
                <div className="injury-movement__header">
                  <h4>{mov.label}</h4>
                  <span className="injury-movement__severity" style={{ color: severityColor(mov.severity) }}>
                    {mov.severity}
                  </span>
                </div>
                <p>{mov.explanation}</p>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Recovery timeline */}
      <motion.div
        className="injury-section"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="injury-section__title">
          <Clock size={16} /> Cronograma de Recuperación
        </h3>
        <div className="injury-timeline">
          {info.timeline.map((step, i) => (
            <div key={i} className="injury-timeline__item">
              <div className="injury-timeline__marker">
                <span className="injury-timeline__week">Sem {step.week}</span>
                <span className="injury-timeline__line" />
              </div>
              <div className="injury-timeline__content">
                <strong>{step.phase}</strong>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
