import { PageHeader } from '../components/PageHeader';
import { Settings as SettingsIcon, Building2, Bell, Lock, Palette } from 'lucide-react';

export function Settings() {
  return (
    <div className="flex-1 bg-slate-50">
      <PageHeader
        title="Settings"
        description="Configure your ERP system preferences"
        icon={SettingsIcon}
      />

      <div className="p-6 space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Building2 className="text-blue-600" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Company Information</h3>
              <p className="text-sm text-slate-600">Update your business details</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                defaultValue="PT Rockstar"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tax ID (NPWP)
              </label>
              <input
                type="text"
                placeholder="00.000.000.0-000.000"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Address
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Save Changes
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 p-2 rounded-lg">
              <Bell className="text-green-600" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Notifications</h3>
              <p className="text-sm text-slate-600">Manage your alert preferences</p>
            </div>
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-slate-700">Low stock alerts</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-slate-700">Tax deadline reminders</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-slate-700">Daily sales reports</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-slate-700">Production status updates</span>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-amber-100 p-2 rounded-lg">
              <Lock className="text-amber-600" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Security</h3>
              <p className="text-sm text-slate-600">Manage security and access control</p>
            </div>
          </div>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <p className="text-sm font-medium text-slate-900">Change Password</p>
              <p className="text-xs text-slate-600">Update your login credentials</p>
            </button>
            <button className="w-full text-left px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <p className="text-sm font-medium text-slate-900">Two-Factor Authentication</p>
              <p className="text-xs text-slate-600">Add an extra layer of security</p>
            </button>
            <button className="w-full text-left px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <p className="text-sm font-medium text-slate-900">User Permissions</p>
              <p className="text-xs text-slate-600">Manage role-based access control</p>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Palette className="text-purple-600" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Appearance</h3>
              <p className="text-sm text-slate-600">Customize the look and feel</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Theme
              </label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Light</option>
                <option>Dark</option>
                <option>Auto</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
