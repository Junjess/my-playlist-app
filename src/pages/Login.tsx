import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import logoBatucao from "../assets/logo_batucao.png";
import { useToast } from "../utils/ToastContext";
import { loadPlaylistsAfterLogin } from "../redux/PlaylistSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();
  const dispatch = useDispatch();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) {
      showToast("⚠ Digite um email válido!", "error");
      return;
    }
    if (senha.length < 6) {
      showToast("⚠ A senha deve ter no mínimo 6 caracteres!", "error");
      return;
    }
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    let user = usuarios.find((u: any) => u.email === email);
    if (!user) {
      user = {
        id: Date.now(),
        email,
        senha,
      };
      usuarios.push(user);
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      showToast("🆕 Conta criada com sucesso!", "success");
    } else if (user.senha !== senha) {
      showToast("❌ Senha incorreta!", "error");
      return;
    }
    sessionStorage.setItem("user", JSON.stringify(user));
    dispatch(loadPlaylistsAfterLogin());
    showToast(`✅ Bem-vindo(a), ${user.email}!`, "success");
    navigate("/home");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #009739, #ffcc29)",
        fontFamily: "Arial, sans-serif",
        padding: "1rem",
      }}
    >
      {/* Logo no topo */}
      <div style={{ marginBottom: "1rem", textAlign: "center" }}>
        <img
          src={logoBatucao}
          alt="Logo BatuCão"
          style={{
            width: "120px",
            height: "120px",
            objectFit: "contain",
          }}
        />
        <h1 style={{ color: "#fff", marginTop: "0.5rem" }}>BatuCão</h1>
      </div>

      <form
        onSubmit={handleLogin}
        style={{
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#006400" }}>Login</h2>

        <input
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          style={{
            padding: "0.8rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        />

        <input
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          autoComplete="current-password"
          style={{
            padding: "0.8rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "0.8rem",
            backgroundColor: "#FFD700",
            color: "#000",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "1rem",
            transition: "0.3s",
          }}
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
