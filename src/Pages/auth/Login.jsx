import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import { Link, useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Message } from "primereact/message";
import { Divider } from "primereact/divider";
import { Password } from "primereact/password";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Credenciales inválidas: " + err.message);
    }
  };

  const footer = (
    <div className="p-text-center">
      <Divider />
      <p className="p-text-secondary">
        ¿No tienes cuenta?{" "}
        <Link to="/register" className="p-text-primary">
          Regístrate
        </Link>
      </p>
    </div>
  );

  return (
    <div className="login-container" id="login">
      <Card title="Iniciar Sesión" footer={footer} className="login-card">
        {error && <Message severity="error" summary="Error" detail={error} />}
        <form onSubmit={handleLogin}>
          <div className="p-field">
            <label htmlFor="email">Correo Electrónico</label>
            <InputText
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="p-field">
            <label htmlFor="password">Contraseña</label>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" label="Iniciar Sesión" className="p-mt-2" />
        </form>
      </Card>
    </div>
  );
};

export default Login;
