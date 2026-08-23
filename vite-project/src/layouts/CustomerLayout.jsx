import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Home, ClipboardList, ShoppingCart, Tag, Menu, UserRound } from 'lucide-react'
import '../styles/customer-polish.css'
import '../customer-panel-enhancements.css'
import '../customer-mobile-final.css'

const BOWL_LOGO = 'https://res.cloudinary.com/dwmjz9csc/image/upload/v1787120716/image-removebg-preview_e1wfil.png'

export function MobileStatusBar() {
  return null
}

export function CustomerLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const isCheckout = location.pathname === '/customer/checkout'
  const links = [['home','Home',Home],['orders','Orders',ClipboardList],['cart','Cart',ShoppingCart],['offers','Offers',Tag],['profile','More',Menu]]
  return (
    <div className={`mobile-prototype-frame customer-prototype-frame ${isCheckout ? 'checkout-page' : ''}`}>
      <div className="mobile-app-shell customer-app-shell">
        <CustomerHeader onProfile={() => navigate('/customer/profile')} />
        <main className="mobile-route-content customer-route-content"><Outlet /></main>
        <nav className="customer-bottom-nav" aria-label="Customer navigation">
          {links.map(([to,label,Icon]) => <NavLink key={to} to={`/customer/${to}`} className={({isActive}) => isActive ? 'active' : ''}><Icon size={23} strokeWidth={2.2}/><span>{label}</span></NavLink>)}
        </nav>
      </div>
    </div>
  )
}

export function CustomerHeader({ onProfile }) {
  return (
    <div className="goldbowl-top-header-group">
      <header className="goldbowl-customer-header">
        <NavLink to="/customer/home" className="goldbowl-brand" aria-label="Golden Food Bowl home">
          <img src={BOWL_LOGO} alt="Golden Food Bowl"/>
          <div className="brand-title-wrap">
            <strong className="header-company-name">GOLDEN FOOD BOWL</strong>
            <span className="header-company-tagline">Fresh • Tasty • Fast</span>
          </div>
        </NavLink>
        {sessionStorage.getItem('bowlCustomerAuth') === '1' && (
          <button type="button" className="profile-button" aria-label="Profile" onClick={onProfile}>
            <UserRound size={23}/>
          </button>
        )}
      </header>
    </div>
  )
}
