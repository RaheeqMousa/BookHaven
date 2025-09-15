import React, {Suspense, lazy} from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const MainLayout = lazy(() => import('./Layouts/MainLayout'))


function App() {

  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>

            </Route>

          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
