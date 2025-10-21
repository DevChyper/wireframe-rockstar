import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Factory,
  Package,
  DollarSign,
  ShoppingCart,
  Megaphone,
  Users,
  FileText,
  BarChart3,
  Settings
} from 'lucide-react';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/production', label: 'Production', icon: Factory },
  { path: '/inventory', label: 'Inventory', icon: Package },
  { path: '/finance', label: 'Finance', icon: DollarSign },
  { path: '/sales', label: 'Sales', icon: ShoppingCart },
  { path: '/marketing', label: 'Marketing', icon: Megaphone },
  { path: '/human-resources', label: 'Human Resources', icon: Users },
  { path: '/cukai-pajak', label: 'Cukai & Pajak', icon: FileText },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-slate-900 min-h-screen text-white flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-lg">
            PR
          </div>
          <div>
            <h1 className="text-xl font-bold">PT Rockstar</h1>
            <p className="text-xs text-slate-400">ERP System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
            <Users size={16} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-slate-400">admin@rockstar.co.id</p>
          </div>
        </div>
      </div>
    </div>
  );
}
