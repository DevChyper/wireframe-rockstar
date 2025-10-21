import { useEffect, useState } from 'react';
import { KPICard } from '../components/KPICard';
import { Factory, Package, DollarSign, ShoppingCart, TrendingUp, AlertTriangle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { supabase } from '../lib/supabase';

const revenueData = [
  { month: 'Jan', revenue: 850000000, expense: 620000000 },
  { month: 'Feb', revenue: 920000000, expense: 680000000 },
  { month: 'Mar', revenue: 1100000000, expense: 750000000 },
  { month: 'Apr', revenue: 1050000000, expense: 720000000 },
  { month: 'May', revenue: 1200000000, expense: 800000000 },
  { month: 'Jun', revenue: 1350000000, expense: 850000000 },
];

const productionData = [
  { week: 'W1', output: 2400 },
  { week: 'W2', output: 2800 },
  { week: 'W3', output: 3200 },
  { week: 'W4', output: 2900 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export function Dashboard() {
  const [kpis, setKpis] = useState({
    production: 0,
    inventory: 0,
    sales: 0,
    lowStock: 0,
  });

  useEffect(() => {
    loadKPIs();
  }, []);

  async function loadKPIs() {
    const [productionRes, inventoryRes, salesRes] = await Promise.all([
      supabase.from('production_records').select('quantity', { count: 'exact' }),
      supabase.from('inventory_items').select('quantity', { count: 'exact' }),
      supabase.from('sales_orders').select('total_amount', { count: 'exact' }),
    ]);

    const totalProduction = productionRes.data?.reduce((sum, r) => sum + (r.quantity || 0), 0) || 0;
    const totalInventory = inventoryRes.data?.length || 0;
    const totalSales = salesRes.data?.reduce((sum, r) => sum + (r.total_amount || 0), 0) || 0;

    const lowStockRes = await supabase
      .from('inventory_items')
      .select('*')
      .lt('quantity', supabase.rpc('min_stock'));

    setKpis({
      production: totalProduction,
      inventory: totalInventory,
      sales: totalSales,
      lowStock: lowStockRes.data?.length || 0,
    });
  }

  const statusDistribution = [
    { name: 'Completed', value: 45 },
    { name: 'In Progress', value: 30 },
    { name: 'Planned', value: 15 },
    { name: 'Delayed', value: 10 },
  ];

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Welcome back, here's what's happening with your business today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Production Output"
          value={kpis.production.toLocaleString()}
          change="+12.5% from last month"
          changeType="positive"
          icon={Factory}
          iconColor="bg-blue-500"
        />
        <KPICard
          title="Inventory Items"
          value={kpis.inventory}
          change="Active SKUs"
          changeType="neutral"
          icon={Package}
          iconColor="bg-green-500"
        />
        <KPICard
          title="Sales Revenue"
          value={`IDR ${(kpis.sales / 1000000).toFixed(1)}M`}
          change="+8.3% from last month"
          changeType="positive"
          icon={DollarSign}
          iconColor="bg-amber-500"
        />
        <KPICard
          title="Low Stock Alerts"
          value={kpis.lowStock}
          change="Needs attention"
          changeType={kpis.lowStock > 0 ? 'negative' : 'positive'}
          icon={AlertTriangle}
          iconColor={kpis.lowStock > 0 ? 'bg-red-500' : 'bg-green-500'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Revenue vs Expenses</h3>
              <p className="text-sm text-slate-600">Monthly financial overview</p>
            </div>
            <TrendingUp className="text-green-500" size={24} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" tickFormatter={(value) => `${value / 1000000}M`} />
              <Tooltip
                formatter={(value: number) => [`IDR ${(value / 1000000).toFixed(1)}M`]}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} name="Revenue" />
              <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} name="Expenses" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Production Status</h3>
              <p className="text-sm text-slate-600">Current order distribution</p>
            </div>
            <ShoppingCart className="text-blue-500" size={24} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Weekly Production Output</h3>
            <p className="text-sm text-slate-600">Last 4 weeks performance</p>
          </div>
          <Factory className="text-blue-500" size={24} />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={productionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="week" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
            />
            <Bar dataKey="output" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            <ActivityItem
              title="New production order created"
              description="PO-2025-001 for Product X"
              time="2 hours ago"
              type="production"
            />
            <ActivityItem
              title="Inventory restocked"
              description="SKU-12345 quantity updated"
              time="5 hours ago"
              type="inventory"
            />
            <ActivityItem
              title="Sales order confirmed"
              description="SO-2025-042 worth IDR 45M"
              time="1 day ago"
              type="sales"
            />
            <ActivityItem
              title="Tax filing completed"
              description="PPN period January 2025"
              time="2 days ago"
              type="tax"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <QuickActionButton icon={Factory} label="New Production" color="bg-blue-500" />
            <QuickActionButton icon={Package} label="Add Inventory" color="bg-green-500" />
            <QuickActionButton icon={DollarSign} label="Record Transaction" color="bg-amber-500" />
            <QuickActionButton icon={ShoppingCart} label="Create Order" color="bg-purple-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ title, description, time, type }: { title: string; description: string; time: string; type: string }) {
  const colors = {
    production: 'bg-blue-100 text-blue-600',
    inventory: 'bg-green-100 text-green-600',
    sales: 'bg-purple-100 text-purple-600',
    tax: 'bg-amber-100 text-amber-600',
  };

  return (
    <div className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
      <div className={`w-2 h-2 rounded-full mt-2 ${colors[type as keyof typeof colors]}`}></div>
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-900">{title}</p>
        <p className="text-xs text-slate-600">{description}</p>
        <p className="text-xs text-slate-400 mt-1">{time}</p>
      </div>
    </div>
  );
}

function QuickActionButton({ icon: Icon, label, color }: { icon: any; label: string; color: string }) {
  return (
    <button className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-slate-200 hover:border-slate-300 hover:shadow-md transition-all">
      <div className={`${color} p-3 rounded-lg`}>
        <Icon size={24} className="text-white" />
      </div>
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </button>
  );
}
