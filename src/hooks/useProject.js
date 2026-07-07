import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useProject(projectId) {
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProject = useCallback(async () => {
    if (!projectId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()

    if (error) {
      setError(error.message)
    } else {
      setProject(data)
      setError(null)
    }
    setLoading(false)
  }, [projectId])

  useEffect(() => {
    fetchProject()
  }, [fetchProject])

  async function updateProject(updates) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single()

    if (!error) {
      setProject(data)
    }
    return { data, error }
  }

  return { project, loading, error, updateProject, refetch: fetchProject }
}
