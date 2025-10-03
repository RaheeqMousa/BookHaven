import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import AlreadyLoggedInRoute from './Components/AlreadyLoggedInRoute/AlreadyLoggedInRoute'
import AuthProtectedRoute from './Components/AuthProtectedRoute/AuthProtectedRoute'
import NotFound from './pages/NotFound/NotFound'
import SecondaryLayout from './Layouts/SecondaryLayout'
import MainLayout from './Layouts/MainLayout'
import Loader from './Components/Loader/Loader'

const Signin = lazy(()=> import('./pages/Signin/Signin'))
const Signup = lazy(()=> import('./pages/Signup/Signup'))
const BookDetails = lazy(()=> import('./pages/BookDetails/BookDetails'))
const SharedWishlist = lazy(()=> import('./pages/SharedWishlist/SharedWishlist'))
const Wishlist = lazy(()=> import('./pages/Wishlist/Wishlist'));
const Cart = lazy(() => import('./pages/Cart/Cart'))

function App() {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
            </Route>

            
            <Route path='/wishlist/:id' element={<SharedWishlist />} />

            <Route element={<SecondaryLayout />}>
              <Route path='/bookdetails' element={<BookDetails />} />
              <Route element={<AlreadyLoggedInRoute />}>
                <Route path="auth/login" element={<Signin />} />
                <Route path="auth/register" element={<Signup />} />
              </Route>

              <Route element={<AuthProtectedRoute />}>
                <Route path="user/wishlist" element={<Wishlist />} />
                <Route path='user/cart' element={<Cart />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  )
}

export default App
