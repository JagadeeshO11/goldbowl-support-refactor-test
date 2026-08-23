import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  BarChart3,
  Package,
  Store,
  Users,
  Truck,
  CheckCircle2,
  Plus,
  ToggleLeft,
  ToggleRight,
  DollarSign,
  TrendingUp,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  Eye,
  Trash2,
  AlertTriangle,
  FileText,
  MapPin,
  Smartphone,
  Check,
  X,
  CreditCard,
  Headphones,
  Phone,
  Mail,
  Navigation,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { usePrototypeContext } from '../../context/PrototypeContext'
import {
  assignDelivery,
  updateOrderStatus,
  duplicateBranch,
  addProduct,
  toggleProductAvailability,
  addCategory,
  updateDeliveryVerification,
  createBranch
} from '../../services/prototypeStore'
import { NotificationPanel } from '../../components/notifications/NotificationPanel'
import { AdminReports } from './AdminReports'
import './admin-content.css'

const navTitles = {
  dashboard: 'Overview & Operations',
  orders: 'Orders Management',
  products: 'Products & Menu Catalog',
  categories: 'Food Categories',
  branches: 'Restaurant Branches',
  customers: 'Customer Base',
  delivery: 'Delivery Personnel',
  support: 'Support Team Oversight',
  reports: 'Sales & Analytics',
  notifications: 'System Notifications'
}

export function AdminPage() {
  const { pathname } = useLocation()
  const path = pathname.replace('/admin/', '') || 'dashboard'
  const title = navTitles[path] || 'Admin'

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {path === 'dashboard' && <Dashboard />}
      {path === 'orders' && <Orders />}
      {path === 'products' && <Products />}
      {path === 'categories' && <Categories />}
      {path === 'branches' && <Branches />}
      {path === 'customers' && <Customers />}
      {path === 'delivery' && <Delivery />}
      {path === 'support' && <Support />}
      {path === 'reports' && <AdminReports />}
      {path === 'notifications' && <AdminNotifications />}
    </section>
  )
}

function Dashboard() {
  const { orders, branches, products } = usePrototypeContext()
  const sales = orders.reduce((s, o) => s + Number(o.total || 0), 0)
  const activeOrdersCount = orders.filter(o => o.status !== 'DELIVERED').length

  return (
    <>
      {/* ── KPI Metric Cards ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 12
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #fffdf7 100%)',
            border: '1px solid #eee4d2',
            borderLeft: '4px solid #dfa500',
            borderRadius: 16,
            padding: 14,
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: 4
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#78716c', fontWeight: 700 }}>Gross Sales</span>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#fff9ec', display: 'grid', placeItems: 'center', color: '#dfa500' }}>
              <BarChart3 size={15} />
            </div>
          </div>
          <strong style={{ fontSize: 20, color: '#1c1917', fontWeight: 900 }}>₹{sales.toLocaleString('en-IN')}</strong>
          <small style={{ color: '#16a34a', fontSize: 9.5, fontWeight: 700 }}>+12.8% vs last week</small>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
            border: '1px solid #e2e8f0',
            borderLeft: '4px solid #0284c7',
            borderRadius: 16,
            padding: 14,
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: 4
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>Live Orders</span>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#e0f2fe', display: 'grid', placeItems: 'center', color: '#0284c7' }}>
              <Package size={15} />
            </div>
          </div>
          <strong style={{ fontSize: 20, color: '#0f172a', fontWeight: 900 }}>{orders.length}</strong>
          <small style={{ color: '#0284c7', fontSize: 9.5, fontWeight: 700 }}>{activeOrdersCount} active in kitchen</small>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
            border: '1px solid #e2e8f0',
            borderLeft: '4px solid #16a34a',
            borderRadius: 16,
            padding: 14,
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: 4
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>Customers</span>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#dcfce7', display: 'grid', placeItems: 'center', color: '#16a34a' }}>
              <Users size={15} />
            </div>
          </div>
          <strong style={{ fontSize: 20, color: '#0f172a', fontWeight: 900 }}>1,284</strong>
          <small style={{ color: '#16a34a', fontSize: 9.5, fontWeight: 700 }}>+42 signups today</small>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)',
            border: '1px solid #e2e8f0',
            borderLeft: '4px solid #9333ea',
            borderRadius: 16,
            padding: 14,
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: 4
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>Delivery Fleet</span>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#f3e8ff', display: 'grid', placeItems: 'center', color: '#9333ea' }}>
              <Truck size={15} />
            </div>
          </div>
          <strong style={{ fontSize: 20, color: '#0f172a', fontWeight: 900 }}>32</strong>
          <small style={{ color: '#16a34a', fontSize: 9.5, fontWeight: 700 }}>98.4% On-time rate</small>
        </div>
      </div>

      {/* ── Daily Sales Target Banner (Mobile + Desktop Responsive) ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1c1208 0%, #3a2610 100%)',
          color: '#ffffff',
          borderRadius: 18,
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 14,
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ flex: 1, minWidth: 200 }}>
          <span style={{ fontSize: 10, color: '#f5c518', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }}>
            ⚡ DAILY PLATFORM GOAL
          </span>
          <h3 style={{ margin: '4px 0 0', fontSize: 16, color: '#fff', fontWeight: 800 }}>
            ₹25,000 / ₹30,000 Goal Reached
          </h3>
          <p style={{ margin: '2px 0 0', fontSize: 11, color: '#e2d8c8' }}>
            3 active branches serving Indiranagar, Koramangala &amp; MG Road.
          </p>
        </div>
        <div style={{ minWidth: 160, flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#e2d8c8', marginBottom: 4, fontWeight: 700 }}>
            <span>83% Achieved</span>
            <span>₹5,000 Remaining</span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ width: '83%', height: '100%', background: 'linear-gradient(90deg, #dfa500, #f5c518)', borderRadius: 10 }} />
          </div>
        </div>
      </div>

      <Orders />
    </>
  )
}

function Orders() {
  const { orders } = usePrototypeContext()
  const [filter, setFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedOrder, setSelectedOrder] = useState(null)

  const filtered = orders.filter(o => {
    const matchesSearch =
      o.id.toLowerCase().includes(filter.toLowerCase()) ||
      o.customer.toLowerCase().includes(filter.toLowerCase()) ||
      o.branch.toLowerCase().includes(filter.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="admin-table-card">
      <div className="table-heading" style={{ flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Package size={18} style={{ color: '#b4811d' }} /> Live Orders Management
          </h2>
          <span style={{ fontSize: 11, color: '#78716c' }}>{orders.length} Total Orders</span>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={14} style={{ position: 'absolute', left: 8, color: '#988e7d' }} />
            <input
              placeholder="Search order, customer..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
              style={{
                paddingLeft: 28,
                height: 32,
                borderRadius: 8,
                border: '1px solid #e2d8c8',
                fontSize: 11
              }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{
              height: 32,
              padding: '0 8px',
              borderRadius: 8,
              border: '1px solid #e2d8c8',
              fontSize: 11,
              background: '#fffdf9',
              fontWeight: 700
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PREPARING">Preparing</option>
            <option value="READY_FOR_PICKUP">Ready For Pickup</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="PICKED_UP">Picked Up</option>
            <option value="OUT_FOR_DELIVERY">Out For Delivery</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              {['Order ID', 'Branch', 'Customer', 'Amount', 'Status', 'Actions'].map(c => (
                <th key={c}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id}>
                <td>
                  <strong>#{o.id}</strong>
                </td>
                <td>{o.branch}</td>
                <td>{o.customer}</td>
                <td>
                  <strong>₹{o.total}</strong>
                </td>
                <td>
                  <span className={`table-status ${o.status.toLowerCase()}`}>
                    {o.status.replaceAll('_', ' ')}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <button
                      type="button"
                      style={{
                        padding: '4px 8px',
                        border: '1px solid #e2d8c8',
                        borderRadius: 6,
                        background: '#fff',
                        cursor: 'pointer',
                        fontSize: 11,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                      onClick={() => setSelectedOrder(o)}
                      title="View Details"
                    >
                      <Eye size={12} /> Details
                    </button>

                    {o.status !== 'DELIVERED' ? (
                      <button
                        className="admin-action-btn"
                        onClick={() =>
                          o.status === 'READY_FOR_PICKUP'
                            ? assignDelivery(o.id, 'Rahul Kumar')
                            : updateOrderStatus(o.id, nextStatus(o.status))
                        }
                      >
                        {o.status === 'READY_FOR_PICKUP' ? 'Assign Delivery →' : 'Advance →'}
                      </button>
                    ) : (
                      <span style={{ fontSize: 10, color: '#16a34a', fontWeight: 800 }}>✓ Done</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Order Detail Modal ── */}
      {selectedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 100,
            display: 'grid',
            placeItems: 'center',
            padding: 16
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 18,
              padding: 24,
              width: 'min(440px, 100%)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16 }}>Order #{selectedOrder.id}</h3>
                <span className={`table-status ${selectedOrder.status.toLowerCase()}`}>
                  {selectedOrder.status.replaceAll('_', ' ')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                style={{ background: 'none', border: 0, fontSize: 18, cursor: 'pointer', color: '#78716c' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12, color: '#44403c' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid #eee' }}>
                <span>Customer Name</span>
                <strong>{selectedOrder.customer}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid #eee' }}>
                <span>Branch Location</span>
                <strong>{selectedOrder.branch}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid #eee' }}>
                <span>Order Total</span>
                <strong style={{ color: '#1c1917', fontSize: 14 }}>₹{selectedOrder.total}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid #eee' }}>
                <span>Delivery Partner</span>
                <strong>{selectedOrder.driver || 'Pending Assignment'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Payment Mode</span>
                <strong>{selectedOrder.paymentMethod || 'UPI / Online'}</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              style={{
                width: '100%',
                marginTop: 20,
                padding: 10,
                borderRadius: 10,
                border: 0,
                background: '#1c1917',
                color: '#f5c518',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const nextStatus = s =>
  ({
    CONFIRMED: 'PREPARING',
    PREPARING: 'READY_FOR_PICKUP',
    ASSIGNED: 'PICKED_UP',
    PICKED_UP: 'OUT_FOR_DELIVERY',
    OUT_FOR_DELIVERY: 'DELIVERED'
  }[s] || s)

function Products() {
  const { products } = usePrototypeContext()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('bowls')
  const [portion, setPortion] = useState('1 bowl')
  const [calories, setCalories] = useState('450')

  const add = () => {
    if (name.trim() && price) {
      addProduct({
        name: name.trim(),
        price: Number(price),
        category: category,
        portion: portion,
        calories: Number(calories) || 450,
        image: '🍲'
      })
      setName('')
      setPrice('')
    }
  }

  return (
    <div className="admin-table-card">
      <div className="table-heading" style={{ flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2>Products &amp; Menu Catalog</h2>
          <span style={{ fontSize: 11, color: '#78716c' }}>{products.length} Dishes Listed</span>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            placeholder="Product name"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ height: 32, padding: '0 8px', borderRadius: 8, border: '1px solid #e2d8c8', fontSize: 11 }}
          />
          <input
            placeholder="Price"
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            style={{ height: 32, width: 70, padding: '0 8px', borderRadius: 8, border: '1px solid #e2d8c8', fontSize: 11 }}
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{ height: 32, padding: '0 6px', borderRadius: 8, border: '1px solid #e2d8c8', fontSize: 11 }}
          >
            <option value="bowls">Bowls</option>
            <option value="salads">Salads</option>
            <option value="desserts">Desserts</option>
            <option value="drinks">Drinks</option>
          </select>
          <button className="admin-primary-btn" onClick={add}>
            <Plus size={14} /> Add Dish
          </button>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Nutrition</th>
              <th>Availability</th>
              <th>Toggle</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>
                  <strong>{p.name}</strong>
                </td>
                <td>
                  <span style={{ textTransform: 'capitalize' }}>{p.category}</span>
                </td>
                <td>
                  <strong>₹{p.price}</strong>
                </td>
                <td>
                  <small style={{ color: '#78716c' }}>{p.portion || '1 bowl'} • {p.calories || 450} kcal</small>
                </td>
                <td>
                  <span className={`table-status ${p.available !== false ? 'active' : 'inactive'}`}>
                    {p.available !== false ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td>
                  <button
                    style={{ background: 'none', border: 0, cursor: 'pointer', color: p.available !== false ? '#16a34a' : '#78716c' }}
                    onClick={() => toggleProductAvailability(p.id)}
                    title="Toggle Dish Stock Status"
                  >
                    {p.available !== false ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Categories() {
  const { categories } = usePrototypeContext()
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('🍲')

  const add = () => {
    if (name.trim()) addCategory({ name: name.trim(), icon: icon || '🍲' })
    setName('')
  }

  return (
    <div className="admin-table-card">
      <div className="table-heading" style={{ flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2>Food Categories</h2>
          <span style={{ fontSize: 11, color: '#78716c' }}>{categories.map ? categories.length : 4} Active Categories</span>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <input
            placeholder="Category name"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ height: 32, padding: '0 8px', borderRadius: 8, border: '1px solid #e2d8c8', fontSize: 11 }}
          />
          <select
            value={icon}
            onChange={e => setIcon(e.target.value)}
            style={{ height: 32, padding: '0 6px', borderRadius: 8, border: '1px solid #e2d8c8', fontSize: 11 }}
          >
            <option value="🍲">🍲 Bowls</option>
            <option value="🥗">🥗 Salads</option>
            <option value="🥤">🥤 Drinks</option>
            <option value="🍰">🍰 Desserts</option>
            <option value="🍱">🍱 Feasts</option>
          </select>
          <button className="admin-primary-btn" onClick={add}>
            <Plus size={14} /> Add Category
          </button>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Icon</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id}>
                <td>
                  <strong>{c.name}</strong>
                </td>
                <td style={{ fontSize: 20 }}>{c.icon}</td>
                <td>
                  <span className="table-status active">Active</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Customers() {
  const { users } = usePrototypeContext()
  const [filter, setFilter] = useState('')

  const mockCustomersList = users && users.length ? users : [
    { id: 'u1', name: 'Priya Sharma', mobile: '9876543210', email: 'priya@example.com', provider: 'Mobile OTP', createdAt: '2026-08-20', ordersCount: 12, spent: 3840 },
    { id: 'u2', name: 'Rahul Verma', mobile: '9812345678', email: 'rahul.v@gmail.com', provider: 'Google', createdAt: '2026-08-19', ordersCount: 8, spent: 2450 },
    { id: 'u3', name: 'Ananya Roy', mobile: '9765432109', email: 'ananya@outlook.com', provider: 'Mobile OTP', createdAt: '2026-08-18', ordersCount: 5, spent: 1620 },
    { id: 'u4', name: 'Karan Patel', mobile: '9988776655', email: 'karan.p@yahoo.com', provider: 'Email', createdAt: '2026-08-17', ordersCount: 3, spent: 980 }
  ]

  const filteredUsers = mockCustomersList.filter(u =>
    (u.name && u.name.toLowerCase().includes(filter.toLowerCase())) ||
    (u.mobile && u.mobile.includes(filter)) ||
    (u.email && u.email.toLowerCase().includes(filter.toLowerCase()))
  )

  return (
    <div className="admin-table-card">
      <div className="table-heading" style={{ flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Users size={18} style={{ color: '#b4811d' }} /> Customer Accounts Database
          </h2>
          <span style={{ fontSize: 11, color: '#78716c' }}>{filteredUsers.length} Registered Customer Profiles</span>
        </div>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={14} style={{ position: 'absolute', left: 8, color: '#988e7d' }} />
          <input
            placeholder="Search customer, mobile..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{
              paddingLeft: 28,
              height: 32,
              borderRadius: 8,
              border: '1px solid #e2d8c8',
              fontSize: 11
            }}
          />
        </div>
      </div>

      {/* ── Desktop View Table ── */}
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Auth Mode</th>
              <th>Total Spent</th>
              <th>Account Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: '#f5c518',
                        color: '#1c1208',
                        fontWeight: 900,
                        fontSize: 12,
                        display: 'grid',
                        placeItems: 'center'
                      }}
                    >
                      {u.name ? u.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'PS'}
                    </div>
                    <div>
                      <strong>{u.name}</strong>
                      <div style={{ fontSize: 10, color: '#78716c' }}>Member since Aug 2026</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>+91 {u.mobile}</span>
                </td>
                <td>{u.email || '—'}</td>
                <td>
                  <span
                    style={{
                      fontSize: 10,
                      background: '#f5efe2',
                      color: '#854d0e',
                      padding: '3px 8px',
                      borderRadius: 8,
                      fontWeight: 800,
                      border: '1px solid #e2d8c8'
                    }}
                  >
                    {u.provider === 'Google' ? '🌐 Google Sign-In' : '📱 Mobile OTP'}
                  </span>
                </td>
                <td>
                  <strong>₹{u.spent ? u.spent.toLocaleString('en-IN') : '2,150'}</strong>
                  <small style={{ display: 'block', fontSize: 9.5, color: '#78716c' }}>{u.ordersCount || 6} orders placed</small>
                </td>
                <td>
                  <span className="table-status active">🟢 Active</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Delivery() {
  const { deliveryPartners } = usePrototypeContext()

  return (
    <div className="admin-table-card">
      <div className="table-heading">
        <div>
          <h2>Delivery Partner Verification &amp; Onboarding</h2>
          <span style={{ fontSize: 11, color: '#78716c' }}>{deliveryPartners.length} Onboarding Applications</span>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Partner Name</th>
              <th>Mobile</th>
              <th>Vehicle</th>
              <th>Documents</th>
              <th>Onboarding Fee</th>
              <th>Verification Action</th>
            </tr>
          </thead>
          <tbody>
            {deliveryPartners.length ? (
              deliveryPartners.map(p => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.name}</strong>
                  </td>
                  <td>{p.mobile}</td>
                  <td>
                    <span style={{ textTransform: 'capitalize' }}>{p.vehicle}</span>
                  </td>
                  <td>{p.documentsVerified ? '✓ Verified (Aadhaar & DL)' : 'Pending Docs'}</td>
                  <td>₹{p.fee} • <small style={{ fontWeight: 800, color: '#16a34a' }}>{p.feeStatus}</small></td>
                  <td>
                    <button
                      className="admin-action-btn"
                      onClick={() => updateDeliveryVerification(p.id, 'VERIFIED', 'PAID')}
                    >
                      {p.verificationStatus === 'VERIFIED' ? (
                        <span style={{ color: '#16a34a', fontWeight: 800 }}>✓ Verified Partner</span>
                      ) : (
                        'Verify Partner →'
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: 20, color: '#78716c' }}>
                  No partner applications queued.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Support() {
  return (
    <div className="admin-table-card">
      <div className="table-heading">
        <div>
          <h2>Support Team Roster &amp; Oversight</h2>
          <span style={{ fontSize: 11, color: '#78716c' }}>Active Support Staff Roster</span>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Agent Name</th>
              <th>Shift &amp; Role</th>
              <th>Open Cases</th>
              <th>Resolved Today</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Ananya Rao', role: 'Senior Agent', open: 3, resolved: 24, status: 'Online' },
              { name: 'Vikram Shah', role: 'Chat Specialist', open: 2, resolved: 19, status: 'Online' },
              { name: 'Meera Das', role: 'Refund Desk', open: 5, resolved: 31, status: 'Online' }
            ].map(a => (
              <tr key={a.name}>
                <td>
                  <strong>{a.name}</strong>
                </td>
                <td>{a.role}</td>
                <td>{a.open}</td>
                <td>{a.resolved}</td>
                <td>
                  <span className="table-status active">🟢 {a.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Branches() {
  const { branches } = usePrototypeContext()
  const [message, setMessage] = useState('')
  const [showAddBranch, setShowAddBranch] = useState(false)
  const [branchName, setBranchName] = useState('')
  const [distance, setDistance] = useState('1.5 km')

  const handleAddBranch = (e) => {
    e.preventDefault()
    if (branchName.trim()) {
      createBranch({ name: branchName.trim(), distance })
      setBranchName('')
      setShowAddBranch(false)
      setMessage(`New branch "${branchName}" added!`)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, color: '#1c1917', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Store size={20} style={{ color: '#dfa500' }} /> Restaurant Branches &amp; Kitchen Zones
          </h2>
          <span style={{ fontSize: 11, color: '#78716c' }}>{branches.length} Operational Outlets in Bengaluru</span>
        </div>

        <button
          className="admin-primary-btn"
          onClick={() => setShowAddBranch(true)}
          style={{ padding: '8px 14px', fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <Plus size={15} /> Add New Branch
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 14
        }}
      >
        {branches.map(b => (
          <article
            key={b.id}
            style={{
              background: '#ffffff',
              border: '1px solid #eee4d2',
              borderRadius: 18,
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fff9ec', border: '1px solid #fce7b2', display: 'grid', placeItems: 'center', color: '#dfa500' }}>
                  <Store size={20} />
                </div>
                <div>
                  <strong style={{ fontSize: 14, color: '#1c1917', display: 'block' }}>{b.name}</strong>
                  <span style={{ fontSize: 10, color: '#78716c' }}>Bengaluru Central Zone</span>
                </div>
              </div>
              <span className="table-status active" style={{ fontSize: 9.5, fontWeight: 800 }}>🟢 OPEN 24/7</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '10px 12px', background: '#faf8f5', borderRadius: 12, border: '1px solid #f3ebd9' }}>
              <div>
                <span style={{ fontSize: 9.5, color: '#78716c', display: 'block', fontWeight: 600 }}>Delivery Radius</span>
                <strong style={{ fontSize: 11.5, color: '#1c1917' }}>{b.distance} SLA</strong>
              </div>
              <div>
                <span style={{ fontSize: 9.5, color: '#78716c', display: 'block', fontWeight: 600 }}>Avg Prep Time</span>
                <strong style={{ fontSize: 11.5, color: '#16a34a' }}>18 Mins</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
              <button
                className="admin-action-btn"
                style={{ flex: 1, padding: 8, fontSize: 11, textAlign: 'center', justifyContent: 'center' }}
                onClick={() => {
                  duplicateBranch(b.id, { name: `${b.name} Express`, distance: '2.0 km' })
                  setMessage(`Menu duplicated from ${b.name}!`)
                }}
              >
                Duplicate Menu →
              </button>
            </div>
          </article>
        ))}
      </div>

      {message && (
        <div
          style={{
            padding: 12,
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#166534',
            borderRadius: 12,
            fontSize: 11,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <CheckCircle2 size={16} /> {message}
        </div>
      )}

      {/* ── Add Branch Modal ── */}
      {showAddBranch && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 100,
            display: 'grid',
            placeItems: 'center',
            padding: 16
          }}
          onClick={() => setShowAddBranch(false)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 18,
              padding: 24,
              width: 'min(400px, 100%)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>Add New Branch Location</h3>
            <form onSubmit={handleAddBranch} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label style={{ fontSize: 11, fontWeight: 700, display: 'flex', flexDirection: 'column', gap: 4 }}>
                Branch Name
                <input
                  type="text"
                  required
                  placeholder="e.g. Golden Bowl Indiranagar"
                  value={branchName}
                  onChange={e => setBranchName(e.target.value)}
                  style={{ padding: 8, borderRadius: 8, border: '1px solid #e2d8c8', fontSize: 12 }}
                />
              </label>

              <label style={{ fontSize: 11, fontWeight: 700, display: 'flex', flexDirection: 'column', gap: 4 }}>
                Delivery Distance / Zone
                <input
                  type="text"
                  placeholder="e.g. 2.5 km"
                  value={distance}
                  onChange={e => setDistance(e.target.value)}
                  style={{ padding: 8, borderRadius: 8, border: '1px solid #e2d8c8', fontSize: 12 }}
                />
              </label>

              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowAddBranch(false)}
                  style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #e2d8c8', background: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: 10, borderRadius: 8, border: 0, background: '#1c1917', color: '#f5c518', fontWeight: 700, cursor: 'pointer' }}
                >
                  Save Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function AdminNotifications() {
  const { notifications } = usePrototypeContext()
  return <NotificationPanel notifications={notifications} role="admin" />
}
