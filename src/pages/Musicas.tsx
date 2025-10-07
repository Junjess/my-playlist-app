import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/Store";
import { fetchMusicas } from "../redux/MusicSlice";
import Header from "../components/Header";
import PlaylistSelect from "../components/PlaylistSelect";
import AlbumToPlaylistSelect from "../components/AlbumToPlaylistSelect";
import { useToast } from "../utils/ToastContext";

export default function Musicas() {
  const dispatch = useDispatch<AppDispatch>();
  const { itens, titulo, status } = useSelector(
    (state: RootState) => state.musicas
  );

  const [artista, setArtista] = useState("");
  const [nome, setNome] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    dispatch(fetchMusicas(""));
  }, [dispatch]);

  const handleSearch = () => {
    const termo = artista && nome ? `${artista}::${nome}` : artista || nome;
    dispatch(fetchMusicas(termo));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Header titulo={titulo} />

      {/* Barra de pesquisa */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "1.5rem 0",
          gap: "0.5rem",
        }}
      >
        <input
          type="text"
          placeholder="Artista..."
          value={artista}
          onChange={(e) => setArtista(e.target.value)}
          style={{
            padding: "0.8rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "200px",
          }}
        />
        <input
          type="text"
          placeholder="Música ou Álbum..."
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={{
            padding: "0.8rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "200px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "0.8rem 1.2rem",
            borderRadius: "8px",
            backgroundColor: "#009739",
            color: "#fff",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          🔍 Buscar
        </button>
      </div>

      {/* Resultados */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.5rem",
          padding: "0 2rem 2rem",
        }}
      >
        {status === "loading" ? (
          <p style={{ textAlign: "center" }}>⏳ Carregando...</p>
        ) : itens.length === 0 ? (
          <p style={{ textAlign: "center", color: "#333" }}>
            Nenhum resultado encontrado 🎶
          </p>
        ) : (
          itens.map((m) => (
            <div
              key={m.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
                overflow: "hidden",
                transition: "transform 0.2s",
                minHeight: "360px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <img
                src={
                  m.capa || "https://via.placeholder.com/300x200?text=Sem+Capa"
                }
                alt={m.nome}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "contain",
                  backgroundColor: "#f0f0f0",
                }}
              />
              <div
                style={{
                  flex: 1,
                  padding: "1rem",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <h4
                  style={{
                    margin: "0.5rem 0",
                    fontSize: "1.2rem",
                    color: "#222",
                  }}
                >
                  {m.nome}
                </h4>
                <p
                  style={{
                    margin: "0.4rem 0",
                    fontSize: "1rem",
                    color: "#009739",
                  }}
                >
                  👤 {m.artista}
                </p>
                <p
                  style={{
                    margin: "0.3rem 0",
                    fontSize: "0.9rem",
                    color: "#666",
                  }}
                >
                  {m.tipo}
                </p>

                {/* Botões de ação */}
                {m.tipo === "Música" && <PlaylistSelect music={m} />}

                {m.tipo === "Álbum" && (
                  <AlbumToPlaylistSelect
                    albumId={m.id}
                    albumNome={m.nome}
                    artista={m.artista}
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
