import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Dashboard } from './pages/Dashboard';
import { Production } from './pages/Production';
import { Inventory } from './pages/Inventory';
import { Finance } from './pages/Finance';
import { Sales } from './pages/Sales';
import { Marketing } from './pages/Marketing';
import { HumanResources } from './pages/HumanResources';
import { CukaiPajak } from './pages/CukaiPajak';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/production" element={<Production />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/marketing" element={<Marketing />} />
            <Route path="/human-resources" element={<HumanResources />} />
            <Route path="/cukai-pajak" element={<CukaiPajak />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
