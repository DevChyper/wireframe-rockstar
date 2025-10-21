import { PageHeader } from '../components/PageHeader';
import { BarChart3, Download, FileText, TrendingUp } from 'lucide-react';

export function Reports() {
  const reports = [
    { name: 'Production Summary', description: 'Monthly production output and efficiency', icon: FileText },
    { name: 'Financial Statement', description: 'Income, expenses, and balance sheet', icon: TrendingUp },
    { name: 'Inventory Report', description: 'Stock levels and turnover analysis', icon: FileText },
    { name: 'Sales Performance', description: 'Sales trends and customer insights', icon: BarChart3 },
    { name: 'Tax Compliance', description: 'Tax filing status and upcoming deadlines', icon: FileText },
    { name: 'HR Analytics', description: 'Employee metrics and department overview', icon: FileText },
  ];

  return (
    <div className="flex-1 bg-slate-50">
      <PageHeader
        title="Reports & Analytics"
        description="Generate and download business intelligence reports"
        icon={BarChart3}
      />

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => {
            const Icon = report.icon;
            return (
              <div
                key={report.name}
                className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Icon className="text-blue-600" size={24} />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{report.name}</h3>
                <p className="text-sm text-slate-600 mb-4">{report.description}</p>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full justify-center">
                  <Download size={16} />
                  Generate Report
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
