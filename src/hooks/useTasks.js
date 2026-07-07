import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useTasks(projectId) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTasks = useCallback(async () => {
    if (!projectId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true })

    if (!error) setTasks(data)
    setLoading(false)
  }, [projectId])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  async function addTask(title, priority = 'med') {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ project_id: projectId, title, priority }])
      .select()
      .single()

    if (!error) setTasks((prev) => [...prev, data])
    return { data, error }
  }

  async function toggleTask(id, is_done) {
    const { data, error } = await supabase
      .from('tasks')
      .update({ is_done })
      .eq('id', id)
      .select()
      .single()

    if (!error) setTasks((prev) => prev.map((t) => (t.id === id ? data : t)))
    return { data, error }
  }

  async function updateTaskPriority(id, priority) {
    const { data, error } = await supabase
      .from('tasks')
      .update({ priority })
      .eq('id', id)
      .select()
      .single()

    if (!error) setTasks((prev) => prev.map((t) => (t.id === id ? data : t)))
    return { data, error }
  }

  async function deleteTask(id) {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (!error) setTasks((prev) => prev.filter((t) => t.id !== id))
    return { error }
  }

  return { tasks, loading, addTask, toggleTask, updateTaskPriority, deleteTask }
}
