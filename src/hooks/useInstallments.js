import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useInstallments(projectId) {
  const [installments, setInstallments] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchInstallments = useCallback(async () => {
    if (!projectId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('installments')
      .select('*')
      .eq('project_id', projectId)
      .order('order_index', { ascending: true })

    if (!error) setInstallments(data)
    setLoading(false)
  }, [projectId])

  useEffect(() => {
    fetchInstallments()
  }, [fetchInstallments])

  async function addInstallment({ label, amount, due_date }) {
    const order_index = installments.length
    const { data, error } = await supabase
      .from('installments')
      .insert([{ project_id: projectId, label, amount, due_date, order_index }])
      .select()
      .single()

    if (!error) setInstallments((prev) => [...prev, data])
    return { data, error }
  }

  async function markPaid(id, is_paid) {
    const { data, error } = await supabase
      .from('installments')
      .update({ is_paid, paid_date: is_paid ? new Date().toISOString().slice(0, 10) : null })
      .eq('id', id)
      .select()
      .single()

    if (!error) setInstallments((prev) => prev.map((i) => (i.id === id ? data : i)))
    return { data, error }
  }

  async function deleteInstallment(id) {
    const { error } = await supabase.from('installments').delete().eq('id', id)
    if (!error) setInstallments((prev) => prev.filter((i) => i.id !== id))
    return { error }
  }

  return { installments, loading, addInstallment, markPaid, deleteInstallment }
}
