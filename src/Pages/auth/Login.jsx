import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import { Link, useNavigate } from "react-router-dom";
import s from "./AuthStyles";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Credenciales inválidas. Revisá tu correo y contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.page}>
      <div className={s.wrapper}>
        <div className={s.header}>
          <div className={s.logo}>📅</div>
          <h1 className={s.title}>Bienvenido de nuevo</h1>
          <p className={s.subtitle}>Iniciá sesión para gestionar tu agenda</p>
        </div>

        <div className={s.card}>
          {error && (
            <div className={s.error}>
              <span className="mt-0.5">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className={s.form}>
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
                placeholder="••••••••"
                required
                className={s.input}
              />
            </div>

            <button type="submit" disabled={loading} className={s.button}>
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          <div className={s.dividerRow}>
            <div className={s.dividerLine} />
            <span className={s.dividerText}>o</span>
            <div className={s.dividerLine} />
          </div>

          <p className={s.linkRow}>
            ¿No tenés cuenta?{" "}
            <Link to="/register" className={s.link}>
              Registrate
            </Link>
          </p>
        </div>

        <p className={s.footer}>Agenda IA — Tu asistente personal</p>
      </div>
    </div>
  );
};

export default Login;
