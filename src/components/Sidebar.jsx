import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutGrid, FolderKanban, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Sidebar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    const { error } = await signOut()
    if (error) {
      console.error('Sign out failed:', error.message)
    }
    navigate('/login', { replace: true })
  }

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutGrid },
    { to: '/projects', label: 'Projects', icon: FolderKanban },
  ]

  return (
    <aside className="w-56 h-screen bg-base border-r border-border flex flex-col shrink-0">
      <div className="px-4 py-4 flex items-center gap-2 border-b border-border">
        <div className="h-6 w-6 rounded bg-accent-muted flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-accent" />
        </div>
        <span className="text-sm font-semibold text-text-primary">Workbench</span>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-surface text-text-primary'
                  : 'text-text-secondary hover:bg-surface hover:text-text-primary'
              }`
            }
          >
            <Icon size={16} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-2 py-3 border-t border-border">
        <div className="px-2.5 py-1.5 mb-1">
          <p className="text-xs text-text-tertiary truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-text-secondary hover:bg-surface hover:text-text-primary transition-colors"
        >
          <LogOut size={16} strokeWidth={2} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
