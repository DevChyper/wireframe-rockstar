import { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Users, Plus, Edit2, Trash2, Mail, Phone } from 'lucide-react';
import { supabase, Employee } from '../lib/supabase';

export function HumanResources() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    employee_id: '',
    name: '',
    department: '',
    position: '',
    email: '',
    phone: '',
    hire_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    const { data } = await supabase
      .from('employees')
      .select('*')
      .order('hire_date', { ascending: false });
    if (data) setEmployees(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      employee_id: form.employee_id || `EMP-${Date.now()}`,
      name: form.name,
      department: form.department,
      position: form.position,
      email: form.email,
      phone: form.phone,
      hire_date: form.hire_date,
    };

    if (editingId) {
      await supabase
        .from('employees')
        .update(payload)
        .eq('id', editingId);
    } else {
      await supabase.from('employees').insert(payload);
    }

    resetForm();
    loadEmployees();
  }

  async function handleDelete(id: number) {
    if (confirm('Are you sure you want to delete this employee record?')) {
      await supabase.from('employees').delete().eq('id', id);
      loadEmployees();
    }
  }

  function handleEdit(employee: Employee) {
    setForm({
      employee_id: employee.employee_id,
      name: employee.name,
      department: employee.department,
      position: employee.position,
      email: employee.email,
      phone: employee.phone,
      hire_date: employee.hire_date,
    });
    setEditingId(employee.id);
    setShowForm(true);
  }

  function resetForm() {
    setForm({
      employee_id: '',
      name: '',
      department: '',
      position: '',
      email: '',
      phone: '',
      hire_date: new Date().toISOString().split('T')[0],
    });
    setEditingId(null);
    setShowForm(false);
  }

  return (
    <div className="flex-1 bg-slate-50">
      <PageHeader
        title="Human Resources"
        description="Manage employee records and organizational structure"
        icon={Users}
        action={
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <Plus size={20} />
            Add Employee
          </button>
        }
      />

      <div className="p-6">
        {showForm && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              {editingId ? 'Edit Employee' : 'New Employee'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    value={form.employee_id}
                    onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
                    placeholder="Auto-generated if empty"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Department
                  </label>
                  <select
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Select Department</option>
                    <option value="Production">Production</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Position
                  </label>
                  <input
                    type="text"
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Hire Date
                  </label>
                  <input
                    type="date"
                    value={form.hire_date}
                    onChange={(e) => setForm({ ...form, hire_date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  {editingId ? 'Update' : 'Add'} Employee
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
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Employee ID</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Name</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Department</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Position</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Contact</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Hire Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      No employees yet. Add your first employee above.
                    </td>
                  </tr>
                ) : (
                  employees.map((employee) => (
                    <tr key={employee.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{employee.employee_id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{employee.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{employee.department}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{employee.position}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Mail size={12} />
                            {employee.email}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Phone size={12} />
                            {employee.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(employee.hire_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(employee)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(employee.id)}
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
