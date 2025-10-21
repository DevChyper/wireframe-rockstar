import { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Package, Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { supabase, InventoryItem } from '../lib/supabase';

export function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    sku: '',
    name: '',
    quantity: '',
    unit: 'pcs',
    min_stock: '',
    location: '',
  });

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    const { data } = await supabase
      .from('inventory_items')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setItems(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      sku: form.sku || `SKU-${Date.now()}`,
      name: form.name,
      quantity: parseInt(form.quantity) || 0,
      unit: form.unit,
      min_stock: parseInt(form.min_stock) || 0,
      location: form.location,
    };

    if (editingId) {
      await supabase
        .from('inventory_items')
        .update(payload)
        .eq('id', editingId);
    } else {
      await supabase.from('inventory_items').insert(payload);
    }

    resetForm();
    loadItems();
  }

  async function handleDelete(id: number) {
    if (confirm('Are you sure you want to delete this item?')) {
      await supabase.from('inventory_items').delete().eq('id', id);
      loadItems();
    }
  }

  function handleEdit(item: InventoryItem) {
    setForm({
      sku: item.sku,
      name: item.name,
      quantity: item.quantity.toString(),
      unit: item.unit,
      min_stock: item.min_stock.toString(),
      location: item.location,
    });
    setEditingId(item.id);
    setShowForm(true);
  }

  function resetForm() {
    setForm({
      sku: '',
      name: '',
      quantity: '',
      unit: 'pcs',
      min_stock: '',
      location: '',
    });
    setEditingId(null);
    setShowForm(false);
  }

  return (
    <div className="flex-1 bg-slate-50">
      <PageHeader
        title="Inventory Management"
        description="Track stock levels and manage warehouse inventory"
        icon={Package}
        action={
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={20} />
            Add Inventory Item
          </button>
        }
      />

      <div className="p-6">
        {showForm && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              {editingId ? 'Edit Inventory Item' : 'New Inventory Item'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    placeholder="Auto-generated if empty"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Unit
                  </label>
                  <select
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="pcs">Pieces</option>
                    <option value="kg">Kilograms</option>
                    <option value="ltr">Liters</option>
                    <option value="box">Boxes</option>
                    <option value="pallet">Pallets</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Minimum Stock
                  </label>
                  <input
                    type="number"
                    value={form.min_stock}
                    onChange={(e) => setForm({ ...form, min_stock: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g., Warehouse A, Shelf B3"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {editingId ? 'Update' : 'Add'} Item
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
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">SKU</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Item Name</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Quantity</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Unit</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Min Stock</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Location</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                      No inventory items yet. Add your first item above.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => {
                    const isLowStock = item.quantity <= item.min_stock;
                    return (
                      <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.sku}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{item.name}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{item.quantity.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{item.unit}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{item.min_stock.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{item.location}</td>
                        <td className="px-6 py-4">
                          {isLowStock ? (
                            <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium w-fit">
                              <AlertTriangle size={12} />
                              Low Stock
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              In Stock
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
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
