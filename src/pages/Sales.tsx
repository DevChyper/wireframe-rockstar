import { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { ShoppingCart, Plus, Edit2, Trash2 } from 'lucide-react';
import { supabase, SalesOrder } from '../lib/supabase';

export function Sales() {
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    reference: '',
    customer_name: '',
    total_amount: '',
    status: 'pending' as 'pending' | 'confirmed' | 'shipped' | 'delivered',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const { data } = await supabase
      .from('sales_orders')
      .select('*')
      .order('date', { ascending: false });
    if (data) setOrders(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      reference: form.reference || `SO-${Date.now()}`,
      customer_name: form.customer_name,
      total_amount: parseFloat(form.total_amount) || 0,
      status: form.status,
      date: form.date,
    };

    if (editingId) {
      await supabase
        .from('sales_orders')
        .update(payload)
        .eq('id', editingId);
    } else {
      await supabase.from('sales_orders').insert(payload);
    }

    resetForm();
    loadOrders();
  }

  async function handleDelete(id: number) {
    if (confirm('Are you sure you want to delete this order?')) {
      await supabase.from('sales_orders').delete().eq('id', id);
      loadOrders();
    }
  }

  function handleEdit(order: SalesOrder) {
    setForm({
      reference: order.reference,
      customer_name: order.customer_name,
      total_amount: order.total_amount.toString(),
      status: order.status,
      date: order.date,
    });
    setEditingId(order.id);
    setShowForm(true);
  }

  function resetForm() {
    setForm({
      reference: '',
      customer_name: '',
      total_amount: '',
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
    });
    setEditingId(null);
    setShowForm(false);
  }

  const statusColors = {
    pending: 'bg-slate-100 text-slate-700',
    confirmed: 'bg-blue-100 text-blue-700',
    shipped: 'bg-amber-100 text-amber-700',
    delivered: 'bg-green-100 text-green-700',
  };

  return (
    <div className="flex-1 bg-slate-50">
      <PageHeader
        title="Sales Management"
        description="Manage sales orders and track customer transactions"
        icon={ShoppingCart}
        action={
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus size={20} />
            New Sales Order
          </button>
        }
      />

      <div className="p-6">
        {showForm && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              {editingId ? 'Edit Sales Order' : 'New Sales Order'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Order Reference
                  </label>
                  <input
                    type="text"
                    value={form.reference}
                    onChange={(e) => setForm({ ...form, reference: e.target.value })}
                    placeholder="Auto-generated if empty"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={form.customer_name}
                    onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Total Amount (IDR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.total_amount}
                    onChange={(e) => setForm({ ...form, total_amount: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Order Date
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Customer</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Amount</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No sales orders yet. Create your first order above.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{order.reference}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{order.customer_name}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        IDR {parseFloat(order.total_amount.toString()).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(order)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(order.id)}
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
