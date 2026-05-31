import { RouterProvider } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { InterviewProvider } from './context/InterviewContext';
import router from './routes';

export default function App() {
  return (
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={router} />
      </InterviewProvider>
    </AuthProvider>
  );
}
