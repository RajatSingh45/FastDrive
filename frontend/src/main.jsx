import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import UserContext from './contexts/UserDataContext.jsx'
import CaptainDataContext from './contexts/CaptainDataContext.jsx'
import RideContextProvider from './contexts/rideContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CaptainDataContext>
    <BrowserRouter>
    <UserContext>
    <RideContextProvider>
      <App />
    </RideContextProvider>
    </UserContext>
    </BrowserRouter>
    </CaptainDataContext>
  </StrictMode>,
)
