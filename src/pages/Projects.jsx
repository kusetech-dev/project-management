import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useProjects } from '../hooks/useProjects'
import NewProjectModal from '../components/NewProjectModal'
import StatusBadge from '../components/StatusBadge'
import { STATUS_CONFIG, formatMoney } from '../utils/format'

export default function Projects() {
  const { projects, loading, createProject } = useProjects()
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-text-primary mb-1">Projects</h1>
          <p className="text-sm text-text-secondary">Everything you're working on, in one place.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-full bg-accent hover:bg-accent-hover text-black font-medium px-4 py-2 text-sm transition-colors"
        >
          <Plus size={15} strokeWidth={2.5} />
          New project
        </button>
      </div>

      {loading ? (
        <div className="h-5 w-5 rounded-full border-2 border-border border-t-accent animate-spin" />
      ) : projects.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface p-12 text-center">
          <p className="text-sm text-text-secondary mb-3">No projects yet.</p>
          <button onClick={() => setShowModal(true)} className="text-sm text-accent hover:text-accent-hover">
            Create your first project →
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="flex items-center justify-between px-4 py-3.5 hover:bg-surface-hover transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{project.name}</p>
                {project.client_name && (
                  <p className="text-xs text-text-secondary mt-0.5">{project.client_name}</p>
                )}
              </div>
              <div className="flex items-center gap-4 shrink-0 ml-4">
                <span className="text-sm font-mono-data text-text-secondary">
                  {formatMoney(project.total_amount)}
                </span>
                <StatusBadge config={STATUS_CONFIG[project.status]} />
              </div>
            </Link>
          ))}
        </div>
      )}

      {showModal && (
        <NewProjectModal onClose={() => setShowModal(false)} onCreate={createProject} />
      )}
    </div>
  )
}
