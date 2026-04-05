import { motion } from 'framer-motion'
import './LotusElement.css'

export default function LotusElement({ progress = 0, isRunning, isComplete }) {
  // Petals bloom as progress increases (0 to 1)
  const petalCount = 8
  const bloomAngle = progress * 45 // Max 45 degrees of opening

  return (
    <div className={`lotus ${isRunning ? 'lotus--running' : ''} ${isComplete ? 'lotus--complete' : ''}`}>
      <div className="lotus__glow" />
      <svg viewBox="0 0 200 200" className="lotus__svg">
        {/* Water circle */}
        <circle cx="100" cy="140" r="50" className="lotus__water" />

        {/* Outer petals */}
        {Array.from({ length: petalCount }, (_, i) => {
          const angle = (360 / petalCount) * i - 90
          const openAngle = bloomAngle * (1 + Math.sin(i * 0.7) * 0.3)
          return (
            <motion.ellipse
              key={`outer-${i}`}
              cx="100"
              cy="100"
              rx="18"
              ry="40"
              className="lotus__petal lotus__petal--outer"
              style={{ transformOrigin: '100px 130px' }}
              animate={{
                rotate: angle + openAngle * (i % 2 === 0 ? 0.5 : -0.5),
                opacity: 0.3 + progress * 0.7,
              }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          )
        })}

        {/* Inner petals */}
        {Array.from({ length: petalCount }, (_, i) => {
          const angle = (360 / petalCount) * i + 22.5 - 90
          return (
            <motion.ellipse
              key={`inner-${i}`}
              cx="100"
              cy="105"
              rx="12"
              ry="30"
              className="lotus__petal lotus__petal--inner"
              style={{ transformOrigin: '100px 125px' }}
              animate={{
                rotate: angle + bloomAngle * 0.6 * (i % 2 === 0 ? 0.4 : -0.4),
                opacity: 0.4 + progress * 0.6,
              }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          )
        })}

        {/* Center */}
        <motion.circle
          cx="100"
          cy="110"
          r="10"
          className="lotus__center"
          animate={{ r: 8 + progress * 4, opacity: 0.5 + progress * 0.5 }}
          transition={{ duration: 0.8 }}
        />
      </svg>

      {/* Breathing text */}
      <div className="lotus__breathe">
        {isRunning ? 'Respira...' : isComplete ? '🙏 Namaste' : 'Presiona Iniciar'}
      </div>
    </div>
  )
}
