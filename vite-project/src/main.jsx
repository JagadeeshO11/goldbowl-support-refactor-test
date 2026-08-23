import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/globals.css'
import './App.css'
import './mobile-prototype.css'
import './route-prototype.css'
import './logo-size-fix.css'
import './customer-signin-mobile.css'
import { AppRouter } from './app/AppRouter.jsx'
import { PrototypeProvider } from './context/PrototypeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <PrototypeProvider>
        <AppRouter />
      </PrototypeProvider>
    </BrowserRouter>
  </StrictMode>,
)
