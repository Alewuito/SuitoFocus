import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Flame, Flower2, ArrowLeft } from 'lucide-react'
import useTimer from '../../hooks/useTimer'
import CandleElement from './meditation/CandleElement'
import LotusElement from './meditation/LotusElement'
import Button from '../ui/Button'
import './FocusMode.css'

const PRESETS = [15, 25, 45, 60]
const ELEMENTS = [
  { id: 'candle', label: 'Vela', icon: <Flame size={18} /> },
  { id: 'lotus', label: 'Loto', icon: <Flower2 size={18} /> },
]

export default function FocusMode() {
  const navigate = useNavigate()
  const timer = useTimer(25)
  const [element, setElement] = useState('candle')
  const [clock, setClock] = useState('')

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const renderElement = () => {
    switch (element) {
      case 'lotus': return <LotusElement progress={timer.progress} isRunning={timer.isRunning} isComplete={timer.isComplete} />
      default: return <CandleElement isRunning={timer.isRunning} isComplete={timer.isComplete} />
    }
  }

  return (
    <div className="focus">
      {/* Background */}
      <div className="focus__bg" />

      {/* Top bar */}
      <div className="focus__topbar">
        <button className="focus__back" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={18} />
          <span>Panel</span>
        </button>
        <div className="focus__clock">{clock}</div>
        <div className="focus__element-picker">
          {ELEMENTS.map(el => (
            <button
              key={el.id}
              className={`focus__el-btn ${element === el.id ? 'focus__el-btn--active' : ''}`}
              onClick={() => setElement(el.id)}
              title={el.label}
            >
              {el.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div className="focus__grid">
        {/* Center: Meditation element */}
        <div className="focus__center">
          <div className="focus__element-container">
            {renderElement()}
          </div>
        </div>

        {/* Timer */}
        <div className="focus__timer-section">
          {/* Circular progress */}
          <div className="focus__timer-ring">
            <svg viewBox="0 0 200 200" className="focus__ring-svg">
              <circle className="focus__ring-bg" cx="100" cy="100" r="90" />
              <motion.circle
                className="focus__ring-fill"
                cx="100" cy="100" r="90"
                strokeDasharray={565.48}
                strokeDashoffset={565.48 * (1 - timer.progress)}
                initial={false}
                animate={{ strokeDashoffset: 565.48 * (1 - timer.progress) }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </svg>
            <div className="focus__timer-display">
              <span className="focus__timer-digits">{timer.display}</span>
              <span className="focus__timer-state">
                {timer.isComplete ? '¡Completado!' : timer.isRunning ? 'Enfocado' : 'Listo'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="focus__controls">
            <Button
              variant={timer.isRunning ? 'outline' : 'primary'}
              onClick={timer.toggle}
              size="lg"
            >
              {timer.isRunning ? 'Pausar' : timer.isComplete ? 'Reiniciar' : timer.timeLeft < timer.totalSeconds ? 'Reanudar' : 'Iniciar'}
            </Button>
            <Button variant="ghost" onClick={timer.reset}>Reiniciar</Button>
          </div>

          {/* Presets */}
          <div className="focus__presets">
            {PRESETS.map(m => (
              <button
                key={m}
                className={`focus__preset ${timer.totalSeconds === m * 60 ? 'focus__preset--active' : ''}`}
                onClick={() => timer.setMinutes(m)}
              >
                {m} min
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
