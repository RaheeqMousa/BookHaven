import React, {Suspense, lazy} from 'react'
import { Routes,Route } from 'react-router-dom'
import LoggedInProtectedRouter from './Components/LoggedInProtectedRoute/LoggedInProtectedRouter'
import AuthProtectedRoute from './Components/AuthProtectedRoute.jsx/AuthProtectedRoute'
import { BrowserRouter } from 'react-router-dom'
import UserContextProvider from './Context/UserContextProvider'
import NotFound from './Components/NotFound/NotFound'
import Loader from './Components/Loader/Loader'

const MainLayout = lazy(() => import('./Layouts/MainLayout'))
const Home = lazy(() => import('./Pages/Home/Home'))
const Login=  lazy(()=> import('./Pages/Login/Login'))
const Register = lazy(()=> import('./Pages/Register/Register'))
const Tasks = lazy(()=> import('./Pages/Tasks/Tasks'))
const Profile = lazy(()=> import('./Pages/Profile/Profile'))
const UpdateUsername = lazy(()=> import('./Pages/Profile/UpdateUsername'))
const ProfileInfo = lazy(()=> import('./Pages/Profile/ProfileInfo'))

function App() {

  return (
    <>
      <BrowserRouter>
        <UserContextProvider >
          <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />

              <Route element={<LoggedInProtectedRouter />}>
                <Route path="auth/login" element={<Login />} />
                <Route path="auth/register" element={<Register />} />
              </Route>

              <Route element={<AuthProtectedRoute />}>
                  <Route path="user/tasks" element={<Tasks />} />
                  <Route path="user/profile/" element={<Profile />} >
                    <Route path='ProfileInfo' element={<ProfileInfo />}/>
                    <Route path='UpdateUsername' element={<UpdateUsername />}/>
                  </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Route>

          </Routes>
          </Suspense>
          </UserContextProvider >
      </BrowserRouter>
    </>
  )
}

export default App
