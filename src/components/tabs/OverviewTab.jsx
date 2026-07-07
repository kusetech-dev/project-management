import { STATUS_CONFIG, formatMoney, formatDate } from '../../utils/format'
import StatusBadge from '../StatusBadge'

const STATUS_FLOW = ['inquiry', 'confirmed', 'in_progress', 'completed', 'on_hold', 'cancelled']

export default function OverviewTab({ project, onUpdate }) {
  async function handleStatusChange(newStatus) {
    await onUpdate({ status: newStatus })
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <p className="text-xs font-medium text-text-secondary mb-2">Status</p>
        <div className="flex flex-wrap gap-2">
          {STATUS_FLOW.map((status) => {
            const config = STATUS_CONFIG[status]
            const isActive = project.status === status
            return (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                  isActive
                    ? 'border-transparent'
                    : 'border-border text-text-secondary hover:border-border-strong hover:text-text-primary'
                }`}
                style={isActive ? { backgroundColor: `${config.color}1a`, color: config.color } : {}}
              >
                {config.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InfoCard label="Client" value={project.client_name || '—'} />
        <InfoCard label="Total agreed" value={formatMoney(project.total_amount)} mono />
        <InfoCard label="Created" value={formatDate(project.created_at)} />
        <InfoCard label="Last updated" value={formatDate(project.updated_at)} />
      </div>

      {project.description && (
        <div>
          <p className="text-xs font-medium text-text-secondary mb-2">Description</p>
          <p className="text-sm text-text-primary leading-relaxed bg-surface border border-border rounded-lg p-4">
            {project.description}
          </p>
        </div>
      )}
    </div>
  )
}

function InfoCard({ label, value, mono }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-3.5">
      <p className="text-xs text-text-secondary mb-1.5">{label}</p>
      <p className={`text-sm text-text-primary ${mono ? 'font-mono-data' : ''}`}>{value}</p>
    </div>
  )
}
