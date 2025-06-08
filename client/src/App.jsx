import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Navigate } from 'react-router-dom';
import axiosInstance from './utils/axios';
import { UserProvider, useUser } from './contexts/UserContext'; // Import the UserProvider

// Import your Layouts and Components
import MainLayout from './Layout/MainLayout'; // Your MainLayout
import AdminRoute from './Components/AdminRoute.jsx'; // Your AdminRoute

// Import your Pages
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import NotFoundPage from './Pages/NotFoundPage';
import RegisterPage from './Pages/RegisterPage';
import TenantsPage from './Pages/TenantsPage';
import AddTenantPage from './Pages/AddTenantPage';
import TaxFormPage from './Pages/TaxFormPage';
import TenantPage, { tenantLoader } from './Pages/TenantPage';
import AddVacantShopPage from './Pages/AddVacantShopPage.jsx';
import VacantShopsPage from './Pages/VacantShopsPage.jsx';
import ContactPage from './Pages/ContactPage.jsx';
import EditVacantShopPage from './Pages/EditVacantShopPage.jsx';


function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      // The main layout for your entire application
      <Route path='/' element={<MainLayout/>}>
        {/* Public Routes (accessible to everyone) */}
        <Route index element={<HomePage />} />
        <Route path='*' element={<NotFoundPage />} /> {/* Catch-all for undefined routes */}
        <Route path='/login' element={<LoginPage />}/>
        <Route path='/register' element={<RegisterPage/>}/>
        <Route path='/vacant-shops' element={<VacantShopsPage/>} />
        <Route path='/contact' element={<ContactPage/>}/>

        {/* ADMIN PROTECTED ROUTES - These routes will only render if AdminRoute allows it */}
        {/* The AdminRoute element will render its <Outlet /> if user is admin,
            otherwise it will navigate to a different route (e.g., '/') */}
        <Route element={<AdminRoute />}>
          <Route path='/tenants' element={<TenantsPage/>}/>
          <Route path='/add-tenant' element={<AddTenantPage/>}/>
          <Route path='/tax-form/:id' element={<TaxFormPage/>}/>
          <Route path='/tenants/:id' element={<TenantPage/>} loader={tenantLoader} />
          <Route path='/add-vacant-shop' element={<AddVacantShopPage/>} />
          <Route path='/edit-vacant-shops/:id' element={<EditVacantShopPage />} /> 
          {/* Add any other routes that *only* admins should access here */}
        </Route>
        {/* End of ADMIN PROTECTED ROUTES */}

      </Route>
    )
  );

  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;