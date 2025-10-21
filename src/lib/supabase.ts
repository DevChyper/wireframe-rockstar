import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://uyjfjwioljczsvmedxgt.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5amZqd2lvbGpjenN2bWVkeGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMDQxNjEsImV4cCI6MjA3NjU4MDE2MX0.xBpCjdozQDikETZ7RaK5-efQr0fE3SnAV2Cxn0aL6Hg";

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
