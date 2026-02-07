import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Styles/base.css'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { FacebookProvider } from 'react-facebook'
import { UserProvider } from './Context/UserProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
      <FacebookProvider appId={import.meta.env.VITE_FACEBOOK_APP_ID} version="v18.0">
        <UserProvider>
          <App />
        </UserProvider> 
      </FacebookProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
