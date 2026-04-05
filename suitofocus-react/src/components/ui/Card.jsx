import { motion } from 'framer-motion'
import './Card.css'

export default function Card({ children, className = '', glow = false, onClick, ...props }) {
  return (
    <motion.div
      className={`sf-card ${glow ? 'sf-card--glow' : ''} ${onClick ? 'sf-card--clickable' : ''} ${className}`}
      whileHover={onClick ? { y: -2 } : undefined}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  )
}
