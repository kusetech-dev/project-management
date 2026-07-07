import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TimerBar from './TimerBar'

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-base overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-12">
        <Outlet />
      </main>
      <TimerBar />
    </div>
  )
}
