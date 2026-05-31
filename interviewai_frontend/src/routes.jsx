import { createBrowserRouter } from 'react-router';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Interview from './pages/Interview';
import Protected from './components/Protected';

const router = createBrowserRouter([
  { path: '/login',    element: <Login /> },
  { path: '/register', element: <Register /> },
  {
    path: '/',
    element: <Protected><Home /></Protected>,
  },
  {
    path: '/interview/:interviewId',
    element: <Protected><Interview /></Protected>,
  },
]);

export default router;
