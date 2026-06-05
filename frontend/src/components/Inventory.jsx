import { useState, useEffect } from 'react';
import api from '../services/api';
import { Package, AlertTriangle, RefreshCw, CheckCircle2 } from 'lucide-react';

import Swal from 'sweetalert2';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editQuantity, setEditQuantity] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      // Sort by quantity so low stock items are at the top
      const sorted = response.data.sort((a, b) => a.quantity - b.quantity);
      setProducts(sorted);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setEditQuantity(product.quantity.toString());
  };

  const handleSave = async (product) => {
    const newQuantity = parseInt(editQuantity);
    if (isNaN(newQuantity) || newQuantity < 0) {
      Swal.fire({ icon: 'warning', title: 'Invalid Input', text: 'Please enter a valid non-negative quantity.', background: 'var(--surface)', color: 'var(--text-main)' });
      return;
    }

    setUpdating(true);
    try {
      await api.put(`/products/${product.id}`, {
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity: newQuantity
      });
      setEditingId(null);
      fetchProducts();
      Swal.fire({ icon: 'success', title: 'Stock Updated!', text: `${product.name} stock is now ${newQuantity}.`, timer: 1500, showConfirmButton: false, background: 'var(--surface)', color: 'var(--text-main)' });
    } catch (error) {
      console.error("Failed to update stock", error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to update stock', background: 'var(--surface)', color: 'var(--text-main)' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="loading-state"><RefreshCw className="spin" size={24}/> Loading inventory...</div>;

  const lowStockCount = products.filter(p => p.quantity < 10).length;

  return (
    <div className="animation-slide-up">
      <div className="page-header">
        <div>
          <h1>Inventory Management</h1>
          <p style={{color: 'var(--text-muted)', marginTop: '0.5rem'}}>Monitor and adjust your stock levels.</p>
        </div>
        <div style={{display: 'flex', gap: '1rem'}}>
          {lowStockCount > 0 && (
             <div className="badge badge-danger" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.875rem'}}>
               <AlertTriangle size={16} />
               {lowStockCount} Low Stock Items
             </div>
          )}
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Status</th>
              <th>Quantity in Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td style={{fontFamily: 'monospace', color: 'var(--text-muted)'}}>{product.sku}</td>
                <td style={{fontWeight: '500'}}>{product.name}</td>
                <td>
                  {product.quantity === 0 ? (
                    <span className="badge badge-danger">Out of Stock</span>
                  ) : product.quantity < 10 ? (
                    <span className="badge badge-warning">Low Stock</span>
                  ) : (
                    <span className="badge badge-success">In Stock</span>
                  )}
                </td>
                <td>
                  {editingId === product.id ? (
                    <input 
                      type="number" 
                      className="form-control" 
                      style={{width: '100px', padding: '0.4rem', margin: 0}}
                      value={editQuantity}
                      onChange={(e) => setEditQuantity(e.target.value)}
                      min="0"
                      autoFocus
                    />
                  ) : (
                    <span style={{
                      fontSize: '1.125rem', 
                      fontWeight: '600',
                      color: product.quantity < 10 ? 'var(--warning)' : 'var(--text-main)'
                    }}>
                      {product.quantity}
                    </span>
                  )}
                </td>
                <td>
                  {editingId === product.id ? (
                    <div style={{display: 'flex', gap: '0.5rem'}}>
                      <button 
                        className="btn btn-primary" 
                        onClick={() => handleSave(product)}
                        disabled={updating}
                        style={{padding: '0.4rem 0.8rem'}}
                      >
                        <CheckCircle2 size={16} /> Save
                      </button>
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => setEditingId(null)}
                        style={{padding: '0.4rem 0.8rem'}}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => handleEditClick(product)}
                      style={{padding: '0.4rem 0.8rem'}}
                    >
                      <RefreshCw size={14} /> Update Stock
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5" style={{textAlign: 'center', padding: '3rem', color: 'var(--text-muted)'}}>
                  <Package size={48} style={{opacity: 0.2, marginBottom: '1rem'}} />
                  <br />
                  No products found. Add products first.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
