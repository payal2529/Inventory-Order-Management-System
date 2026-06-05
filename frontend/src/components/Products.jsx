import { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Trash2, Edit } from 'lucide-react';
import Swal from 'sweetalert2';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: '', sku: '', price: '', quantity: '' });

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAddModal = () => {
    setEditId(null);
    setFormData({ name: '', sku: '', price: '', quantity: '' });
    setShowModal(true);
  };

  const handleOpenEditModal = (product) => {
    setEditId(product.id);
    setFormData({ 
      name: product.name, 
      sku: product.sku, 
      price: product.price, 
      quantity: product.quantity 
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        sku: formData.sku,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10)
      };

      if (editId) {
        await api.put(`/products/${editId}`, payload);
        Swal.fire({ icon: 'success', title: 'Updated!', text: 'Product updated successfully.', timer: 1500, showConfirmButton: false, background: 'var(--surface)', color: 'var(--text-main)' });
      } else {
        await api.post('/products', payload);
        Swal.fire({ icon: 'success', title: 'Added!', text: 'Product added successfully.', timer: 1500, showConfirmButton: false, background: 'var(--surface)', color: 'var(--text-main)' });
      }
      
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.data?.detail || "Failed to save product",
        background: 'var(--surface)',
        color: 'var(--text-main)'
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--danger)',
      cancelButtonColor: 'var(--surface-hover)',
      confirmButtonText: 'Yes, delete it!',
      background: 'var(--surface)',
      color: 'var(--text-main)'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
        Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Product has been deleted.', timer: 1500, showConfirmButton: false, background: 'var(--surface)', color: 'var(--text-main)' });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: "Failed to delete product",
          background: 'var(--surface)',
          color: 'var(--text-main)'
        });
      }
    }
  };

  return (
    <div className="animation-slide-up">
      <div className="page-header">
        <h1>Products</h1>
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td style={{fontFamily: 'monospace', color: 'var(--text-muted)'}}>{product.sku}</td>
                <td style={{fontWeight: '500'}}>{product.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                  <span style={{ color: product.quantity < 10 ? 'var(--warning)' : 'inherit', fontWeight: '500' }}>
                    {product.quantity}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary" onClick={() => handleOpenEditModal(product)} style={{ padding: '0.4rem 0.6rem' }}>
                      <Edit size={16} />
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(product.id)} style={{ padding: '0.4rem 0.6rem' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editId ? "Edit Product" : "Add New Product"}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name</label>
                <input required type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>SKU (Unique)</label>
                <input required type="text" className="form-control" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} disabled={!!editId} />
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input required type="number" step="0.01" min="0.01" className="form-control" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Quantity in Stock</label>
                <input required type="number" min="0" className="form-control" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                {editId ? "Update Product" : "Save Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
