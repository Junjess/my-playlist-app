import { useNavigate, useLocation } from "react-router-dom";
import logoBatucao from "../assets/logo_batucao.png"; // importa a logo

interface HeaderProps {
  titulo?: string;
}

export default function Header({ titulo }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleVoltar = () => {
    navigate(-1);
  };

  return (
    <header
      style={{
        background: "linear-gradient(90deg, #009739, #ffcc29)",
        padding: "0.8rem 1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Logo + Nome BatuCão */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          gap: "0.5rem",
        }}
        onClick={() => navigate("/home")}
      >
        <img
          src={logoBatucao}
          alt="Logo BatuCão"
          style={{ width: "70px", height: "70px", objectFit: "contain" }}
        />
        <span style={{ fontSize: "1.4rem", fontWeight: "bold" }}>BatuCão</span>
      </div>

      {/* Título da página */}
      <h2 style={{ margin: 0, fontSize: "1.2rem" }}>{titulo}</h2>

      {/* Botão voltar */}
      {location.pathname !== "/home" ? (
        <button
          onClick={handleVoltar}
          style={{
            backgroundColor: "#fff",
            color: "#009739",
            padding: "0.4rem 0.8rem",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ⬅ Voltar
        </button>
      ) : (
        <div style={{ width: "70px" }} /> // espaçamento para manter alinhamento
      )}
    </header>
  );
}
