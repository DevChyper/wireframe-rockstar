import { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { DollarSign, Plus, Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { supabase, FinanceTransaction } from '../lib/supabase';

export function Finance() {
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    reference: '',
    type: 'expense' as 'income' | 'expense',
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    const { data } = await supabase
      .from('finance_transactions')
      .select('*')
      .order('date', { ascending: false });
    if (data) setTransactions(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      reference: form.reference || `FIN-${Date.now()}`,
      type: form.type,
      category: form.category,
      amount: parseFloat(form.amount) || 0,
      description: form.description,
      date: form.date,
    };

    if (editingId) {
      await supabase
        .from('finance_transactions')
        .update(payload)
        .eq('id', editingId);
    } else {
      await supabase.from('finance_transactions').insert(payload);
    }

    resetForm();
    loadTransactions();
  }

  async function handleDelete(id: number) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      await supabase.from('finance_transactions').delete().eq('id', id);
      loadTransactions();
    }
  }

  function handleEdit(transaction: FinanceTransaction) {
    setForm({
      reference: transaction.reference,
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount.toString(),
      description: transaction.description,
      date: transaction.date,
    });
    setEditingId(transaction.id);
    setShowForm(true);
  }

  function resetForm() {
    setForm({
      reference: '',
      type: 'expense',
      category: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    setEditingId(null);
    setShowForm(false);
  }

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

  return (
    <div className="flex-1 bg-slate-50">
      <PageHeader
        title="Finance Management"
        description="Track income, expenses, and financial transactions"
        icon={DollarSign}
        action={
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Plus size={20} />
            New Transaction
          </button>
        }
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-100 p-2 rounded-lg">
                <TrendingUp className="text-green-600" size={20} />
              </div>
              <p className="text-sm font-medium text-slate-600">Total Income</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              IDR {(totalIncome / 1000000).toFixed(1)}M
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-red-100 p-2 rounded-lg">
                <TrendingDown className="text-red-600" size={20} />
              </div>
              <p className="text-sm font-medium text-slate-600">Total Expenses</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              IDR {(totalExpense / 1000000).toFixed(1)}M
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <DollarSign className="text-blue-600" size={20} />
              </div>
              <p className="text-sm font-medium text-slate-600">Net Balance</p>
            </div>
            <p className={`text-2xl font-bold ${totalIncome - totalExpense >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              IDR {((totalIncome - totalExpense) / 1000000).toFixed(1)}M
            </p>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              {editingId ? 'Edit Transaction' : 'New Transaction'}
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="e.g., Sales, Payroll, Utilities"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  {editingId ? 'Update' : 'Create'} Transaction
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
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Category</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Amount</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Description</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      No transactions yet. Create your first transaction above.
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{transaction.reference}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'income'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {transaction.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{transaction.category}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        IDR {parseFloat(transaction.amount.toString()).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{transaction.description}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(transaction)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(transaction.id)}
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
