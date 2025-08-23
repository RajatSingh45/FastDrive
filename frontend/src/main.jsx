import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import CaptainDataContext from './contexts/CaptainDataContext.jsx'
import RideContextProvider from './contexts/rideContext.jsx'
import SocketContextProvider from './contexts/SocketContext.jsx'
import UserContextProvider from './contexts/userDataContext.jsx'


createRoot(document.getElementById('root')).render(
  <CaptainDataContext>
    <UserContextProvider>
    <RideContextProvider>
      <SocketContextProvider>
      <BrowserRouter>
      <App />
    </BrowserRouter>
    </SocketContextProvider>
    </RideContextProvider>
    </UserContextProvider>
    </CaptainDataContext>
)
