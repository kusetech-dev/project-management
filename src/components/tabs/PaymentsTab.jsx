import { useState } from 'react'
import { Plus, Trash2, Check } from 'lucide-react'
import { useInstallments } from '../../hooks/useInstallments'
import { formatMoney, formatDate } from '../../utils/format'

export default function PaymentsTab({ project }) {
  const { installments, loading, addInstallment, markPaid, deleteInstallment } = useInstallments(project.id)
  const [showForm, setShowForm] = useState(false)

  const paidTotal = installments.filter((i) => i.is_paid).reduce((sum, i) => sum + Number(i.amount), 0)
  const totalPlanned = installments.reduce((sum, i) => sum + Number(i.amount), 0)
  const paidCount = installments.filter((i) => i.is_paid).length

  return (
    <div className="max-w-2xl">
      <div className="grid grid-cols-3 gap-3 mb-6">
        <SummaryCard label="Agreed total" value={formatMoney(project.total_amount)} />
        <SummaryCard label="Received" value={formatMoney(paidTotal)} accent />
        <SummaryCard label="Installments" value={`${paidCount} / ${installments.length} paid`} />
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-text-primary">Installments</p>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-1 text-xs text-text-secondary hover:text-accent transition-colors"
        >
          <Plus size={13} />
          {showForm ? 'Cancel' : 'Add installment'}
        </button>
      </div>

      {showForm && (
        <InstallmentForm
          isFirst={installments.length === 0}
          onAdd={async (entry) => {
            await addInstallment(entry)
            setShowForm(false)
          }}
        />
      )}

      {loading ? (
        <div className="h-5 w-5 rounded-full border-2 border-border border-t-accent animate-spin" />
      ) : installments.length === 0 ? (
        <p className="text-sm text-text-secondary">
          No installments yet. The first one you add is treated as the advance — once it's marked paid, you can confirm the project in the Overview tab.
        </p>
      ) : (
        <div className="rounded-lg border border-border bg-surface divide-y divide-border overflow-hidden">
          {installments.map((inst, idx) => (
            <div key={inst.id} className="group flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => markPaid(inst.id, !inst.is_paid)}
                  className={`h-5 w-5 rounded-full border flex items-center justify-center transition-colors ${
                    inst.is_paid
                      ? 'bg-accent border-accent text-black'
                      : 'border-border-strong text-transparent hover:border-accent'
                  }`}
                >
                  <Check size={12} strokeWidth={3} />
                </button>
                <div>
                  <p className="text-sm text-text-primary">
                    {inst.label}
                    {idx === 0 && <span className="ml-2 text-xs text-text-tertiary">(advance)</span>}
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {inst.is_paid ? `Paid ${formatDate(inst.paid_date)}` : inst.due_date ? `Due ${formatDate(inst.due_date)}` : 'No due date'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono-data text-text-primary">{formatMoney(inst.amount)}</span>
                <button
                  onClick={() => deleteInstallment(inst.id)}
                  className="opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-danger transition-all"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPlanned > 0 && totalPlanned !== Number(project.total_amount) && (
        <p className="text-xs text-warning mt-3">
          Installments total {formatMoney(totalPlanned)}, which doesn't match the agreed amount of {formatMoney(project.total_amount)}.
        </p>
      )}
    </div>
  )
}

function SummaryCard({ label, value, accent }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-3.5">
      <p className="text-xs text-text-secondary mb-1.5">{label}</p>
      <p className={`text-sm font-mono-data font-semibold ${accent ? 'text-accent' : 'text-text-primary'}`}>{value}</p>
    </div>
  )
}

function InstallmentForm({ isFirst, onAdd }) {
  const [label, setLabel] = useState(isFirst ? 'Advance' : '')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!label.trim() || !amount) return
    await onAdd({ label: label.trim(), amount: Number(amount), due_date: dueDate || null })
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-surface p-4 mb-4 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-text-secondary mb-1">Label</label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Milestone 2"
            className="w-full rounded-md bg-base border border-border px-2.5 py-1.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-text-secondary mb-1">Amount (₹)</label>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full rounded-md bg-base border border-border px-2.5 py-1.5 text-sm text-text-primary font-mono-data placeholder:text-text-tertiary focus:border-accent focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs text-text-secondary mb-1">Due date (optional)</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full rounded-md bg-base border border-border px-2.5 py-1.5 text-sm text-text-primary focus:border-accent focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="rounded-full bg-accent hover:bg-accent-hover text-black text-sm font-medium px-4 py-1.5 transition-colors"
      >
        Add installment
      </button>
    </form>
  )
}
