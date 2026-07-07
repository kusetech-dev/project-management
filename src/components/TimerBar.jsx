import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Square } from 'lucide-react'
import { useGlobalTimer } from '../context/TimerContext'
import { formatElapsed } from '../utils/format'

export default function TimerBar() {
  const { activeLog, activeProject, stopTimer } = useGlobalTimer()
  const [elapsed, setElapsed] = useState(0)
  const [stopping, setStopping] = useState(false)

  useEffect(() => {
    if (!activeLog) return

    function tick() {
      const startMs = new Date(activeLog.start_time).getTime()
      setElapsed(Math.floor((Date.now() - startMs) / 1000))
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [activeLog])

  if (!activeLog || !activeProject) return null

  async function handleStop() {
    setStopping(true)
    await stopTimer()
    setStopping(false)
  }

  return (
    <div className="fixed bottom-0 left-56 right-0 h-12 bg-surface border-t border-border flex items-center justify-between px-4 z-40">
      <div className="flex items-center gap-3">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
        </span>
        <span className="text-sm text-text-secondary">Tracking</span>
        <Link to={`/projects/${activeProject.id}`} className="text-sm font-medium text-text-primary hover:text-accent transition-colors">
          {activeProject.name}
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-mono-data text-sm text-text-primary tabular-nums">
          {formatElapsed(elapsed)}
        </span>
        <button
          onClick={handleStop}
          disabled={stopping}
          className="flex items-center gap-1.5 rounded-full bg-danger/10 hover:bg-danger/20 text-danger px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50"
        >
          <Square size={11} fill="currentColor" />
          Stop
        </button>
      </div>
    </div>
  )
}
