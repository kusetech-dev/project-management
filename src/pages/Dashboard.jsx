import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useProjects } from '../hooks/useProjects'
import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'
import StatusBadge from '../components/StatusBadge'
import { STATUS_CONFIG, formatMoney, formatDuration } from '../utils/format'

export default function Dashboard() {
  const { projects, loading } = useProjects()
  const [weekSeconds, setWeekSeconds] = useState(0)
  const [unpaidTotal, setUnpaidTotal] = useState(0)
  const [statsLoading, setStatsLoading] = useState(true)

  const activeProjects = useMemo(
    () => projects.filter((p) => ['confirmed', 'in_progress'].includes(p.status)),
    [projects]
  )

  useEffect(() => {
    async function loadStats() {
      if (projects.length === 0) {
        setStatsLoading(false)
        return
      }
      const projectIds = projects.map((p) => p.id)

      // Hours logged in the last 7 days across all projects.
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const { data: logs } = await supabase
        .from('time_logs')
        .select('duration_seconds, start_time')
        .in('project_id', projectIds)
        .gte('start_time', sevenDaysAgo.toISOString())
        .not('duration_seconds', 'is', null)

      const totalSeconds = (logs || []).reduce((sum, l) => sum + (l.duration_seconds || 0), 0)
      setWeekSeconds(totalSeconds)

      // Unpaid installment total across all projects.
      const { data: installments } = await supabase
        .from('installments')
        .select('amount, is_paid, project_id')
        .in('project_id', projectIds)
        .eq('is_paid', false)

      const unpaid = (installments || []).reduce((sum, i) => sum + Number(i.amount), 0)
      setUnpaidTotal(unpaid)

      setStatsLoading(false)
    }
    loadStats()
  }, [projects])

  if (loading) {
    return (
      <div className="p-8">
        <div className="h-5 w-5 rounded-full border-2 border-border border-t-accent animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-xl font-semibold text-text-primary mb-1">Dashboard</h1>
      <p className="text-sm text-text-secondary mb-8">A quick look at where things stand.</p>

      <div className="grid grid-cols-3 gap-4 mb-10">
        <StatCard label="Active projects" value={activeProjects.length} />
        <StatCard
          label="Hours this week"
          value={statsLoading ? '—' : formatDuration(weekSeconds)}
        />
        <StatCard
          label="Outstanding payments"
          value={statsLoading ? '—' : formatMoney(unpaidTotal)}
          accent
        />
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-text-primary">Active work</h2>
        <Link to="/projects" className="text-xs text-text-secondary hover:text-accent transition-colors">
          View all projects →
        </Link>
      </div>

      {activeProjects.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface p-8 text-center">
          <p className="text-sm text-text-secondary">No active projects yet.</p>
          <Link to="/projects" className="text-sm text-accent hover:text-accent-hover mt-2 inline-block">
            Create your first project →
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
          {activeProjects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-surface-hover transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-text-primary">{project.name}</p>
                {project.client_name && (
                  <p className="text-xs text-text-secondary mt-0.5">{project.client_name}</p>
                )}
              </div>
              <StatusBadge config={STATUS_CONFIG[project.status]} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="text-xs text-text-secondary mb-2">{label}</p>
      <p className={`text-2xl font-mono-data font-semibold ${accent ? 'text-accent' : 'text-text-primary'}`}>
        {value}
      </p>
    </div>
  )
}
