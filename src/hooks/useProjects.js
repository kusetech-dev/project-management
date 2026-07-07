import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useProjects() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProjects = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setProjects(data)
      setError(null)
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  async function createProject(project) {
    const { data, error } = await supabase
      .from('projects')
      .insert([{ ...project, user_id: user.id }])
      .select()
      .single()

    if (!error) {
      setProjects((prev) => [data, ...prev])
    }
    return { data, error }
  }

  async function updateProject(id, updates) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (!error) {
      setProjects((prev) => prev.map((p) => (p.id === id ? data : p)))
    }
    return { data, error }
  }

  async function deleteProject(id) {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (!error) {
      setProjects((prev) => prev.filter((p) => p.id !== id))
    }
    return { error }
  }

  return { projects, loading, error, createProject, updateProject, deleteProject, refetch: fetchProjects }
}
