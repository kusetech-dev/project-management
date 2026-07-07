import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useNotes } from '../../hooks/useNotes'
import { formatDate } from '../../utils/format'

export default function NotesTab({ projectId }) {
  const { notes, loading, addNote, answerNote, deleteNote } = useNotes(projectId)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')

  const filtered = notes.filter((n) => {
    if (filter === 'all') return true
    if (filter === 'open') return n.type === 'question' && !n.is_answered
    if (filter === 'general') return n.type === 'general'
    return true
  })

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1">
          {[
            ['all', 'All'],
            ['open', 'Open questions'],
            ['general', 'Notes'],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filter === key ? 'bg-accent-muted text-accent' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-1 text-xs text-text-secondary hover:text-accent transition-colors"
        >
          <Plus size={13} />
          {showForm ? 'Cancel' : 'Add note'}
        </button>
      </div>

      {showForm && (
        <NoteForm
          onAdd={async (entry) => {
            await addNote(entry)
            setShowForm(false)
          }}
        />
      )}

      {loading ? (
        <div className="h-5 w-5 rounded-full border-2 border-border border-t-accent animate-spin" />
      ) : filtered.length === 0 ? (
        <p className="text-sm text-text-secondary">Nothing here yet.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((note) => (
            <NoteCard key={note.id} note={note} onAnswer={answerNote} onDelete={deleteNote} />
          ))}
        </div>
      )}
    </div>
  )
}

function NoteCard({ note, onAnswer, onDelete }) {
  const [answering, setAnswering] = useState(false)
  const [answerText, setAnswerText] = useState('')

  async function handleSubmitAnswer(e) {
    e.preventDefault()
    if (!answerText.trim()) return
    await onAnswer(note.id, answerText.trim())
    setAnswering(false)
  }

  const isOpenQuestion = note.type === 'question' && !note.is_answered

  return (
    <div className="group rounded-lg border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            {note.type === 'question' && (
              <span
                className="text-xs font-medium rounded-full px-2 py-0.5"
                style={{
                  backgroundColor: isOpenQuestion ? '#f0b4291a' : '#4ade801a',
                  color: isOpenQuestion ? '#f0b429' : '#4ade80',
                }}
              >
                {isOpenQuestion ? 'Open question' : 'Answered'}
              </span>
            )}
            <span className="text-xs text-text-tertiary">{formatDate(note.created_at)}</span>
          </div>
          <p className="text-sm text-text-primary">{note.content}</p>

          {note.answer && (
            <div className="mt-2 pl-3 border-l-2 border-border-strong">
              <p className="text-xs text-text-secondary mb-0.5">Answer</p>
              <p className="text-sm text-text-primary">{note.answer}</p>
            </div>
          )}

          {isOpenQuestion && !answering && (
            <button
              onClick={() => setAnswering(true)}
              className="text-xs text-accent hover:text-accent-hover mt-2 transition-colors"
            >
              + Add answer
            </button>
          )}

          {answering && (
            <form onSubmit={handleSubmitAnswer} className="mt-2 flex gap-2">
              <input
                autoFocus
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Type the answer…"
                className="flex-1 rounded-md bg-base border border-border px-2.5 py-1.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-md bg-accent hover:bg-accent-hover text-black text-xs font-medium px-3 transition-colors"
              >
                Save
              </button>
            </form>
          )}
        </div>
        <button
          onClick={() => onDelete(note.id)}
          className="opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-danger transition-all shrink-0"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

function NoteForm({ onAdd }) {
  const [type, setType] = useState('general')
  const [content, setContent] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!content.trim()) return
    await onAdd({ type, content: content.trim() })
    setContent('')
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-surface p-4 mb-4 space-y-3">
      <div className="flex gap-2">
        {[
          ['general', 'Note'],
          ['question', 'Question'],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setType(key)}
            className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
              type === key ? 'bg-accent-muted text-accent border-transparent' : 'border-border text-text-secondary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <textarea
        autoFocus
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={type === 'question' ? 'What do you need to ask the client?' : "What's on your mind?"}
        rows={2}
        className="w-full rounded-md bg-base border border-border px-2.5 py-1.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none resize-none"
      />
      <button
        type="submit"
        className="rounded-full bg-accent hover:bg-accent-hover text-black text-sm font-medium px-4 py-1.5 transition-colors"
      >
        Add
      </button>
    </form>
  )
}
