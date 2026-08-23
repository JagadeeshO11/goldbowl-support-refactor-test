import React from 'react'
import { Link } from 'react-router-dom'
import { categories } from '../../data/mockData'
import { CustomerPageShell } from './CustomerPage.shared'
export function CustomerCategoriesPage(){return <CustomerPageShell title="Categories"><p>Choose a menu category to see only its dishes.</p><div className="route-category-grid">{categories.map(c=><Link to={`/customer/search?category=${c.id}`} key={c.id}><span>{c.icon}</span><strong>{c.name}</strong><small>View {c.name}</small></Link>)}</div></CustomerPageShell>}
