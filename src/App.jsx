import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import AlreadyLoggedInRoute from './Components/AlreadyLoggedInRoute/AlreadyLoggedInRoute'
import AuthProtectedRoute from './Components/AuthProtectedRoute/AuthProtectedRoute'
import Wishlist from './pages/Wishlist/Wishlist';
import Profile from './pages/Profile/Profile';
import SecondaryLayout from './Layouts/SecondaryLayout'
import MainLayout from './Layouts/MainLayout'
import Loader from './Components/Loader/Loader'
import Signin from './pages/Signin/Signin'
import Signup from './pages/Signup/Signup'
import NotFound from './pages/NotFound/NotFound'
import BookDetails from './pages/BookDetails/BookDetails'
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

            <Route path='/bookdetails' element={<BookDetails />} />

            <Route element={<SecondaryLayout />}>
              <Route element={<AlreadyLoggedInRoute />}>
                <Route path="auth/login" element={<Signin />} />
                <Route path="auth/register" element={<Signup />} />
              </Route>

              <Route element={<AuthProtectedRoute />}>
                <Route path="user/wishlist" element={<Wishlist />} />
                <Route path="user/profile" element={<Profile />} >
                  <Route path='user/cart' element={<Cart />} />
                </Route>
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
