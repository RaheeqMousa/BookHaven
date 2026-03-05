import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import AlreadyLoggedInRoute from './Components/AlreadyLoggedInRoute/AlreadyLoggedInRoute'
import AuthProtectedRoute from './Components/AuthProtectedRoute/AuthProtectedRoute'
import NotFound from './pages/NotFound/NotFound'
import SecondaryLayout from './Layouts/SecondaryLayout'
import MainLayout from './Layouts/MainLayout'
import Loader from './Components/Loader/Loader'
import { BooksProvider } from "./Context/BooksProvider";
import { BooksProviderData } from './Context/BooksProviderData'


const Signin = lazy(()=> import('./pages/Signin/Signin'))
const Signup = lazy(()=> import('./pages/Signup/Signup'))
const BookDetails = lazy(()=> import('./pages/BookDetails/BookDetails'))
const SharedWishlist = lazy(()=> import('./pages/SharedWishlist/SharedWishlist'))
const Wishlist = lazy(()=> import('./pages/Wishlist/Wishlist'));
const Cart = lazy(() => import('./pages/Cart/Cart'))
const VerifyEmail = lazy(() => import('./pages/VerifyEmail/VerifyEmail'))
const SendResetCode = lazy(() => import('./pages/SendResetCode/SendResetCode'))
const ResetPassword = lazy(() => import('./pages/ResetPassword/ResetPassword'))
const AuthLayout = lazy(() => import('./Layouts/AuthLayout'))
const CheckEmailPage = lazy(() => import('./pages/CheckEmail/CheckEmailPage'))

function App() {
  return (
    <>
      <BrowserRouter>
       <BooksProviderData>
          <BooksProvider>
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Home />} />
                </Route>

                
                <Route path='/wishlist/:id' element={<SharedWishlist />} />

                <Route element={<SecondaryLayout />}>
                  <Route path='/bookdetails/:id' element={<BookDetails />} />

                  <Route element={<AlreadyLoggedInRoute />}>
                  
                  
                    <Route path="auth" element={<AuthLayout />}>
                      <Route path="login" element={<Signin />} />
                      <Route path="register" element={<Signup />} />
                      <Route path="check-email" element={<CheckEmailPage />} />
                      <Route path="verify" element={<VerifyEmail />} />
                      <Route path="forgot-password" element={<SendResetCode />} />
                      <Route path="reset-password" element={<ResetPassword />} />
                    </Route>
                  </Route>

                  <Route element={<AuthProtectedRoute />}>
                    <Route path="user/wishlist" element={<Wishlist />} />
                    <Route path="user/cart" element={<Cart />} />
                  </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BooksProvider>
        </BooksProviderData>
      </BrowserRouter>
    </>
  )
}

export default App
