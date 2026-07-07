import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { useProject } from '../hooks/useProject'
import OverviewTab from '../components/tabs/OverviewTab'
import TasksTab from '../components/tabs/TasksTab'
import TimeTab from '../components/tabs/TimeTab'
import PaymentsTab from '../components/tabs/PaymentsTab'
import NotesTab from '../components/tabs/NotesTab'
import { supabase } from '../lib/supabase'

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'tasks', label: 'Tasks' },
  { key: 'time', label: 'Time' },
  { key: 'payments', label: 'Payments' },
  { key: 'notes', label: 'Notes' },
]

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { project, loading, updateProject } = useProject(id)
  const [activeTab, setActiveTab] = useState('overview')

  async function handleDelete() {
    if (!confirm('Delete this project? This removes all its tasks, time logs, payments, and notes.')) return
    await supabase.from('projects').delete().eq('id', id)
    navigate('/projects')
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="h-5 w-5 rounded-full border-2 border-border border-t-accent animate-spin" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="p-8">
        <p className="text-sm text-text-secondary">Project not found.</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl">
      <Link to="/projects" className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors mb-4">
        <ArrowLeft size={13} />
        Projects
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">{project.name}</h1>
          {project.client_name && (
            <p className="text-sm text-text-secondary mt-1">{project.client_name}</p>
          )}
        </div>
        <button
          onClick={handleDelete}
          className="text-text-tertiary hover:text-danger transition-colors p-1.5"
          title="Delete project"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex gap-1 border-b border-border mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3.5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-accent text-text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && <OverviewTab project={project} onUpdate={updateProject} />}
      {activeTab === 'tasks' && <TasksTab projectId={project.id} />}
      {activeTab === 'time' && <TimeTab project={project} />}
      {activeTab === 'payments' && <PaymentsTab project={project} />}
      {activeTab === 'notes' && <NotesTab projectId={project.id} />}
    </div>
  )
}
