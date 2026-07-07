import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useTasks } from '../../hooks/useTasks'
import { PRIORITY_CONFIG } from '../../utils/format'

export default function TasksTab({ projectId }) {
  const { tasks, loading, addTask, toggleTask, updateTaskPriority, deleteTask } = useTasks(projectId)
  const [newTitle, setNewTitle] = useState('')
  const [newPriority, setNewPriority] = useState('med')

  async function handleAdd(e) {
    e.preventDefault()
    if (!newTitle.trim()) return
    await addTask(newTitle.trim(), newPriority)
    setNewTitle('')
    setNewPriority('med')
  }

  const pending = tasks.filter((t) => !t.is_done)
  const done = tasks.filter((t) => t.is_done)

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a task…"
          className="flex-1 rounded-md bg-surface border border-border px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none transition-colors"
        />
        <select
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value)}
          className="rounded-md bg-surface border border-border px-2.5 py-2 text-sm text-text-primary focus:border-accent focus:outline-none transition-colors"
        >
          {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>
        <button
          type="submit"
          disabled={!newTitle.trim()}
          className="rounded-md bg-accent hover:bg-accent-hover text-black px-3 py-2 disabled:opacity-50 transition-colors"
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
      </form>

      {loading ? (
        <div className="h-5 w-5 rounded-full border-2 border-border border-t-accent animate-spin" />
      ) : tasks.length === 0 ? (
        <p className="text-sm text-text-secondary">No tasks yet. Add one above.</p>
      ) : (
        <div className="space-y-1">
          {pending.map((task) => (
            <TaskRow key={task.id} task={task} onToggle={toggleTask} onPriority={updateTaskPriority} onDelete={deleteTask} />
          ))}
          {done.length > 0 && (
            <>
              <p className="text-xs text-text-tertiary pt-4 pb-1">Completed</p>
              {done.map((task) => (
                <TaskRow key={task.id} task={task} onToggle={toggleTask} onPriority={updateTaskPriority} onDelete={deleteTask} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}

function TaskRow({ task, onToggle, onPriority, onDelete }) {
  const priority = PRIORITY_CONFIG[task.priority]
  return (
    <div className="group flex items-center gap-3 rounded-md px-2.5 py-2 hover:bg-surface transition-colors">
      <input
        type="checkbox"
        checked={task.is_done}
        onChange={(e) => onToggle(task.id, e.target.checked)}
        className="h-4 w-4 rounded border-border-strong bg-surface accent-accent cursor-pointer"
      />
      <span className={`flex-1 text-sm ${task.is_done ? 'text-text-tertiary line-through' : 'text-text-primary'}`}>
        {task.title}
      </span>
      <select
        value={task.priority}
        onChange={(e) => onPriority(task.id, e.target.value)}
        className="text-xs rounded-full px-2 py-1 border-0 cursor-pointer focus:outline-none"
        style={{ backgroundColor: `${priority.color}1a`, color: priority.color }}
      >
        {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
          <option key={key} value={key}>{cfg.label}</option>
        ))}
      </select>
      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-danger transition-all"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}
