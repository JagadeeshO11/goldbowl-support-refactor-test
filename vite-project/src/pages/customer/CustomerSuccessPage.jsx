import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { usePrototypeContext } from '../../context/PrototypeContext'
import { CustomerPageShell } from './CustomerPage.shared'
export function CustomerSuccessPage(){const {orders}=usePrototypeContext();const navigate=useNavigate();const id=new URLSearchParams(window.location.search).get('order');const order=orders.find(o=>o.id===id)||orders[0];return <CustomerPageShell title="Order confirmed"><div className="route-success"><CheckCircle2/><h1>Order Confirmed!</h1><p>Your order is now visible to Admin, Support and Delivery.</p><b>#{order?.id||id||'BWL10301'}</b><button type="button" className="route-primary" onClick={()=>navigate(`/customer/track/${order?.id||id||'BWL10301'}`)}>Track Order</button><Link className="route-secondary" to="/customer/orders">View Orders</Link></div></CustomerPageShell>}
