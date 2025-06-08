// src/Components/AdminRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../contexts/UserContext'; 
import Spinner from './Spinner'; 

const AdminRoute = () => {
  const { user, token } = useUser(); // Get user and token from context

  // IMPORTANT: Add a check for user and token existence
  // This helps differentiate between 'not logged in yet' and 'not an admin'
  // If user and token are still null during initial render,
  // you might want to show a loading spinner or wait for the UserContext to initialize.
  // Assuming UserContext handles loading from localStorage on mount.
  
  if (user === null && token === null) {
      // User data is still loading from localStorage or not logged in
      // You might want a more sophisticated loading state in UserContext
      // or redirect to login. For now, let's assume if they are null, they are not admin.
      // Or, if UserContext itself has a 'loading' state, use that.
      // For this example, we'll navigate to login.
      console.log('AdminRoute: User or token not available, redirecting to login.');
      return <Navigate to="/login" replace />;
  }

  // Check if the user exists and their role is 'admin'
  if (user && user.role === 'admin') {
    console.log('AdminRoute: User is admin. Rendering child routes.');
    return <Outlet />; // Render the child routes
  } else {
    // If not an admin, redirect them
    console.log('AdminRoute: User is NOT admin or not logged in. Redirecting to home.');
    // You can redirect to '/login' or a '/not-authorized' page
    return <Navigate to="/" replace />; // Redirect to home page
  }
};

export default AdminRoute;