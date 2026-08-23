import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Mic, Heart, ChevronRight, Truck, Navigation, CreditCard, Headphones, ChevronLeft, MapPin, LocateFixed } from 'lucide-react'
import { products, categories } from '../../data/mockData'

const categoryVisuals = { bowls: '🍲', rice: '🍚', wraps: '🌯', salads: '🥗', sides: '🍟', drinks: '🥤' }
const heroSlides = [
  { productId: 1, eyebrow: 'GOLDEN FAVOURITE', title: <>Delicious<br />Food,<br />Delivered<br />Fresh!</>, copy: 'Golden Chicken Bowl, made fresh for your next meal.' },
  { productId: 3, eyebrow: 'MEAL DEAL', title: <>Big Taste,<br />Perfect<br />Rice<br />Feast!</>, copy: 'Chicken Rice Feast with aromatic spices and juicy chicken.' },
  { productId: 2, eyebrow: 'VEG SPECIAL', title: <>Fresh,<br />Healthy<br />&<br />Delicious!</>, copy: 'Power up with our grilled Paneer Power Bowl.' },
  { productId: 4, eyebrow: 'QUICK BITE', title: <>Crunchy<br />Wraps,<br />Made<br />Fresh!</>, copy: 'A freshly wrapped veggie crunch packed with flavour.' },
]

const getCardMeta = product => {
  const originalPrice = product.originalPrice || product.price + (product.id % 3 === 0 ? 120 : 100)
  const discount = Math.max(10, originalPrice - product.price)
  const badgeByCategory = { bowls: 'Pure & Fresh', rice: 'Chef Special', wraps: 'Freshly Made', salads: 'Fresh & Healthy', sides: 'Crispy & Fresh', drinks: 'Made Fresh' }
  return { originalPrice, discount, badge: badgeByCategory[product.category] || 'Fresh & Tasty' }
}

function FoodCard({ product, onAdd }) {
  const meta = getCardMeta(product)
  return <article className="customer-food-card customer-reference-card">
    <Link to={`/customer/product/${product.id}`} className="customer-food-img"><img src={product.image} alt={product.name} loading="lazy" /><span className="food-heart"><Heart size={17} /></span></Link>
    <button className="customer-reference-add" type="button" onClick={() => onAdd(product)}>ADD</button>
    <div className="customer-food-info"><div className="reference-price-row"><strong>₹{product.price}</strong><del>₹{meta.originalPrice}</del></div><div className="reference-discount">₹{meta.discount} OFF</div><h3>{product.name}</h3><div className="reference-portion">{product.portion}</div><span className="reference-badge">{meta.badge}</span></div>
  </article>
}

function ExploreCard({ product, onAdd }) {
  const meta = getCardMeta(product)
  return <article className="explore-product-card customer-reference-card">
    <Link to={`/customer/product/${product.id}`} className="explore-product-image customer-food-img"><img src={product.image} alt={product.name} loading="lazy" /><span className="explore-favourite"><Heart size={16}/></span></Link>
    <button className="customer-reference-add" type="button" onClick={() => onAdd(product)}>ADD</button>
    <div className="explore-product-body customer-food-info"><div className="reference-price-row"><strong>₹{product.price}</strong><del>₹{meta.originalPrice}</del></div><div className="reference-discount">₹{meta.discount} OFF</div><h3>{product.name}</h3><div className="reference-portion">{product.portion}</div><span className="reference-badge">{meta.badge}</span></div>
  </article>
}

function LocationBar() {
  const [location, setLocation] = React.useState(() => localStorage.getItem('goldbowl_current_location') || 'Detecting your location...')
  const [loading, setLoading] = React.useState(false)
  const detectLocation = React.useCallback(() => {
    if (!navigator.geolocation) { setLocation('Location unavailable'); return }
    setLoading(true); setLocation('Detecting your location...')
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`)
        const data = await response.json(); const a = data.address || {}
        const place = a.suburb || a.neighbourhood || a.city_district || a.city || a.town || a.village || 'Current location'
        const area = a.city || a.town || a.village
        const label = area && area !== place ? `${place}, ${area}` : place
        setLocation(label); localStorage.setItem('goldbowl_current_location', label)
      } catch {
        const label = `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`
        setLocation(label); localStorage.setItem('goldbowl_current_location', label)
      } finally { setLoading(false) }
    }, () => { setLocation('Unable to detect location'); setLoading(false) }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 })
  }, [])
  React.useEffect(() => { if (!localStorage.getItem('goldbowl_current_location')) detectLocation() }, [detectLocation])
  return <div className="customer-current-location"><div className="customer-location-icon"><MapPin size={18} fill="currentColor" /></div><div className="customer-location-text"><span>Present Location</span><strong>{location}</strong></div><button type="button" onClick={detectLocation} disabled={loading} aria-label="Detect present location" className="customer-location-refresh"><LocateFixed size={18}/></button></div>
}

export function GoldenCustomerHome() {
  const navigate = useNavigate(); const [selected, setSelected] = React.useState('all'); const [query, setQuery] = React.useState(''); const [slide, setSlide] = React.useState(0)
  React.useEffect(() => { if (sessionStorage.getItem('bowlCustomerAuth') !== '1') return; const pending = sessionStorage.getItem('bowlCustomerPendingRedirect'); if (!pending || pending === '/customer/home' || pending === '/') return; sessionStorage.removeItem('bowlCustomerPendingRedirect'); navigate(pending, { replace: true }) }, [navigate])
  React.useEffect(() => { const timer = window.setInterval(() => setSlide(current => (current + 1) % heroSlides.length), 4500); return () => window.clearInterval(timer) }, [])
  const visibleCategories = [{ id: 'all', name: 'All', icon: '🍲' }, ...categories]; const currentHero = heroSlides[slide]; const heroProduct = products.find(product => product.id === currentHero.productId) || products[0]
  const addToCart = product => { const key = 'goldbowl_cart'; let cart = []; try { cart = JSON.parse(localStorage.getItem(key)) || [] } catch { cart = [] }; const existing = cart.find(item => item.productId === product.id); const next = existing ? cart.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...cart, { productId: product.id, quantity: 1 }]; localStorage.setItem(key, JSON.stringify(next)); navigate('/customer/cart') }
  const filteredProducts = products.filter(product => { const matchesCategory = selected === 'all' || product.category === selected; const matchesSearch = !query.trim() || `${product.name} ${product.description}`.toLowerCase().includes(query.toLowerCase()); return matchesCategory && matchesSearch })
  const popularProducts = filteredProducts.slice(0, 4); const moreProducts = filteredProducts.slice(4)
  const previousSlide = () => setSlide(current => (current - 1 + heroSlides.length) % heroSlides.length); const nextSlide = () => setSlide(current => (current + 1) % heroSlides.length)
  return <div className="customer-home-body">
    <LocationBar />
    <div className="customer-search"><Search size={24} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search for your favourite food..." aria-label="Search food" /><Mic size={22} /></div>
    <div className="customer-categories">{visibleCategories.map(category => <Link key={category.id} to={category.id === 'all' ? '/customer/home' : `/customer/search?category=${category.id}`} onClick={() => setSelected(category.id)} className={`customer-category ${selected === category.id ? 'active' : ''}`}><span className="category-icon">{category.icon || categoryVisuals[category.id] || '🍽️'}</span><span className="category-name">{category.name === 'Signature Bowls' ? 'Bowls' : category.name === 'Fresh & Healthy' ? 'Salads' : category.name}</span></Link>)}</div>
    <section className="customer-hero"><img key={heroProduct.id} src={heroProduct.image} alt={heroProduct.name} /><div className="customer-hero-copy"><span className="hero-eyebrow">{currentHero.eyebrow}</span><h1>{currentHero.title}</h1><p>{currentHero.copy}</p><Link to={`/customer/product/${heroProduct.id}`}>Order Now <ChevronRight size={16}/></Link></div><button className="hero-arrow hero-arrow-left" onClick={previousSlide}><ChevronLeft size={18}/></button><button className="hero-arrow hero-arrow-right" onClick={nextSlide}><ChevronRight size={18}/></button><div className="hero-dots">{heroSlides.map((item,index)=><button key={item.productId} className={index===slide?'active':''} onClick={()=>setSlide(index)} aria-label={`Slide ${index+1}`}/>)}</div></section>
    <div className="customer-section-title"><div><span className="section-kicker">HANDPICKED FOR YOU</span><h2>Popular Items</h2></div><Link to="/customer/search">View All <ChevronRight size={18}/></Link></div><div className="customer-popular">{popularProducts.map(product=><FoodCard key={product.id} product={product} onAdd={addToCart}/>)}</div>
    {moreProducts.length>0&&<section className="customer-more-section"><div className="customer-section-title customer-more-title"><div><span className="section-kicker">MORE FROM GOLDEN BOWL</span><h2>Explore Menu</h2></div><Link to="/customer/search">See Menu <ChevronRight size={18}/></Link></div><div className="customer-more-grid">{moreProducts.map(product=><ExploreCard key={product.id} product={product} onAdd={addToCart}/>)}</div></section>}
    {filteredProducts.length===0&&<div className="customer-empty-state"><strong>No dishes found</strong><span>Try another search or category.</span></div>}
    <div className="customer-benefits"><div className="customer-benefit"><Truck size={27}/><strong>Fast Delivery</strong></div><div className="customer-benefit"><Navigation size={27}/><strong>Real-Time<br/>Tracking</strong></div><div className="customer-benefit"><CreditCard size={27}/><strong>Multiple<br/>Payment Modes</strong></div><div className="customer-benefit"><Headphones size={27}/><strong>24x7 Support</strong></div></div>
  </div>
}
