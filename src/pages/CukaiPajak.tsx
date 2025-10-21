import { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { FileText, Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { supabase, TaxRecord } from '../lib/supabase';

export function CukaiPajak() {
  const [records, setRecords] = useState<TaxRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    reference: '',
    type: 'ppn' as 'ppn' | 'pph' | 'cukai',
    period: '',
    amount: '',
    status: 'pending' as 'pending' | 'filed' | 'paid',
    due_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadRecords();
  }, []);

  async function loadRecords() {
    const { data } = await supabase
      .from('tax_records')
      .select('*')
      .order('due_date', { ascending: false });
    if (data) setRecords(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      reference: form.reference || `TAX-${Date.now()}`,
      type: form.type,
      period: form.period,
      amount: parseFloat(form.amount) || 0,
      status: form.status,
      due_date: form.due_date,
    };

    if (editingId) {
      await supabase
        .from('tax_records')
        .update(payload)
        .eq('id', editingId);
    } else {
      await supabase.from('tax_records').insert(payload);
    }

    resetForm();
    loadRecords();
  }

  async function handleDelete(id: number) {
    if (confirm('Are you sure you want to delete this tax record?')) {
      await supabase.from('tax_records').delete().eq('id', id);
      loadRecords();
    }
  }

  function handleEdit(record: TaxRecord) {
    setForm({
      reference: record.reference,
      type: record.type,
      period: record.period,
      amount: record.amount.toString(),
      status: record.status,
      due_date: record.due_date,
    });
    setEditingId(record.id);
    setShowForm(true);
  }

  function resetForm() {
    setForm({
      reference: '',
      type: 'ppn',
      period: '',
      amount: '',
      status: 'pending',
      due_date: new Date().toISOString().split('T')[0],
    });
    setEditingId(null);
    setShowForm(false);
  }

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    filed: 'bg-blue-100 text-blue-700',
    paid: 'bg-green-100 text-green-700',
  };

  const typeLabels = {
    ppn: 'PPN (VAT)',
    pph: 'PPh (Income Tax)',
    cukai: 'Cukai (Excise)',
  };

  return (
    <div className="flex-1 bg-slate-50">
      <PageHeader
        title="Cukai & Pajak"
        description="Manage tax obligations and compliance records"
        icon={FileText}
        action={
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus size={20} />
            New Tax Record
          </button>
        }
      />

      <div className="p-6">
        {showForm && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              {editingId ? 'Edit Tax Record' : 'New Tax Record'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Reference Number
                  </label>
                  <input
                    type="text"
                    value={form.reference}
                    onChange={(e) => setForm({ ...form, reference: e.target.value })}
                    placeholder="Auto-generated if empty"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tax Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="ppn">PPN (VAT)</option>
                    <option value="pph">PPh (Income Tax)</option>
                    <option value="cukai">Cukai (Excise)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Period (YYYY-MM)
                  </label>
                  <input
                    type="text"
                    value={form.period}
                    onChange={(e) => setForm({ ...form, period: e.target.value })}
                    placeholder="e.g., 2025-01"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Amount (IDR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="filed">Filed</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={form.due_date}
                    onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  {editingId ? 'Update' : 'Create'} Record
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Reference</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Type</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Period</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Amount</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Due Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      No tax records yet. Create your first record above.
                    </td>
                  </tr>
                ) : (
                  records.map((record) => {
                    const isOverdue = new Date(record.due_date) < new Date() && record.status !== 'paid';
                    return (
                      <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{record.reference}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{typeLabels[record.type]}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{record.period}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          IDR {parseFloat(record.amount.toString()).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[record.status]}`}>
                            {record.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {isOverdue && (
                              <AlertCircle size={16} className="text-red-500" />
                            )}
                            <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-slate-600'}`}>
                              {new Date(record.due_date).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(record)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(record.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
