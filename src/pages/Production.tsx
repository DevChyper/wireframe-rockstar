import { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Factory, Plus, Edit2, Trash2, Calendar, Package } from 'lucide-react';
import { supabase, ProductionRecord } from '../lib/supabase';

export function Production() {
  const [records, setRecords] = useState<ProductionRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    reference: '',
    product_name: '',
    quantity: '',
    status: 'planned' as 'planned' | 'in_progress' | 'completed',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadRecords();
  }, []);

  async function loadRecords() {
    const { data } = await supabase
      .from('production_records')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setRecords(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      reference: form.reference || `PRD-${Date.now()}`,
      product_name: form.product_name,
      quantity: parseInt(form.quantity) || 0,
      status: form.status,
      date: form.date,
    };

    if (editingId) {
      await supabase
        .from('production_records')
        .update(payload)
        .eq('id', editingId);
    } else {
      await supabase.from('production_records').insert(payload);
    }

    resetForm();
    loadRecords();
  }

  async function handleDelete(id: number) {
    if (confirm('Are you sure you want to delete this record?')) {
      await supabase.from('production_records').delete().eq('id', id);
      loadRecords();
    }
  }

  function handleEdit(record: ProductionRecord) {
    setForm({
      reference: record.reference,
      product_name: record.product_name,
      quantity: record.quantity.toString(),
      status: record.status,
      date: record.date,
    });
    setEditingId(record.id);
    setShowForm(true);
  }

  function resetForm() {
    setForm({
      reference: '',
      product_name: '',
      quantity: '',
      status: 'planned',
      date: new Date().toISOString().split('T')[0],
    });
    setEditingId(null);
    setShowForm(false);
  }

  const statusColors = {
    planned: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-amber-100 text-amber-700',
    completed: 'bg-green-100 text-green-700',
  };

  return (
    <div className="flex-1 bg-slate-50">
      <PageHeader
        title="Production Management"
        description="Manage production orders and track manufacturing status"
        icon={Factory}
        action={
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            New Production Order
          </button>
        }
      />

      <div className="p-6">
        {showForm && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              {editingId ? 'Edit Production Order' : 'New Production Order'}
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={form.product_name}
                    onChange={(e) => setForm({ ...form, product_name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="planned">Planned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Production Date
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingId ? 'Update' : 'Create'} Order
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
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Product</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Quantity</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No production records yet. Create your first order above.
                    </td>
                  </tr>
                ) : (
                  records.map((record) => (
                    <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{record.reference}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{record.product_name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{record.quantity.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[record.status]}`}>
                          {record.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(record.date).toLocaleDateString()}
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
