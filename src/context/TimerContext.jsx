import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const TimerContext = createContext(undefined)

export function TimerProvider({ children }) {
  const { user } = useAuth()
  const [activeLog, setActiveLog] = useState(null)
  const [activeProject, setActiveProject] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkActiveTimer = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }
    // Find any running time log across all of this user's projects.
    const { data, error } = await supabase
      .from('time_logs')
      .select('*, projects!inner(id, name, user_id)')
      .eq('projects.user_id', user.id)
      .is('end_time', null)
      .order('start_time', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!error && data) {
      setActiveLog(data)
      setActiveProject(data.projects)
    } else {
      setActiveLog(null)
      setActiveProject(null)
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    checkActiveTimer()
  }, [checkActiveTimer])

  async function startTimer(projectId, projectName, note = '') {
    const { data, error } = await supabase
      .from('time_logs')
      .insert([{ project_id: projectId, start_time: new Date().toISOString(), note }])
      .select()
      .single()

    if (!error) {
      setActiveLog(data)
      setActiveProject({ id: projectId, name: projectName })
    }
    return { data, error }
  }

  async function stopTimer() {
    if (!activeLog) return { error: 'No active timer' }
    const endTime = new Date()
    const durationSeconds = Math.round((endTime - new Date(activeLog.start_time)) / 1000)

    const { data, error } = await supabase
      .from('time_logs')
      .update({ end_time: endTime.toISOString(), duration_seconds: durationSeconds })
      .eq('id', activeLog.id)
      .select()
      .single()

    if (!error) {
      setActiveLog(null)
      setActiveProject(null)
    }
    return { data, error }
  }

  const value = { activeLog, activeProject, loading, startTimer, stopTimer, refetch: checkActiveTimer }

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
}

export function useGlobalTimer() {
  const ctx = useContext(TimerContext)
  if (ctx === undefined) {
    throw new Error('useGlobalTimer must be used within a TimerProvider')
  }
  return ctx
}
