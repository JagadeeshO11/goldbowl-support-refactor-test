import { initialOrders, branches, products, categories } from '../data/mockData'
const STORAGE_KEY = 'goldbowl-prototype-state'
const makeId = () => (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`)

const defaultState = {
  orders: initialOrders,
  branches,
  products,
  categories,
  notifications: [
    { id: 'n1', role: 'customer', title: '🎉 Welcome to Golden Food Bowl', message: 'Your favourite food bowls are ready for order with 50% OFF promo code GOLDEN50.', createdAt: new Date().toISOString() },
    { id: 'n2', role: 'admin', title: '📈 High Demand Surge Alert', message: 'Koramangala branch volume increased +34% in the last hour.', createdAt: new Date().toISOString() },
    { id: 'n3', role: 'support', title: '🎧 Priority Ticket Logged', message: 'Customer Priya Sharma requested order status update for #BWL10245.', createdAt: new Date().toISOString() },
    { id: 'n4', role: 'delivery', title: '🛵 Instant Payout Available', message: 'Your daily earnings of ₹1,450 are ready for instant UPI transfer.', createdAt: new Date().toISOString() },
    { id: 'n5', role: 'admin', title: '🛵 New Delivery Partner Application', message: 'Suresh Patel applied for EV Scooter delivery onboarding.', createdAt: new Date().toISOString() }
  ],
  issues: [
    { id: 'TKT-901', orderId: 'BWL10245', customer: 'Priya Sharma', subject: 'Delivery status query during rain surge', priority: 'High', status: 'OPEN' },
    { id: 'TKT-902', orderId: 'BWL10244', customer: 'Arjun Rao', subject: 'Packaging seal verification request', priority: 'Normal', status: 'IN_PROGRESS' },
    { id: 'TKT-903', orderId: 'BWL10243', customer: 'Meera Nair', subject: 'Cutlery addition request', priority: 'Low', status: 'RESOLVED' }
  ],
  users: [
    { id: 'u1', name: 'Priya Sharma', mobile: '9876543210', email: 'priya@example.com', provider: 'Mobile OTP', createdAt: '2026-08-20', ordersCount: 12, spent: 3840 },
    { id: 'u2', name: 'Rahul Verma', mobile: '9812345678', email: 'rahul.v@gmail.com', provider: 'Google', createdAt: '2026-08-19', ordersCount: 8, spent: 2450 },
    { id: 'u3', name: 'Ananya Roy', mobile: '9765432109', email: 'ananya@outlook.com', provider: 'Mobile OTP', createdAt: '2026-08-18', ordersCount: 5, spent: 1620 },
    { id: 'u4', name: 'Karan Patel', mobile: '9988776655', email: 'karan.p@yahoo.com', provider: 'Email', createdAt: '2026-08-17', ordersCount: 3, spent: 980 }
  ],
  deliveryPartners: [
    { id: 'dp1', name: 'Rahul Kumar', mobile: '9876543210', vehicle: 'Bike', verificationStatus: 'VERIFIED', documentsVerified: true, fee: 700, feeStatus: 'PAID', trips: 142, rating: 4.9, earnings: 1450 },
    { id: 'dp2', name: 'Vikram Singh', mobile: '9812345678', vehicle: 'Scooter', verificationStatus: 'VERIFIED', documentsVerified: true, fee: 700, feeStatus: 'PAID', trips: 98, rating: 4.8, earnings: 1120 },
    { id: 'dp3', name: 'Suresh Patel', mobile: '9765432109', vehicle: 'Electric Vehicle', verificationStatus: 'PENDING', documentsVerified: false, fee: 700, feeStatus: 'PENDING', trips: 0, rating: 5.0, earnings: 0 }
  ]
}

function clone(value) { return JSON.parse(JSON.stringify(value)) }
function loadState() { try { const saved = localStorage.getItem(STORAGE_KEY); return saved ? JSON.parse(saved) : clone(defaultState) } catch { return clone(defaultState) } }
let state = loadState(); const listeners = new Set()
function persist() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); listeners.forEach((listener) => listener(state)) }

export const orderStatuses = ['CONFIRMED','PREPARING','READY_FOR_PICKUP','ASSIGNED','PICKED_UP','OUT_FOR_DELIVERY','DELIVERED']
export const deliveryStatusFlow = {
  CONFIRMED: 'PREPARING',
  PREPARING: 'READY_FOR_PICKUP',
  READY_FOR_PICKUP: 'ASSIGNED',
  ASSIGNED: 'PICKED_UP',
  PICKED_UP: 'OUT_FOR_DELIVERY',
  OUT_FOR_DELIVERY: 'DELIVERED',
  DELIVERED: null,
}
export function getNextOrderStatus(status) { return deliveryStatusFlow[status] ?? null }
export function getState() { return state }
export function subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener) }
export function createOrder(order) { const id = `BWL${Math.floor(10000 + Math.random() * 90000)}`; const newOrder = { id, status: 'CONFIRMED', createdAt: new Date().toISOString(), ...order }; state = { ...state, orders: [newOrder, ...state.orders] }; addNotification('admin','New order received',`${id} has been placed.`); addNotification('support','New order to monitor',`${id} needs monitoring.`); persist(); return newOrder }
export function updateOrderStatus(orderId, status) {
  if (!orderId || !orderStatuses.includes(status)) return false
  const order = state.orders.find((item) => item.id === orderId)
  if (!order || order.status === status) return false
  state = { ...state, orders: state.orders.map((item) => item.id === orderId ? { ...item, status } : item) }
  addNotification('customer','Order updated',`${orderId} is now ${status.replaceAll('_',' ').toLowerCase()}.`)
  persist()
  return true
}
export function advanceOrderStatus(orderId) {
  const order = state.orders.find((item) => item.id === orderId)
  if (!order) return null
  const next = getNextOrderStatus(order.status)
  if (!next) return order
  updateOrderStatus(orderId, next)
  return { ...order, status: next }
}
export function assignDelivery(orderId, driver) { state = { ...state, orders: state.orders.map((order) => order.id === orderId ? { ...order, driver, status: 'ASSIGNED' } : order) }; addNotification('delivery','New delivery assigned',`Order ${orderId} is ready for pickup.`); persist() }
export function addNotification(role, title, message) { state = { ...state, notifications: [{ id: makeId(), role, title, message, createdAt: new Date().toISOString() }, ...state.notifications] } }
export function duplicateBranch(sourceId, newBranch) { const source = state.branches.find((branch) => branch.id === Number(sourceId)); const id = Math.max(...state.branches.map((branch) => Number(branch.id)), 0) + 1; const branch = { id, ...newBranch, menuCopiedFrom: source?.name }; state = { ...state, branches: [...state.branches, branch] }; addNotification('admin','Branch duplicated',`${branch.name} copied the menu from ${source?.name ?? 'the selected branch'}.`); persist(); return branch }
export function addProduct(product) { const id = Math.max(...state.products.map((item) => Number(item.id)), 0) + 1; const item = { id, rating: 4.5, available: true, ingredients: [], ...product }; state = { ...state, products: [...state.products, item] }; addNotification('support','Product added',`${item.name} was added to the menu.`); persist(); return item }
export function updateProduct(productId, changes) { state = { ...state, products: state.products.map((item) => Number(item.id) === Number(productId) ? { ...item, ...changes } : item) }; persist() }
export function toggleProductAvailability(productId) { const item = state.products.find((product) => Number(product.id) === Number(productId)); if (item) updateProduct(productId, { available: !item.available }) }
export function addCategory(category) { const id = category.id || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'); state = { ...state, categories: [...state.categories, { ...category, id }] }; persist(); return id }
export function addIssue(issue) { state = { ...state, issues: [{ id: makeId(), status: 'OPEN', createdAt: new Date().toISOString(), ...issue }, ...state.issues] }; persist() }
export function updateIssue(issueId, status) { state = { ...state, issues: state.issues.map((issue) => issue.id === issueId ? { ...issue, status } : issue) }; persist() }
export function registerCustomer({ name, mobile, email = '', provider = 'mobile' }) { const user = { id: makeId(), role: 'customer', name, mobile, email, provider, createdAt: new Date().toISOString() }; state = { ...state, users: [user, ...state.users] }; persist(); return user }
export function registerDeliveryPartner(profile) { const partner = { id: makeId(), role: 'delivery', verificationStatus: 'PENDING', fee: 700, feeStatus: 'PENDING', createdAt: new Date().toISOString(), ...profile }; state = { ...state, deliveryPartners: [partner, ...state.deliveryPartners] }; addNotification('admin', 'Delivery onboarding submitted', `${partner.name} submitted a partner application.`); persist(); return partner }
export function updateDeliveryVerification(id, verificationStatus, feeStatus = 'PAID') { state = { ...state, deliveryPartners: state.deliveryPartners.map((p) => p.id === id ? { ...p, verificationStatus, feeStatus } : p) }; persist() }
export function createBranch(newBranch) { const id = Math.max(...state.branches.map((branch) => Number(branch.id)), 0) + 1; const branch = { id, ...newBranch }; state = { ...state, branches: [...state.branches, branch] }; addNotification('admin','Branch created',`${branch.name} was added.`); persist(); return branch }
export function resetPrototypeState() { state = clone(defaultState); persist() }
