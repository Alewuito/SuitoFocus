import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import './DashboardLayout.css'

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-layout__main">
        <Outlet />
      </main>
    </div>
  )
}
