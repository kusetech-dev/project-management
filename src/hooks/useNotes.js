import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useNotes(projectId) {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchNotes = useCallback(async () => {
    if (!projectId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (!error) setNotes(data)
    setLoading(false)
  }, [projectId])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  async function addNote({ type, content, answer }) {
    const { data, error } = await supabase
      .from('notes')
      .insert([{ project_id: projectId, type, content, answer: answer || null, is_answered: !!answer }])
      .select()
      .single()

    if (!error) setNotes((prev) => [data, ...prev])
    return { data, error }
  }

  async function answerNote(id, answer) {
    const { data, error } = await supabase
      .from('notes')
      .update({ answer, is_answered: true })
      .eq('id', id)
      .select()
      .single()

    if (!error) setNotes((prev) => prev.map((n) => (n.id === id ? data : n)))
    return { data, error }
  }

  async function deleteNote(id) {
    const { error } = await supabase.from('notes').delete().eq('id', id)
    if (!error) setNotes((prev) => prev.filter((n) => n.id !== id))
    return { error }
  }

  return { notes, loading, addNote, answerNote, deleteNote }
}
