import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useTimeLogs(projectId) {
  const [timeLogs, setTimeLogs] = useState([])
  const [activeLog, setActiveLog] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchTimeLogs = useCallback(async () => {
    if (!projectId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('time_logs')
      .select('*')
      .eq('project_id', projectId)
      .order('start_time', { ascending: false })

    if (!error) {
      setTimeLogs(data)
      setActiveLog(data.find((log) => log.end_time === null) || null)
    }
    setLoading(false)
  }, [projectId])

  useEffect(() => {
    fetchTimeLogs()
  }, [fetchTimeLogs])

  async function startTimer(note = '') {
    const { data, error } = await supabase
      .from('time_logs')
      .insert([{ project_id: projectId, start_time: new Date().toISOString(), note }])
      .select()
      .single()

    if (!error) {
      setActiveLog(data)
      setTimeLogs((prev) => [data, ...prev])
    }
    return { data, error }
  }

  async function stopTimer(logId) {
    const log = timeLogs.find((l) => l.id === logId)
    const endTime = new Date()
    const durationSeconds = Math.round((endTime - new Date(log.start_time)) / 1000)

    const { data, error } = await supabase
      .from('time_logs')
      .update({ end_time: endTime.toISOString(), duration_seconds: durationSeconds })
      .eq('id', logId)
      .select()
      .single()

    if (!error) {
      setTimeLogs((prev) => prev.map((l) => (l.id === logId ? data : l)))
      setActiveLog(null)
    }
    return { data, error }
  }

  async function addManualLog({ start_time, duration_seconds, note }) {
    const startDate = new Date(start_time)
    const endDate = new Date(startDate.getTime() + duration_seconds * 1000)

    const { data, error } = await supabase
      .from('time_logs')
      .insert([{
        project_id: projectId,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        duration_seconds,
        note,
      }])
      .select()
      .single()

    if (!error) setTimeLogs((prev) => [data, ...prev])
    return { data, error }
  }

  async function deleteLog(id) {
    const { error } = await supabase.from('time_logs').delete().eq('id', id)
    if (!error) setTimeLogs((prev) => prev.filter((l) => l.id !== id))
    return { error }
  }

  return { timeLogs, activeLog, loading, startTimer, stopTimer, addManualLog, deleteLog }
}
