import { Navigate, Outlet, useLocation } from 'react-router-dom'

export function CustomerAuthGuard(){
  const location = useLocation()
  const authenticated = sessionStorage.getItem('bowlCustomerAuth') === '1'
  const relativePath = location.pathname.replace(/^\/customer\/?/, '') || 'home'
  const publicPrefixes = ['home', 'search', 'categories', 'offers', 'product/']
  const isPublic = publicPrefixes.some(prefix => relativePath === prefix || relativePath.startsWith(prefix))

  if(authenticated || isPublic) return <Outlet />

  // Remember exactly what the customer was trying to do. The sign-in page
  // can complete normally and the home page will restore this destination.
  const from = `${location.pathname}${location.search}${location.hash}`
  sessionStorage.setItem('bowlCustomerPendingRedirect', from)
  return <Navigate to={`/customer/signin?redirect=${encodeURIComponent(from)}`} replace state={{ from }} />
}

export function DeliveryAuthGuard(){
  const location=useLocation()
  const sessionReady=sessionStorage.getItem('bowlDeliveryAuth')==='1'
  const onboarding=JSON.parse(localStorage.getItem('bowlDeliveryOnboarding')||'{}')
  const ready=sessionReady || onboarding.verificationStatus==='VERIFIED'
  return ready ? <Outlet/> : <Navigate to="/delivery/signin" replace state={{from:location.pathname}} />
}

export function AdminAuthGuard(){
  const location=useLocation()
  const ready=sessionStorage.getItem('bowlAdminAuth')==='1'
  return ready ? <Outlet/> : <Navigate to="/admin/signin" replace state={{from:location.pathname}} />
}

export function SupportAuthGuard(){
  const location=useLocation()
  const ready=sessionStorage.getItem('bowlSupportAuth')==='1'
  return ready ? <Outlet/> : <Navigate to="/support/signin" replace state={{from:location.pathname}} />
}
