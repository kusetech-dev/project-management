import { useState } from 'react'
import { Play, Trash2 } from 'lucide-react'
import { useTimeLogs } from '../../hooks/useTimeLogs'
import { useGlobalTimer } from '../../context/TimerContext'
import { formatDuration, formatDate } from '../../utils/format'

export default function TimeTab({ project }) {
  const { timeLogs, loading, addManualLog, deleteLog } = useTimeLogs(project.id)
  const { activeLog, activeProject, startTimer } = useGlobalTimer()
  const [showManual, setShowManual] = useState(false)

  const isTrackingThisProject = activeLog && activeProject?.id === project.id
  const isTrackingElsewhere = activeLog && activeProject?.id !== project.id

  const totalSeconds = timeLogs.reduce((sum, l) => sum + (l.duration_seconds || 0), 0)

  async function handleStart() {
    await startTimer(project.id, project.name)
  }

  return (
    <div className="max-w-2xl">
      <div className="rounded-lg border border-border bg-surface p-4 mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-text-secondary mb-1">Total logged</p>
          <p className="text-lg font-mono-data font-semibold text-text-primary">{formatDuration(totalSeconds)}</p>
        </div>

        {isTrackingThisProject ? (
          <span className="text-xs text-accent">Timer running — see bar below</span>
        ) : isTrackingElsewhere ? (
          <span className="text-xs text-text-tertiary">Timer running on another project</span>
        ) : (
          <button
            onClick={handleStart}
            className="flex items-center gap-1.5 rounded-full bg-accent hover:bg-accent-hover text-black font-medium px-4 py-2 text-sm transition-colors"
          >
            <Play size={13} fill="currentColor" />
            Start timer
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-text-primary">Log history</p>
        <button
          onClick={() => setShowManual((s) => !s)}
          className="text-xs text-text-secondary hover:text-accent transition-colors"
        >
          {showManual ? 'Cancel' : '+ Add manual entry'}
        </button>
      </div>

      {showManual && (
        <ManualLogForm
          onAdd={async (entry) => {
            await addManualLog(entry)
            setShowManual(false)
          }}
        />
      )}

      {loading ? (
        <div className="h-5 w-5 rounded-full border-2 border-border border-t-accent animate-spin" />
      ) : timeLogs.length === 0 ? (
        <p className="text-sm text-text-secondary">No time logged yet.</p>
      ) : (
        <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
          {timeLogs.map((log) => (
            <div key={log.id} className="group flex items-center justify-between px-4 py-2.5">
              <div>
                <p className="text-sm text-text-primary">
                  {log.note || 'Untitled session'}
                  {!log.end_time && <span className="text-accent ml-2 text-xs">● running</span>}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">{formatDate(log.start_time)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono-data text-text-secondary">
                  {log.duration_seconds ? formatDuration(log.duration_seconds) : '—'}
                </span>
                {log.end_time && (
                  <button
                    onClick={() => deleteLog(log.id)}
                    className="opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-danger transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ManualLogForm({ onAdd }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [hours, setHours] = useState('')
  const [minutes, setMinutes] = useState('')
  const [note, setNote] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const totalSeconds = (Number(hours) || 0) * 3600 + (Number(minutes) || 0) * 60
    if (totalSeconds <= 0) return
    await onAdd({
      start_time: `${date}T09:00:00`,
      duration_seconds: totalSeconds,
      note: note.trim() || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-surface p-4 mb-4 space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-xs text-text-secondary mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-md bg-base border border-border px-2.5 py-1.5 text-sm text-text-primary focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-text-secondary mb-1">Hours</label>
          <input
            type="number"
            min="0"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="0"
            className="w-full rounded-md bg-base border border-border px-2.5 py-1.5 text-sm text-text-primary font-mono-data focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-text-secondary mb-1">Minutes</label>
          <input
            type="number"
            min="0"
            max="59"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            placeholder="0"
            className="w-full rounded-md bg-base border border-border px-2.5 py-1.5 text-sm text-text-primary font-mono-data focus:border-accent focus:outline-none"
          />
        </div>
      </div>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="What did you work on? (optional)"
        className="w-full rounded-md bg-base border border-border px-2.5 py-1.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-full bg-accent hover:bg-accent-hover text-black text-sm font-medium px-4 py-1.5 transition-colors"
      >
        Add entry
      </button>
    </form>
  )
}
