import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateCurrentUser,
} from "firebase/auth";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Message } from "primereact/message";
import { Divider } from "primereact/divider";
import { Password } from "primereact/password";
import { createUser } from "../../Api/api";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [nombre, setNombre] = useState("");

  const navigate = useNavigate();
  const auth = getAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await updateCurrentUser(auth, { displayName: nombre });
      await createUser({ name: nombre, email: email });
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  const footer = (
    <div className="p-text-center">
      <Divider />
      <p className="p-text-secondary">
        ¿Ya tienes cuenta?{" "}
        <a href="/login" className="p-text-primary">
          Inicia sesión
        </a>
      </p>
    </div>
  );

  return (
    <div id="register" className="register-wrapper">
      <Card title="Registro" footer={footer} className="register-card">
        <form onSubmit={handleRegister}>
          <div className="p-field">
            <label htmlFor="nombre">Nombre</label>
            <InputText
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ingresa tu nombre"
            />
          </div>
          <div className="p-field">
            <label htmlFor="email">Correo Electrónico</label>
            <InputText
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu correo electrónico"
            />
          </div>
          <div className="p-field">
            <label htmlFor="password">Contraseña</label>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              toggleMask
            />
          </div>
          {error && <Message severity="error" summary="Error" detail={error} />}
          <Button
            type="submit"
            label="Registrarse"
            className="p-button-primary"
          />
        </form>
      </Card>
    </div>
  );
};

export default Register;
