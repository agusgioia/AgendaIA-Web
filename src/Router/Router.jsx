import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import Dashboard from "../Pages/Dashboard";
import Agenda from "../Pages/Agenda";
import Login from "../Pages/auth/Login";
import Register from "../Pages/auth/Register";

function PrivateRoute({ children }) {
  const { user } = useAuth();

  return user ? children : <Navigate to="/login" />;
}

export default function Router() {
  const { loading } = useAuth();

  if (loading) return <h1>Cargando...</h1>;

  return (
    <BrowserRouter>
      <Routes>
        {/* públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* privadas */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/agenda"
          element={
            <PrivateRoute>
              <Agenda />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
