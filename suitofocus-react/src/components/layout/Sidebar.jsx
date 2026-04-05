import { NavLink, useNavigate } from 'react-router-dom'
import { Home, UtensilsCrossed, Crosshair, CalendarDays, HeartPulse, Settings } from 'lucide-react'
import { useUser } from '../../context/UserContext'
import './Sidebar.css'

const navItems = [
  { to: '/dashboard', label: 'Inicio', icon: <Home size={20} /> },
  { to: '/nutrition', label: 'Nutrición', icon: <UtensilsCrossed size={20} /> },
  { to: '/focus', label: 'Focus', icon: <Crosshair size={20} /> },
  { to: '/tracker', label: 'Seguimiento', icon: <CalendarDays size={20} /> },
  { to: '/rehab', label: 'Rehabilitación', icon: <HeartPulse size={20} /> },
  { to: '/settings', label: 'Ajustes', icon: <Settings size={20} /> },
]

export default function Sidebar() {
  const { currentUser, logoutUser } = useUser()
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutUser()
    navigate('/select-user')
  }

  const getInitials = (name) => name ? name.slice(0, 2).toUpperCase() : '??'

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">S<span>F</span></div>

      <nav className="sidebar__nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
            title={item.label}
          >
            {item.icon}
            <span className="sidebar__label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        {currentUser && (
          <button className="sidebar__user" onClick={handleLogout} title="Cerrar sesión">
            <div className="sidebar__avatar">{getInitials(currentUser.name)}</div>
          </button>
        )}
      </div>
    </aside>
  )
}
