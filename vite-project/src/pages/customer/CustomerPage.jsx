import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Bell, Search, MapPin, Star, Plus, CheckCircle2, CreditCard, LogOut, Minus, Trash2 } from 'lucide-react'
import { products, categories, branches } from '../../data/mockData'
import { createOrder } from '../../services/prototypeStore'
import { usePrototypeContext } from '../../context/PrototypeContext'
import { NotificationPanel } from '../../components/notifications/NotificationPanel'

const titleMap={home:'Good food. Better bowls.',search:'Search food',orders:'My orders',profile:'My account',categories:'Categories',cart:'Your cart',checkout:'Checkout',payment:'Payment','order-success':'Order confirmed',track:'Track order',notifications:'Notifications',offers:'Golden Offers & Deals'}
const CART_KEY='goldbowl_cart',CHECKOUT_KEY='goldbowl_checkout'
const LOGO_URL='https://res.cloudinary.com/dwmjz9csc/image/upload/v1787120716/image-removebg-preview_e1wfil.png'
const readCart=()=>{try{return JSON.parse(localStorage.getItem(CART_KEY))||[]}catch{return[]}}
const saveCart=items=>localStorage.setItem(CART_KEY,JSON.stringify(items))
const money=v=>`₹${Math.round(v)}`
function FoodImage({src,alt,className=''}){return <img className={className} src={src} alt={alt} loading="lazy"/>}

export function CustomerPage(){const {pathname}=useLocation();const path=pathname.replace('/customer/','')||'home';if(path.startsWith('product/'))return <Product id={path.split('/')[1]}/>;if(path.startsWith('orders/'))return <OrderDetail id={path.split('/')[1]}/>;if(path.startsWith('track/'))return <Tracking id={path.split('/')[1]}/>;return <Page title={titleMap[path]||'Golden Food Bowl'}>{path==='home'&&<Home/>}{path==='search'&&<SearchPage/>}{path==='categories'&&<Categories/>}{path==='orders'&&<Orders/>}{path==='offers'&&<OffersView/>}{path==='profile'&&<Profile/>}{path==='cart'&&<Cart/>}{path==='checkout'&&<Checkout/>}{path==='payment'&&<Payment/>}{path==='order-success'&&<Success/>}{path==='notifications'&&<CustomerNotifications/>}</Page>}

function OffersView() {
  const [copiedCode, setCopiedCode] = React.useState('')
  const offersList = [
    { code: 'GOLDEN50', discount: '50% OFF', subtitle: 'Up to ₹120 on all signature bowls', minSpend: 'Min spend ₹199', validTill: 'Valid today' },
    { code: 'BUTTER100', discount: 'FLAT ₹100 OFF', subtitle: 'On rich rice meals & feast bowls', minSpend: 'Min spend ₹299', validTill: 'Ends in 3h 15m' },
    { code: 'FREEDEL', discount: 'FREE DELIVERY', subtitle: 'Zero delivery fee on all orders', minSpend: 'No minimum order', validTill: 'Valid all week' },
    { code: 'BOGOFRUIT', discount: 'BUY 1 GET 1', subtitle: 'Buy 1 Fresh Shake get 1 Free', minSpend: 'Drinks category', validTill: 'Limited stock' },
  ]
  const copyCoupon = (code) => {
    try { navigator.clipboard?.writeText(code) } catch (err) { if (err) return }
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(''), 2500)
  }
  return (
    <div className="offers-container">
      <div className="offers-hero-card">
        <span className="offer-tag">MEGA SAVINGS FESTIVAL</span>
        <h2>Golden Offers & Promo Codes</h2>
        <p>Save up to 50% on your favourite bowls and meals today!</p>
      </div>
      <div className="offers-list">
        {offersList.map((item) => (
          <div key={item.code} className="offer-card">
            <div className="offer-card-head">
              <span className="offer-badge">{item.discount}</span>
              <small>{item.validTill}</small>
            </div>
            <h3>{item.subtitle}</h3>
            <span className="offer-min">{item.minSpend}</span>
            <div className="offer-code-bar">
              <div className="code-box">
                <small>COUPON</small>
                <strong>{item.code}</strong>
              </div>
              <button 
                type="button" 
                className={`copy-code-btn ${copiedCode === item.code ? 'copied' : ''}`}
                onClick={() => copyCoupon(item.code)}
              >
                {copiedCode === item.code ? 'COPIED! ✓' : 'COPY CODE'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
function Page({title,children}){const isHome=title===titleMap.home;return <><header className={`route-mobile-header ${isHome?'home-header':''}`}>{isHome?<Link to="/customer/home" className="customer-header-logo" aria-label="Golden Food Bowl home"><img src={LOGO_URL} alt="Golden Food Bowl"/></Link>:<Link to="/customer/home"><ArrowLeft/></Link>}<strong>{isHome?'':title}</strong><Link to="/customer/notifications" aria-label="Notifications"><Bell size={19}/></Link></header><div className="route-mobile-body">{children}</div></>}
function addProduct(p){const cart=readCart(),existing=cart.find(x=>x.productId===p.id);saveCart(existing?cart.map(x=>x.productId===p.id?{...x,quantity:x.quantity+1}:x):[...cart,{productId:p.id,quantity:1}])}
function ProductCard({p}){return <article className="route-product"><Link to={`/customer/product/${p.id}`} className="route-food-image"><FoodImage src={p.image} alt={p.name}/></Link><div><span className="route-rating"><Star size={12} fill="currentColor"/> {p.rating}</span><h3>{p.name}</h3><small>{p.portion} • {p.calories} kcal</small><div className="route-price"><strong>₹{p.price}</strong><button type="button" onClick={()=>{addProduct(p);window.location.href='/customer/cart'}}><Plus size={16}/></button></div></div></article>}
function Home(){return <><div className="customer-location"><MapPin/><span>Delivering to <strong>Bengaluru</strong></span></div><section className="route-hero"><span>GOLDEN MOMENTS</span><h1>Good food.<br/><em>Better bowls.</em></h1><p>Freshly made, beautifully delivered.</p><Link to="/customer/categories">Explore Menu</Link></section><Link className="route-search" to="/customer/search"><Search/>Search bowls, meals and more</Link><h2>Menu</h2><div className="route-category-row">{categories.map(c=><Link to={`/customer/search?category=${c.id}`} key={c.id}><span>{c.icon}</span>{c.name}</Link>)}</div><h2>Popular at Bowl</h2><div className="route-products">{products.slice(0,4).map(p=><ProductCard key={p.id} p={p}/>)}</div></>}
function SearchPage(){
  const {search}=useLocation()
  const params=new URLSearchParams(search)
  const selected=params.get('category')||'all'
  const [query,setQuery]=React.useState('')
  const [sort,setSort]=React.useState('popular')
  const [focused,setFocused]=React.useState(false)

  const filtered=products.filter(p=>
    (selected==='all'||p.category===selected)&&
    (!query.trim()||`${p.name} ${p.description||''} ${p.category}`.toLowerCase().includes(query.toLowerCase()))
  )

  const sorted=[...filtered].sort((a,b)=>{
    if(sort==='price_asc') return a.price-b.price
    if(sort==='price_desc') return b.price-a.price
    if(sort==='rating') return (b.rating||0)-(a.rating||0)
    return (b.rating||0)-(a.rating||0)
  })

  const allChips=[{id:'all',name:'All',icon:'🍽️'},...categories]

  return (
    <>
      {/* ── Sticky Search Bar ── */}
      <div style={{
        position:'sticky',top:0,zIndex:30,
        background:'#fff',
        padding:'10px 0 8px',
        marginBottom:0,
        borderBottom:'1px solid #f0e9dc'
      }}>
        <div style={{
          display:'flex',alignItems:'center',gap:10,
          background:focused?'#fffdf7':'#f7f4ee',
          border:`1.5px solid ${focused?'#dfa500':'transparent'}`,
          borderRadius:16,
          padding:'10px 14px',
          transition:'all .2s ease',
          boxShadow:focused?'0 0 0 3px rgba(223,165,0,.1)':'none'
        }}>
          <Search size={18} style={{color:focused?'#dfa500':'#a09890',flexShrink:0}}/>
          <input
            value={query}
            onChange={e=>setQuery(e.target.value)}
            onFocus={()=>setFocused(true)}
            onBlur={()=>setFocused(false)}
            placeholder="Search bowls, meals, drinks…"
            autoFocus
            style={{
              flex:1,border:0,outline:0,background:'transparent',
              fontSize:14,color:'#1c1917',fontWeight:500
            }}
          />
          {query&&(
            <button
              type="button"
              onClick={()=>setQuery('')}
              style={{background:'none',border:0,cursor:'pointer',color:'#a09890',padding:0,display:'flex'}}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Category Filter Chips ── */}
      <div style={{
        display:'flex',gap:8,overflowX:'auto',
        padding:'12px 0 4px',scrollbarWidth:'none'
      }}>
        {allChips.map(c=>{
          const isActive=c.id===selected
          return (
            <Link
              key={c.id}
              to={c.id==='all'?'/customer/search':`/customer/search?category=${c.id}`}
              style={{
                display:'flex',alignItems:'center',gap:6,
                padding:'7px 14px',borderRadius:22,whiteSpace:'nowrap',
                textDecoration:'none',fontSize:12,fontWeight:700,
                flexShrink:0,
                background:isActive?'#1c1917':'#f7f4ee',
                color:isActive?'#f5c518':'#44403c',
                border:`1.5px solid ${isActive?'#1c1917':'#ede8df'}`,
                boxShadow:isActive?'0 2px 8px rgba(28,25,23,.18)':'none',
                transition:'all .15s ease'
              }}
            >
              <span style={{fontSize:15}}>{c.icon||'🍽️'}</span>
              {c.name}
            </Link>
          )
        })}
      </div>

      {/* ── Results Header ── */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',margin:'14px 0 10px'}}>
        <div>
          <span style={{fontSize:11,color:'#a09890',fontWeight:600}}>
            {sorted.length} {sorted.length===1?'result':'results'}
            {selected!=='all'&&categories.find(c=>c.id===selected)
              ? ` in ${categories.find(c=>c.id===selected).name}`
              : query?` for "${query}"`:''
            }
          </span>
        </div>
        <select
          value={sort}
          onChange={e=>setSort(e.target.value)}
          style={{
            fontSize:11,fontWeight:700,color:'#1c1917',
            border:'1px solid #ede8df',borderRadius:10,
            padding:'5px 10px',background:'#f7f4ee',
            outline:0,cursor:'pointer'
          }}
        >
          <option value="popular">⭐ Popular</option>
          <option value="rating">🔝 Top Rated</option>
          <option value="price_asc">💰 Price: Low</option>
          <option value="price_desc">💎 Price: High</option>
        </select>
      </div>

      {/* ── Product Grid ── */}
      {sorted.length ? (
        <div style={{
          display:'grid',
          gridTemplateColumns:'1fr 1fr',
          gap:12,
          paddingBottom:24
        }}>
          {sorted.map(p=>(
            <article key={p.id} style={{
              border:'1px solid #eee5d8',borderRadius:18,
              overflow:'hidden',background:'#fff',
              boxShadow:'0 2px 10px rgba(0,0,0,.04)',
              display:'flex',flexDirection:'column'
            }}>
              <Link to={`/customer/product/${p.id}`} style={{
                display:'block',height:110,background:'#f8f2e7',
                overflow:'hidden',textDecoration:'none',position:'relative'
              }}>
                <FoodImage
                  src={p.image}
                  alt={p.name}
                  style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}
                />
                {p.rating&&p.rating>=4.5&&(
                  <span style={{
                    position:'absolute',top:8,left:8,
                    background:'#16a34a',color:'#fff',
                    fontSize:8,fontWeight:800,padding:'2px 6px',
                    borderRadius:6,letterSpacing:.5
                  }}>BESTSELLER</span>
                )}
              </Link>
              <div style={{padding:'10px 10px 12px',flex:1,display:'flex',flexDirection:'column',gap:4}}>
                <div style={{display:'flex',alignItems:'center',gap:4}}>
                  <Star size={10} fill="#f5c518" stroke="none"/>
                  <span style={{fontSize:10,fontWeight:700,color:'#78716c'}}>{p.rating||'4.5'}</span>
                </div>
                <h3 style={{
                  fontSize:12.5,fontWeight:800,color:'#1c1917',
                  margin:0,lineHeight:1.3,
                  display:'-webkit-box',WebkitLineClamp:2,
                  WebkitBoxOrient:'vertical',overflow:'hidden'
                }}>{p.name}</h3>
                <small style={{fontSize:9.5,color:'#a09890',fontWeight:500}}>
                  {p.portion} • {p.calories} kcal
                </small>
                <div style={{
                  display:'flex',alignItems:'center',
                  justifyContent:'space-between',marginTop:'auto',paddingTop:6
                }}>
                  <strong style={{fontSize:14,fontWeight:900,color:'#1c1917'}}>₹{p.price}</strong>
                  <button
                    type="button"
                    onClick={()=>{addProduct(p);window.location.href='/customer/cart'}}
                    style={{
                      width:28,height:28,border:0,borderRadius:9,
                      background:'#1c1917',color:'#f5c518',
                      display:'grid',placeItems:'center',cursor:'pointer',
                      flexShrink:0,boxShadow:'0 2px 6px rgba(28,25,23,.2)'
                    }}
                  >
                    <Plus size={15}/>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign:'center',padding:'48px 24px',
          display:'flex',flexDirection:'column',alignItems:'center',gap:10
        }}>
          <span style={{fontSize:52}}>🔍</span>
          <strong style={{fontSize:16,color:'#1c1917'}}>No dishes found</strong>
          <p style={{fontSize:12,color:'#a09890',margin:0}}>
            {query?`No results for "${query}". `:''}
            Try another category or search term.
          </p>
          <Link
            to="/customer/search"
            style={{
              marginTop:8,padding:'9px 18px',borderRadius:12,
              background:'#1c1917',color:'#f5c518',
              textDecoration:'none',fontSize:12,fontWeight:800
            }}
          >
            View All Menu →
          </Link>
        </div>
      )}
    </>
  )
}
function Categories(){return <><p>Choose a menu category to see only its dishes.</p><div className="route-category-grid">{categories.map(c=><Link to={`/customer/search?category=${c.id}`} key={c.id}><span>{c.icon}</span><strong>{c.name}</strong><small>View {c.name}</small></Link>)}</div></>}
function Product({id}){const p=products.find(x=>String(x.id)===id)||products[0];return <Page title={p.name}><div className="route-detail-image"><FoodImage src={p.image} alt={p.name}/></div><span className="route-pill">Available</span><h1>{p.name}</h1><div className="route-rating"><Star size={14} fill="currentColor"/> {p.rating} rating</div><p>{p.description}</p><div className="route-nutrition"><b>{p.portion}<small>Portion</small></b><b>{p.calories}<small>Calories</small></b><b>{p.ingredients.length}<small>Ingredients</small></b></div><h2>Ingredients</h2><div className="ingredient-chips">{p.ingredients.map(i=><span key={i}>{i}</span>)}</div><button type="button" className="route-primary" onClick={()=>{addProduct(p);window.location.href='/customer/cart'}}>Add to Cart • ₹{p.price}</button></Page>}
function Cart(){const navigate=useNavigate();const [items,setItems]=React.useState(readCart);const detailed=items.map(i=>({...i,product:products.find(p=>p.id===i.productId)})).filter(i=>i.product);const update=(id,d)=>{const next=items.map(i=>i.productId===id?{...i,quantity:i.quantity+d}:i).filter(i=>i.quantity>0);setItems(next);saveCart(next)};const subtotal=detailed.reduce((s,i)=>s+i.product.price*i.quantity,0),delivery=subtotal?40:0,taxes=Math.round(subtotal*.05),total=subtotal+delivery+taxes;if(!detailed.length)return <div className="route-success"><h1>Your cart is empty</h1><p>Choose dishes from the menu to continue.</p><Link className="route-primary" to="/customer/categories">Explore Menu</Link></div>;return <><div>{detailed.map(i=><div className="route-cart-item" key={i.productId}><span className="route-cart-image"><FoodImage src={i.product.image} alt={i.product.name}/></span><div><strong>{i.product.name}</strong><small>{money(i.product.price)} • Qty {i.quantity}</small><div style={{display:'flex',gap:6,marginTop:8}}><button type="button" onClick={()=>update(i.productId,-1)}><Minus size={13}/></button><button type="button" onClick={()=>update(i.productId,1)}><Plus size={13}/></button><button type="button" onClick={()=>update(i.productId,-i.quantity)}><Trash2 size={13}/></button></div></div><strong>{money(i.product.price*i.quantity)}</strong></div>)}</div><div className="route-summary"><span>Subtotal <b>{money(subtotal)}</b></span><span>Delivery <b>{money(delivery)}</b></span><span>Taxes <b>{money(taxes)}</b></span><hr/><span>Total <b>{money(total)}</b></span></div><button type="button" className="route-primary" onClick={()=>{localStorage.setItem(CHECKOUT_KEY,JSON.stringify({items,subtotal,delivery,taxes,total}));navigate('/customer/checkout')}}>Proceed to Checkout</button></>}
function Checkout(){const navigate=useNavigate();const [type,setType]=React.useState('Delivery');const [branch,setBranch]=React.useState(branches[0]?.id||1);const [address,setAddress]=React.useState('Home');const cart=(()=>{try{return JSON.parse(localStorage.getItem(CHECKOUT_KEY))||null}catch{return null}})();if(!cart)return <div className="route-success"><h1>Your checkout is empty</h1><Link className="route-primary" to="/customer/cart">Back to Cart</Link></div>;const selectedBranch=branches.find(b=>b.id===branch)||branches[0];return <><h2>Order type</h2><div className="route-segment"><button type="button" className={type==='Delivery'?'active':''} onClick={()=>setType('Delivery')}>🚚 Delivery</button><button type="button" className={type==='Pickup'?'active':''} onClick={()=>setType('Pickup')}>🏪 Pickup</button></div><h2>Branch</h2>{branches.map(b=><button type="button" className="route-card" key={b.id} onClick={()=>setBranch(b.id)} style={{width:'100%',textAlign:'left',borderColor:b.id===branch?'#b4811d':undefined}}><span>🏪</span><span>{b.name}<small>{b.distance}</small></span><b>{b.id===branch?'✓':'›'}</b></button>)}{type==='Delivery'&&<><h2>Delivery address</h2><button type="button" className="route-card" onClick={()=>setAddress(address==='Home'?'Work':'Home')} style={{width:'100%',textAlign:'left'}}><MapPin/><span>{address}<small>{address==='Home'?'42, 5th Main Road, Bengaluru':'12, MG Road, Bengaluru'}</small></span><b>Change</b></button></>}<h2>Order total</h2><div className="route-summary"><span>Total <b>{money(cart.total)}</b></span></div><button type="button" className="route-primary" onClick={()=>{localStorage.setItem(CHECKOUT_KEY,JSON.stringify({...cart,type,branch:selectedBranch.id,address}));navigate('/customer/payment')}}>Continue to Payment</button></>}
function Payment(){const navigate=useNavigate();const {branches:storeBranches}=usePrototypeContext();const [method,setMethod]=React.useState('UPI');const cart=(()=>{try{return JSON.parse(localStorage.getItem(CHECKOUT_KEY))||null}catch{return null}})();const branch=(cart?.branch?branches.find(b=>b.id===cart.branch):null)||storeBranches[0]||branches[0];if(!cart)return <div className="route-success"><h1>Checkout expired</h1><Link className="route-primary" to="/customer/cart">Return to Cart</Link></div>;const place=()=>{const order=createOrder({items:cart.items,total:cart.total,type:cart.type||'Delivery',branch:branch?.name||'Golden Food Bowl',customer:'Priya Sharma',paymentMethod:method,driver:cart.type==='Delivery'?'Rahul Kumar':null,eta:cart.type==='Delivery'?30:0});localStorage.removeItem(CART_KEY);localStorage.removeItem(CHECKOUT_KEY);navigate(`/customer/order-success?order=${order.id}`)};return <><div className="route-payment-options">{['UPI','Credit / Debit Card','Net Banking','Digital Wallet'].map(x=><button type="button" key={x} onClick={()=>setMethod(x)} style={{borderColor:method===x?'#b4811d':undefined,background:method===x?'#fff9ec':undefined}}><span>{method===x?'◉':'◯'} {x}</span><span>›</span></button>)}</div><div className="route-summary"><span>Order total <b>{money(cart.total)}</b></span></div><button type="button" className="route-primary" onClick={place}><CreditCard/> Pay {money(cart.total)}</button></>}
function Success(){const {orders}=usePrototypeContext();const navigate=useNavigate();const id=new URLSearchParams(window.location.search).get('order');const order=orders.find(o=>o.id===id)||orders[0];return <div className="route-success"><CheckCircle2/><h1>Order Confirmed!</h1><p>Your order is now visible to Admin, Support and Delivery.</p><b>#{order?.id||id||'BWL10301'}</b><button type="button" className="route-primary" onClick={()=>navigate(`/customer/track/${order?.id||id||'BWL10301'}`)}>Track Order</button><Link className="route-secondary" to="/customer/orders">View Orders</Link></div>}
function Orders(){const {orders}=usePrototypeContext();return <>{orders.map(o=><Link className="route-order" to={`/customer/orders/${o.id}`} key={o.id}><span>#{o.id}</span><strong>{o.status.replaceAll('_',' ')}</strong><small>₹{o.total} • {o.type} • {o.branch}</small></Link>)}</>}
function OrderDetail({id}){const {orders}=usePrototypeContext();const o=orders.find(x=>x.id===id)||orders[0];return <><h1>Order #{o?.id}</h1><div className="route-status-list">{['CONFIRMED','PREPARING','READY_FOR_PICKUP','ASSIGNED','PICKED_UP','OUT_FOR_DELIVERY','DELIVERED'].map(s=><span key={s}>{s===o?.status||['CONFIRMED','PREPARING'].includes(s)?'✓':'○'} {s.replaceAll('_',' ')}</span>)}</div><Link className="route-primary" to={`/customer/track/${o?.id}`}>Live Track Order</Link></>}
function Tracking({id}){const {orders}=usePrototypeContext();const o=orders.find(x=>x.id===id)||orders[0];return <><div className="route-map">🛵<span>• • • • •</span>🏠</div><h1>Arriving in {o?.eta||25} min</h1><p>Order #{o?.id} • {o?.status?.replaceAll('_',' ')}</p><div className="route-driver"><span>RK</span><div><strong>{o?.driver||'Rahul Kumar'}</strong><small>Delivery partner</small></div><button type="button">Call</button></div></>}
function Profile() {
  const navigate = useNavigate()
  const [activeModal, setActiveModal] = React.useState(null)
  const [user, setUser] = React.useState(() => {
    return {
      name: sessionStorage.getItem('bowlCustomerName') || 'Priya Sharma',
      email: sessionStorage.getItem('bowlCustomerEmail') || 'priya@example.com',
      phone: sessionStorage.getItem('bowlCustomerMobile') || '+91 98765 43210',
    }
  })
  const [addresses, setAddresses] = React.useState([
    { id: 1, type: 'Home', address: '42, 5th Main Road, Indiranagar, Bengaluru - 560038', isDefault: true },
    { id: 2, type: 'Work', address: '12, MG Road, Tech Park, Bengaluru - 560001', isDefault: false },
  ])

  const handleAddAddress = () => {
    const newAddr = {
      id: Date.now(),
      type: 'Other',
      address: '7th Cross, Koramangala, Bengaluru - 560095',
      isDefault: false
    }
    setAddresses(prev => [...prev, newAddr])
  }
  const [paymentMethods] = React.useState([
    { id: 1, type: 'UPI', name: 'Google Pay', detail: 'priya@okicici', isDefault: true },
    { id: 2, type: 'Card', name: 'HDFC Credit Card', detail: '•••• 4092', isDefault: false },
    { id: 3, type: 'Wallet', name: 'Paytm Wallet', detail: '₹450 Balance', isDefault: false },
  ])

  const handleSaveProfile = (e) => {
    e.preventDefault()
    sessionStorage.setItem('bowlCustomerName', user.name)
    sessionStorage.setItem('bowlCustomerEmail', user.email)
    sessionStorage.setItem('bowlCustomerMobile', user.phone)
    setActiveModal(null)
  }

  const signOut = () => {
    sessionStorage.clear()
    navigate('/customer/signin', { replace: true })
  }

  return (
    <div className="profile-page-container">
      <div className="profile-header-card">
        <div className="profile-avatar">
          {user.name.split(' ').map(n => n[0]).join('').slice(0, 2) || 'PS'}
        </div>
        <div className="profile-info">
          <h2>{user.name}</h2>
          <span>{user.email}</span>
          <small>{user.phone}</small>
        </div>
        <button type="button" className="edit-profile-btn" onClick={() => setActiveModal('editProfile')}>
          Edit
        </button>
      </div>

      <div className="profile-menu-group">
        <button type="button" className="route-list-row profile-menu-item" onClick={() => setActiveModal('addresses')}>
          <span>📍 My Addresses</span>
          <b>{addresses.length} Saved ›</b>
        </button>

        <button type="button" className="route-list-row profile-menu-item" onClick={() => setActiveModal('payments')}>
          <span>💳 Saved Payments</span>
          <b>{paymentMethods.length} Methods ›</b>
        </button>

        <Link className="route-list-row profile-menu-item" to="/customer/notifications">
          <span>🔔 Notifications</span>
          <b>View ›</b>
        </Link>

        <button type="button" className="route-list-row profile-menu-item" onClick={() => setActiveModal('support')}>
          <span>🎧 Help & Support</span>
          <b>24x7 ›</b>
        </button>

        <button type="button" className="route-list-row profile-menu-item danger" onClick={() => setActiveModal('logout')}>
          <span><LogOut size={17}/> Sign Out</span>
          <b>›</b>
        </button>
      </div>

      {/* Edit Profile Modal */}
      {activeModal === 'editProfile' && (
        <div className="branch-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="branch-modal" onClick={e => e.stopPropagation()}>
            <div className="branch-modal-head">
              <h3>Edit Profile</h3>
              <button type="button" className="close-btn" onClick={() => setActiveModal(null)}>✕</button>
            </div>
            <form onSubmit={handleSaveProfile} className="profile-form">
              <label>
                <span>Full Name</span>
                <input 
                  type="text" 
                  value={user.name} 
                  onChange={e => setUser({ ...user, name: e.target.value })}
                  required 
                />
              </label>
              <label>
                <span>Email Address</span>
                <input 
                  type="email" 
                  value={user.email} 
                  onChange={e => setUser({ ...user, email: e.target.value })}
                  required 
                />
              </label>
              <label>
                <span>Phone Number</span>
                <input 
                  type="tel" 
                  value={user.phone} 
                  onChange={e => setUser({ ...user, phone: e.target.value })}
                  required 
                />
              </label>
              <button type="submit" className="route-primary">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* Addresses Modal */}
      {activeModal === 'addresses' && (
        <div className="branch-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="branch-modal" onClick={e => e.stopPropagation()}>
            <div className="branch-modal-head">
              <h3>Saved Addresses</h3>
              <button type="button" className="close-btn" onClick={() => setActiveModal(null)}>✕</button>
            </div>
            <div className="branch-modal-list">
              {addresses.map(a => (
                <div key={a.id} className="branch-option selected" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <strong>📍 {a.type}</strong>
                    {a.isDefault && <span className="offer-badge" style={{ fontSize: 8 }}>DEFAULT</span>}
                  </div>
                  <span style={{ fontSize: 10, color: '#666' }}>{a.address}</span>
                </div>
              ))}
            </div>
            <button 
              type="button" 
              className="route-secondary" 
              style={{ marginTop: 10, width: '100%' }}
              onClick={handleAddAddress}
            >
              + Add New Address
            </button>
          </div>
        </div>
      )}

      {/* Payments Modal */}
      {activeModal === 'payments' && (
        <div className="branch-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="branch-modal" onClick={e => e.stopPropagation()}>
            <div className="branch-modal-head">
              <h3>Saved Payments</h3>
              <button type="button" className="close-btn" onClick={() => setActiveModal(null)}>✕</button>
            </div>
            <div className="branch-modal-list">
              {paymentMethods.map(p => (
                <div key={p.id} className="branch-option selected">
                  <div className="branch-meta">
                    <strong>💳 {p.name}</strong>
                    <span>{p.detail}</span>
                  </div>
                  {p.isDefault && <span className="offer-badge" style={{ fontSize: 8 }}>DEFAULT</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Support Modal */}
      {activeModal === 'support' && (
        <div className="branch-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="branch-modal" onClick={e => e.stopPropagation()}>
            <div className="branch-modal-head">
              <h3>24x7 Help & Support</h3>
              <button type="button" className="close-btn" onClick={() => setActiveModal(null)}>✕</button>
            </div>
            <div className="branch-modal-list">
              <button type="button" className="branch-option" onClick={() => navigate('/support')}>
                <strong>💬 Live Support Chat</strong>
              </button>
              <button type="button" className="branch-option" onClick={() => alert('Calling Golden Food Bowl Helpline: 1800-500-BOWL')}>
                <strong>📞 Call Support (1800-500-BOWL)</strong>
              </button>
              <button type="button" className="branch-option" onClick={() => alert('Refund policy: 100% refund for cancelled or delayed orders.')}>
                <strong>📜 Refund & Cancellation Policy</strong>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {activeModal === 'logout' && (
        <div className="branch-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="branch-modal" onClick={e => e.stopPropagation()}>
            <div className="branch-modal-head">
              <h3>Confirm Sign Out</h3>
              <button type="button" className="close-btn" onClick={() => setActiveModal(null)}>✕</button>
            </div>
            <p style={{ fontSize: 12, color: '#555', margin: '8px 0 16px' }}>Are you sure you want to sign out from Golden Food Bowl?</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" className="route-secondary" style={{ flex: 1 }} onClick={() => setActiveModal(null)}>Cancel</button>
              <button type="button" className="route-primary" style={{ flex: 1, background: '#dc2626' }} onClick={signOut}>Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
function CustomerNotifications(){const {notifications}=usePrototypeContext();return <NotificationPanel notifications={notifications} role="customer"/>}
