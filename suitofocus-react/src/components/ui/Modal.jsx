import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import './Modal.css'

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="sf-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`sf-modal sf-modal--${size}`}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
          >
            {title && (
              <div className="sf-modal__header">
                <h3>{title}</h3>
                <button className="sf-modal__close" onClick={onClose} aria-label="Cerrar">×</button>
              </div>
            )}
            <div className="sf-modal__body">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
