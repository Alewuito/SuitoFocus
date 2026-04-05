import { Routes, Route, Navigate } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import { TodoProvider } from './context/TodoContext'
import IntroScreen from './components/IntroScreen'
import UserSelection from './components/UserSelection'
import OnboardingWizard from './components/onboarding/OnboardingWizard'
import DashboardLayout from './components/layout/DashboardLayout'
import Dashboard from './components/dashboard/Dashboard'
import DietPlanView from './components/nutrition/DietPlanView'
import FocusMode from './components/focus/FocusMode'
import TrackerCalendar from './components/tracker/TrackerCalendar'
import RehabModule from './components/rehab/RehabModule'
import SettingsPanel from './components/settings/SettingsPanel'

export default function App() {
  return (
    <UserProvider>
      <TodoProvider>
        <Routes>
          <Route path="/" element={<IntroScreen />} />
          <Route path="/select-user" element={<UserSelection />} />
          <Route path="/onboarding" element={<OnboardingWizard />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/nutrition" element={<DietPlanView />} />
            <Route path="/tracker" element={<TrackerCalendar />} />
            <Route path="/rehab" element={<RehabModule />} />
            <Route path="/settings" element={<SettingsPanel />} />
          </Route>
          <Route path="/focus" element={<FocusMode />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TodoProvider>
    </UserProvider>
  )
}
