import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Navigate } from 'react-router-dom'
import axiosInstance from './utils/axios'
import { UserProvider, useUser } from './contexts/UserContext'; // Import the UserProvider
import MainLayout from './Layout/MainLayout'
import HomePage from './Pages/HomePage'
import LoginPage from './Pages/LoginPage'
import NotFoundPage from './Pages/NotFoundPage';
import RegisterPage from './Pages/RegisterPage';
import TenantsPage from './Pages/TenantsPage';
import AddTenantPage from './Pages/AddTenantPage'
import TaxFormPage from './Pages/TaxFormPage'
import TenantPage, { tenantLoader } from './Pages/TenantPage';



function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path ='/' element={<MainLayout/>}>
        <Route index element={<HomePage />} />
        <Route path='*' element={<NotFoundPage />} />
        <Route path='/login' element={<LoginPage />}/>
        <Route path='/register' element={<RegisterPage/>}/>
        <Route path='/tenants' element={<TenantsPage/>}/>
        <Route path='/add-tenant' element={<AddTenantPage/>}/>
        <Route path='/tax-form/:id' element={<TaxFormPage/>}/>
        <Route path='/tenants/:id' element={<TenantPage/>} loader={tenantLoader} />
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
