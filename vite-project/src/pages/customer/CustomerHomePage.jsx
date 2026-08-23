import React from 'react'
import { Link, Search, MapPin } from 'lucide-react'
import { categories } from '../../data/mockData'
import { CustomerPageShell, ProductCard, products } from './CustomerPage.shared'

export function CustomerHomePage(){
  return <CustomerPageShell title="Good food. Better bowls."><div className="customer-location"><MapPin/><span>Delivering to <strong>Bengaluru</strong></span></div><section className="route-hero"><span>GOLDEN MOMENTS</span><h1>Good food.<br/><em>Better bowls.</em></h1><p>Freshly made, beautifully delivered.</p><Link to="/customer/categories">Explore Menu</Link></section><Link className="route-search" to="/customer/search"><Search/>Search bowls, meals and more</Link><h2>Menu</h2><div className="route-category-row">{categories.map(c=><Link to={`/customer/search?category=${c.id}`} key={c.id}><span>{c.icon}</span>{c.name}</Link>)}</div><h2>Popular at Bowl</h2><div className="route-products">{products.slice(0,4).map(p=><ProductCard key={p.id} p={p}/>)}</div></CustomerPageShell>
}
