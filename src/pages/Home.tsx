import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { limparTop10 } from "../redux/MusicSlice";
import Header from "../components/Header";
import { useToast } from "../utils/ToastContext";

interface User {
  id: number;
  email: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast(); 

  useEffect(() => {
    const data = sessionStorage.getItem("user");
    if (data) {
      setUser(JSON.parse(data));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    dispatch(limparTop10());
    showToast("👋 Sessão encerrada com sucesso!", "info"); 
    navigate("/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Header titulo="Página Inicial" />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#009739" }}>
          Bem-vindo ao BatuCão
        </h1>

        {user && (
          <p style={{ fontSize: "1.2rem", marginBottom: "2rem", color: "#333" }}>
            Você está logado como <strong>{user.email}</strong>
          </p>
        )}

        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            style={{
              padding: "0.8rem 1.5rem",
              backgroundColor: "#006400",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "bold",
              transition: "0.3s",
            }}
            onClick={() => navigate("/playlists")}
          >
            📂 Minhas Playlists
          </button>

          <button
            style={{
              padding: "0.8rem 1.5rem",
              backgroundColor: "#FFD700",
              color: "black",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "bold",
              transition: "0.3s",
            }}
            onClick={() => navigate("/musicas")}
          >
            🎵 Buscar Músicas
          </button>

          <button
            style={{
              padding: "0.8rem 1.5rem",
              backgroundColor: "#B22222",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "bold",
              transition: "0.3s",
            }}
            onClick={handleLogout}
          >
            🚪 Sair
          </button>
        </div>
      </div>
    </div>
  );
}
