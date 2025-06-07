import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Navigate } from 'react-router-dom'
import axiosInstance from './utils/axios'
import { UserProvider, useUser } from './contexts/UserContext'; // Import the UserProvider
import MainLayout from './Layout/MainLayout'
import HomePage from './Pages/HomePage'
import LoginPage from './Pages/LoginPage'
import NotFoundPage from './Pages/NotFoundPage';


function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path ='/' element={<MainLayout/>}>
        <Route index element={<HomePage />} />
        <Route path='*' element={<NotFoundPage />} />
        <Route path='/login' element={<LoginPage />}/>
      </Route>
    )
  )

  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  )
}

export default App
