import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ProductionRecord {
  id: number;
  reference: string;
  product_name: string;
  quantity: number;
  status: 'planned' | 'in_progress' | 'completed';
  date: string;
  created_at: string;
}

export interface InventoryItem {
  id: number;
  sku: string;
  name: string;
  quantity: number;
  unit: string;
  min_stock: number;
  location: string;
  created_at: string;
}

export interface FinanceTransaction {
  id: number;
  reference: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  created_at: string;
}

export interface SalesOrder {
  id: number;
  reference: string;
  customer_name: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  date: string;
  created_at: string;
}

export interface MarketingCampaign {
  id: number;
  name: string;
  channel: string;
  budget: number;
  start_date: string;
  end_date: string;
  status: 'planned' | 'active' | 'completed';
  created_at: string;
}

export interface Employee {
  id: number;
  employee_id: string;
  name: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  hire_date: string;
  created_at: string;
}

export interface TaxRecord {
  id: number;
  reference: string;
  type: 'ppn' | 'pph' | 'cukai';
  period: string;
  amount: number;
  status: 'pending' | 'filed' | 'paid';
  due_date: string;
  created_at: string;
}
