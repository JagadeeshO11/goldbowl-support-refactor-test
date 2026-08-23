import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { usePrototypeContext } from '../../context/PrototypeContext'
import { CustomerPageShell } from './CustomerPage.shared'

function OrdersList(){const {orders}=usePrototypeContext();return <>{orders.map(o=><Link className="route-order" to={`/customer/orders/${o.id}`} key={o.id}><span>#{o.id}</span><strong>{o.status.replaceAll('_',' ')}</strong><small>₹{o.total} • {o.type} • {o.branch}</small></Link>)}</>}
function OrderDetail({id}){const {orders}=usePrototypeContext();const o=orders.find(x=>x.id===id)||orders[0];return <><h1>Order #{o?.id}</h1><div className="route-status-list">{['CONFIRMED','PREPARING','READY_FOR_PICKUP','ASSIGNED','PICKED_UP','OUT_FOR_DELIVERY','DELIVERED'].map(s=><span key={s}>{s===o?.status||['CONFIRMED','PREPARING'].includes(s)?'✓':'○'} {s.replaceAll('_',' ')}</span>)}</div><Link className="route-primary" to={`/customer/track/${o?.id}`}>Live Track Order</Link></>}
export function CustomerOrdersPage(){const {id}=useParams();return <CustomerPageShell title="My orders">{id?<OrderDetail id={id}/>:<OrdersList/>}</CustomerPageShell>}
