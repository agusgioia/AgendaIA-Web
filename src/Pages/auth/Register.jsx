import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { createUser } from "../../Api/api";
import s from "./AuthStyles";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateProfile(userCredential.user, { displayName: nombre });
      await createUser({ name: nombre, email: email });
      navigate("/login");
    } catch (err) {
      setError("Error al registrarse: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.page}>
      <div className={s.wrapper}>
        <div className={s.header}>
          <div className={s.logo}>✨</div>
          <h1 className={s.title}>Crear cuenta</h1>
          <p className={s.subtitle}>Tu asistente de agenda personal con IA</p>
        </div>

        <div className={s.card}>
          {error && (
            <div className={s.error}>
              <span className="mt-0.5">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className={s.form}>
            <div>
              <label className={s.fieldLabel}>Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
                required
                className={s.input}
              />
            </div>

            <div>
              <label className={s.fieldLabel}>Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vos@ejemplo.com"
                required
                className={s.input}
              />
            </div>

            <div>
              <label className={s.fieldLabel}>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                className={s.input}
              />
            </div>

            <button type="submit" disabled={loading} className={s.button}>
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <div className={s.dividerRow}>
            <div className={s.dividerLine} />
            <span className={s.dividerText}>o</span>
            <div className={s.dividerLine} />
          </div>

          <p className={s.linkRow}>
            ¿Ya tenés cuenta?{" "}
            <Link to="/login" className={s.link}>
              Iniciá sesión
            </Link>
          </p>
        </div>

        <p className={s.footer}>Agenda IA — Tu asistente personal</p>
      </div>
    </div>
  );
};

export default Register;
