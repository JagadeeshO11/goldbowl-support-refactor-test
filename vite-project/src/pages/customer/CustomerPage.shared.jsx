import React from 'react'
import { Link, ArrowLeft, Bell, Star, Plus } from 'lucide-react'
import { products } from '../../data/mockData'

export const LOGO_URL='https://res.cloudinary.com/dwmjz9csc/image/upload/v1787120716/image-removebg-preview_e1wfil.png'
export const CART_KEY='goldbowl_cart'
export const CHECKOUT_KEY='goldbowl_checkout'
export const readCart=()=>{try{return JSON.parse(localStorage.getItem(CART_KEY))||[]}catch{return[]}}
export const saveCart=items=>localStorage.setItem(CART_KEY,JSON.stringify(items))
export const money=v=>`₹${Math.round(v)}`

export function FoodImage({src,alt,className='',...props}){return <img className={className} src={src} alt={alt} loading="lazy" {...props}/>} 

export function CustomerPageShell({title,children}){
  const isHome=title==='Good food. Better bowls.'
  return <><header className={`route-mobile-header ${isHome?'home-header':''}`}>{isHome?<Link to="/customer/home" className="customer-header-logo" aria-label="Golden Food Bowl home"><img src={LOGO_URL} alt="Golden Food Bowl"/></Link>:<Link to="/customer/home"><ArrowLeft/></Link>}<strong>{isHome?'':title}</strong><Link to="/customer/notifications" aria-label="Notifications"><Bell size={19}/></Link></header><div className="route-mobile-body">{children}</div></>
}

export function addProduct(p){
  const cart=readCart(),existing=cart.find(x=>x.productId===p.id)
  saveCart(existing?cart.map(x=>x.productId===p.id?{...x,quantity:x.quantity+1}:x):[...cart,{productId:p.id,quantity:1}])
}

export function ProductCard({p}){return <article className="route-product"><Link to={`/customer/product/${p.id}`} className="route-food-image"><FoodImage src={p.image} alt={p.name}/></Link><div><span className="route-rating"><Star size={12} fill="currentColor"/> {p.rating}</span><h3>{p.name}</h3><small>{p.portion} • {p.calories} kcal</small><div className="route-price"><strong>₹{p.price}</strong><button type="button" onClick={()=>{addProduct(p);window.location.href='/customer/cart'}}><Plus size={16}/></button></div></div></article>}

export { products }
