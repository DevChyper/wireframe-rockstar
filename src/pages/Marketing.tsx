import { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Megaphone, Plus, Edit2, Trash2 } from 'lucide-react';
import { supabase, MarketingCampaign } from '../lib/supabase';

export function Marketing() {
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: '',
    channel: 'digital',
    budget: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    status: 'planned' as 'planned' | 'active' | 'completed',
  });

  useEffect(() => {
    loadCampaigns();
  }, []);

  async function loadCampaigns() {
    const { data } = await supabase
      .from('marketing_campaigns')
      .select('*')
      .order('start_date', { ascending: false });
    if (data) setCampaigns(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      name: form.name,
      channel: form.channel,
      budget: parseFloat(form.budget) || 0,
      start_date: form.start_date,
      end_date: form.end_date,
      status: form.status,
    };

    if (editingId) {
      await supabase
        .from('marketing_campaigns')
        .update(payload)
        .eq('id', editingId);
    } else {
      await supabase.from('marketing_campaigns').insert(payload);
    }

    resetForm();
    loadCampaigns();
  }

  async function handleDelete(id: number) {
    if (confirm('Are you sure you want to delete this campaign?')) {
      await supabase.from('marketing_campaigns').delete().eq('id', id);
      loadCampaigns();
    }
  }

  function handleEdit(campaign: MarketingCampaign) {
    setForm({
      name: campaign.name,
      channel: campaign.channel,
      budget: campaign.budget.toString(),
      start_date: campaign.start_date,
      end_date: campaign.end_date,
      status: campaign.status,
    });
    setEditingId(campaign.id);
    setShowForm(true);
  }

  function resetForm() {
    setForm({
      name: '',
      channel: 'digital',
      budget: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
      status: 'planned',
    });
    setEditingId(null);
    setShowForm(false);
  }

  const statusColors = {
    planned: 'bg-blue-100 text-blue-700',
    active: 'bg-green-100 text-green-700',
    completed: 'bg-slate-100 text-slate-700',
  };

  return (
    <div className="flex-1 bg-slate-50">
      <PageHeader
        title="Marketing Campaigns"
        description="Plan and track marketing initiatives across channels"
        icon={Megaphone}
        action={
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            <Plus size={20} />
            New Campaign
          </button>
        }
      />

      <div className="p-6">
        {showForm && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              {editingId ? 'Edit Campaign' : 'New Campaign'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Channel
                  </label>
                  <select
                    value={form.channel}
                    onChange={(e) => setForm({ ...form, channel: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="digital">Digital</option>
                    <option value="social">Social Media</option>
                    <option value="print">Print</option>
                    <option value="tv">Television</option>
                    <option value="radio">Radio</option>
                    <option value="outdoor">Outdoor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Budget (IDR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="planned">Planned</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                >
                  {editingId ? 'Update' : 'Create'} Campaign
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
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Campaign Name</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Channel</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Budget</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Duration</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No campaigns yet. Create your first campaign above.
                    </td>
                  </tr>
                ) : (
                  campaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{campaign.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 capitalize">{campaign.channel}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        IDR {parseFloat(campaign.budget.toString()).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[campaign.status]}`}>
                          {campaign.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(campaign)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(campaign.id)}
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
