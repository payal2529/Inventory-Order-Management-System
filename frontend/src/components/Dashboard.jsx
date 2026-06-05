import { useState, useEffect } from 'react';
import api from '../services/api';
import { Package, Users, ShoppingCart, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await api.get('/dashboard/summary');
        setSummary(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard summary", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <div className="loading-state" style={{padding: '3rem', textAlign: 'center', color: 'var(--text-muted)'}}><Package className="spin" size={24} style={{opacity: 0.5, marginBottom: '1rem'}}/><br/>Loading dashboard data...</div>;
  if (!summary) return <div style={{padding: '3rem', textAlign: 'center', color: 'var(--danger)'}}>Error loading data. Ensure backend is running.</div>;

  return (
    <div className="animation-slide-up" style={{ animation: 'slideUp 0.5s ease-out' }}>
      <div className="page-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p style={{color: 'var(--text-muted)', marginTop: '0.5rem'}}>Welcome back! Here is what is happening with your store today.</p>
        </div>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-title"><Package size={16} /> Total Products</div>
          <div className="stat-value">{summary.total_products}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title"><Users size={16} /> Total Customers</div>
          <div className="stat-value">{summary.total_customers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title"><ShoppingCart size={16} /> Total Orders</div>
          <div className="stat-value">{summary.total_orders}</div>
        </div>
        <div className="stat-card" style={{ borderColor: summary.low_stock_products > 0 ? 'rgba(239, 68, 68, 0.4)' : 'var(--glass-border)' }}>
          <div className="stat-title" style={{color: summary.low_stock_products > 0 ? 'var(--danger)' : 'var(--text-muted)'}}><AlertTriangle size={16} /> Low Stock Items</div>
          <div className="stat-value" style={{ color: summary.low_stock_products > 0 ? 'var(--danger)' : 'var(--text-main)' }}>{summary.low_stock_products}</div>
        </div>
      </div>
    </div>
  );
}
