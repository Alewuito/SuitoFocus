import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUser } from '../context/UserContext'
import Button from './ui/Button'
import './UserSelection.css'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}
const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
}

export default function UserSelection() {
  const { users, loginUser, deleteUser } = useUser()
  const navigate = useNavigate()

  const handleSelect = (userId) => {
    loginUser(userId)
    navigate('/dashboard')
  }

  const handleDelete = (e, userId) => {
    e.stopPropagation()
    if (window.confirm('¿Eliminar este perfil? Se perderán todos sus datos.')) {
      deleteUser(userId)
    }
  }

  const getInitials = (name) => name ? name.slice(0, 2).toUpperCase() : '??'
  const colors = ['#6c63ff', '#00d9a6', '#f5a623', '#ff4d6a', '#38bdf8', '#a78bfa']

  return (
    <div className="user-select">
      <div className="user-select__orb user-select__orb--1" />
      <motion.div
        className="user-select__container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="user-select__title">Suito<span>Focus</span></h1>
        <p className="user-select__subtitle">Selecciona tu perfil o crea uno nuevo</p>

        <motion.div
          className="user-select__grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {users.map((user, i) => (
            <motion.div
              key={user.id}
              className="user-select__card"
              variants={cardVariants}
              whileHover={{ y: -4, borderColor: 'rgba(108,99,255,0.4)' }}
              onClick={() => handleSelect(user.id)}
            >
              <div
                className="user-select__avatar"
                style={{ background: colors[i % colors.length] }}
              >
                {getInitials(user.name)}
              </div>
              <span className="user-select__name">{user.name}</span>
              <button
                className="user-select__delete"
                onClick={(e) => handleDelete(e, user.id)}
                aria-label="Eliminar perfil"
              >×</button>
            </motion.div>
          ))}

          {/* Add new user */}
          <motion.div
            className="user-select__card user-select__card--new"
            variants={cardVariants}
            whileHover={{ y: -4, borderColor: 'rgba(108,99,255,0.4)' }}
            onClick={() => navigate('/onboarding')}
          >
            <div className="user-select__avatar user-select__avatar--new">+</div>
            <span className="user-select__name">Nuevo Perfil</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
