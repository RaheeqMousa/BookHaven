import React, {Suspense, lazy} from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'

const MainLayout = lazy(() => import('./Layouts/MainLayout'))


function App() {

  return (
    <>
      <BrowserRouter>
          <Routes >
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
              </Route>
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
