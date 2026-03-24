import Navbar from "./Navbar";
import Header from "./Header";
import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
import { signOut, getAuth } from "firebase/auth";
import useAuth from "../Hooks/useAuth";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const HandleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    navigate("/login");
  };

  const sessionButtons = user ? (
    <div className="flex items-center gap-4">
      <span className="text-gray-200">Hola, {user.name}</span>
      <Button
        label="Logout"
        className="p-button-text text-gray-200 hover:text-white"
        onClick={HandleLogout}
      />
    </div>
  ) : (
    <div className="flex items-center gap-4">
      <Link to="/login">
        <Button
          label="Login"
          className="p-button-text text-gray-200 hover:text-white"
        />
      </Link>
      <Link to="/register">
        <Button
          label="Register"
          className="p-button-text text-gray-200 hover:text-white"
        />
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* NAVBAR */}
      <div className="flex justify-between items-center px-6 py-4 bg-gray-900 border-b border-gray-800">
        <Navbar />
        {sessionButtons}
      </div>

      {/* CONTENIDO */}
      <div className="flex flex-col flex-1">
        <Header />
        <div className="p-6 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
