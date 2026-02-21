import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import FirebaseAction from './pages/FirebaseAction';
import Home from './pages/Home';
import Download from './pages/Download';

function App() {
  const { token } = useAuthStore();

  return (
    <div className="h-screen bg-discord-darkest dark">
      <Routes>
        <Route path="/" element={!token ? <Landing /> : <Home />} />
        <Route path="/download" element={<Download />} />
        <Route path="/auth/action" element={<FirebaseAction />} />
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />
        <Route path="/forgot-password" element={!token ? <ForgotPassword /> : <Navigate to="/" />} />
        <Route path="/app/*" element={token ? <Home /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
