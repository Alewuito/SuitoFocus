import { motion } from 'framer-motion'
import './Button.css'

export default function Button({
  children,
  variant = 'primary', // primary | ghost | danger | outline
  size = 'md',         // sm | md | lg
  icon,
  className = '',
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`sf-btn sf-btn--${variant} sf-btn--${size} ${className}`}
      {...props}
    >
      {icon && <span className="sf-btn__icon">{icon}</span>}
      {children}
    </motion.button>
  )
}
