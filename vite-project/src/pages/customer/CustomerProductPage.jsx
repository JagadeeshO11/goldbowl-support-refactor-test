import React from 'react'
import { useParams } from 'react-router-dom'
import { Star } from 'lucide-react'
import { products } from '../../data/mockData'
import { CustomerPageShell, FoodImage, addProduct } from './CustomerPage.shared'

export function CustomerProductPage(){const {id}=useParams();const p=products.find(x=>String(x.id)===id)||products[0];return <CustomerPageShell title={p.name}><div className="route-detail-image"><FoodImage src={p.image} alt={p.name}/></div><span className="route-pill">Available</span><h1>{p.name}</h1><div className="route-rating"><Star size={14} fill="currentColor"/> {p.rating} rating</div><p>{p.description}</p><div className="route-nutrition"><b>{p.portion}<small>Portion</small></b><b>{p.calories}<small>Calories</small></b><b>{p.ingredients.length}<small>Ingredients</small></b></div><h2>Ingredients</h2><div className="ingredient-chips">{p.ingredients.map(i=><span key={i}>{i}</span>)}</div><button type="button" className="route-primary" onClick={()=>{addProduct(p);window.location.href='/customer/cart'}}>Add to Cart • ₹{p.price}</button></CustomerPageShell>}
