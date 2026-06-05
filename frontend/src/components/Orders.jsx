import { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Trash2 } from 'lucide-react';

import Swal from 'sweetalert2';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ customer_id: '', product_id: '', quantity_ordered: 1 });

  const fetchData = async () => {
    try {
      const [ordersRes, productsRes, customersRes] = await Promise.all([
        api.get('/orders'),
        api.get('/products'),
        api.get('/customers')
      ]);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      setCustomers(customersRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/orders', {
        customer_id: parseInt(formData.customer_id),
        product_id: parseInt(formData.product_id),
        quantity_ordered: parseInt(formData.quantity_ordered)
      });
      setShowModal(false);
      setFormData({ customer_id: '', product_id: '', quantity_ordered: 1 });
      fetchData();
      Swal.fire({ icon: 'success', title: 'Order Created!', text: 'Order was placed successfully.', timer: 1500, showConfirmButton: false, background: 'var(--surface)', color: 'var(--text-main)' });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: error.response?.data?.detail || "Failed to create order", background: 'var(--surface)', color: 'var(--text-main)' });
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

    if(result.isConfirmed) {
      try {
        await api.delete(`/orders/${id}`);
        fetchData();
        Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Order has been deleted.', timer: 1500, showConfirmButton: false, background: 'var(--surface)', color: 'var(--text-main)' });
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: "Failed to delete order", background: 'var(--surface)', color: 'var(--text-main)' });
      }
    }
  };

  const getProductName = (id) => products.find(p => p.id === id)?.name || `Product #${id}`;
  const getCustomerName = (id) => customers.find(c => c.id === id)?.full_name || `Customer #${id}`;

  return (
    <div className="animation-slide-up">
      <div className="page-header">
        <h1>Orders</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Create Order
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Total Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{getCustomerName(order.customer_id)}</td>
                <td>{getProductName(order.product_id)}</td>
                <td>{order.quantity_ordered}</td>
                <td>${order.total_amount.toFixed(2)}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDelete(order.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create New Order</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Customer</label>
                <select required className="form-control" value={formData.customer_id} onChange={e => setFormData({...formData, customer_id: e.target.value})}>
                  <option value="" disabled>Select Customer</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Product</label>
                <select required className="form-control" value={formData.product_id} onChange={e => setFormData({...formData, product_id: e.target.value})}>
                  <option value="" disabled>Select Product</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.quantity}) - ${p.price}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Quantity to Order</label>
                <input required type="number" min="1" className="form-control" value={formData.quantity_ordered} onChange={e => setFormData({...formData, quantity_ordered: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Submit Order</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
