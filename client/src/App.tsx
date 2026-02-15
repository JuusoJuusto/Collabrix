import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';

function App() {
  const { token } = useAuthStore();

  return (
    <div className="h-screen bg-discord-darkest dark">
      <Routes>
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />
        <Route path="/forgot-password" element={!token ? <ForgotPassword /> : <Navigate to="/" />} />
        <Route path="/*" element={token ? <Home /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
