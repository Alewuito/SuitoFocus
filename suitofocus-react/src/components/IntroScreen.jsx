import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Crosshair, Salad, BarChart3, Users, Info } from 'lucide-react'
import Button from './ui/Button'
import './IntroScreen.css'

const features = [
  { title: 'Modo Focus', desc: 'Maximiza tu productividad con herramientas de concentración y gestión del tiempo', icon: <Crosshair size={20} /> },
  { title: 'Planes Personalizados', desc: 'Nutrición adaptada a tus objetivos, actividad física y preferencias', icon: <Salad size={20} /> },
  { title: 'Seguimiento Inteligente', desc: 'Monitorea tu progreso con métricas personalizadas', icon: <BarChart3 size={20} /> },
  { title: 'Multi-Usuario', desc: 'Crea perfiles independientes para cada miembro de tu familia', icon: <Users size={20} /> },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export default function IntroScreen() {
  const navigate = useNavigate()

  return (
    <div className="intro">
      {/* Background gradient orbs */}
      <div className="intro__orb intro__orb--1" />
      <div className="intro__orb intro__orb--2" />

      <motion.div
        className="intro__container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.div className="intro__logo-section" variants={itemVariants}>
          <h1 className="intro__logo">
            Suito<span>Focus</span>
          </h1>
          <p className="intro__tagline">Tu asistente personal de productividad y nutrición</p>
        </motion.div>

        {/* Features grid */}
        <motion.div className="intro__features" variants={itemVariants}>
          {features.map((f) => (
            <div key={f.title} className="intro__feature">
              <span className="intro__feature-icon">{f.icon}</span>
              <div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Disclaimer */}
        <motion.div className="intro__disclaimer" variants={itemVariants}>
          <div className="intro__disclaimer-badge"><Info size={14} /></div>
          <p>
            Esta aplicación proporciona información nutricional con fines orientativos.
            <strong> Se recomienda consultar con un especialista</strong> antes de realizar cambios
            significativos en tu dieta.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div className="intro__cta" variants={itemVariants}>
          <Button size="lg" onClick={() => navigate('/select-user')}>
            Comenzar
          </Button>
          <p className="intro__version">SuitoFocus © 2025 — v3.1 React</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
