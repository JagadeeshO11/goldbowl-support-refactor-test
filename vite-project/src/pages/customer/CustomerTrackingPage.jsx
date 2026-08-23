import React from 'react'
import { useParams } from 'react-router-dom'
import { usePrototypeContext } from '../../context/PrototypeContext'
import { CustomerPageShell } from './CustomerPage.shared'

export function CustomerTrackingPage(){const {id}=useParams();const {orders}=usePrototypeContext();const o=orders.find(x=>x.id===id)||orders[0];return <CustomerPageShell title="Track order"><div className="route-map">🛵<span>• • • • •</span>🏠</div><h1>Arriving in {o?.eta||25} min</h1><p>Order #{o?.id} • {o?.status?.replaceAll('_',' ')}</p><div className="route-driver"><span>RK</span><div><strong>{o?.driver||'Rahul Kumar'}</strong><small>Delivery partner</small></div><button type="button">Call</button></div></CustomerPageShell>}
