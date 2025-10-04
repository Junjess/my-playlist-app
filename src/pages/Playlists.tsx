import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/Store";
import {
  addPlaylist,
  deletePlaylist,
  editPlaylist,
  removeMusicFromPlaylist,
} from "../redux/PlaylistSlice";
import type { Playlist } from "../types/Playlist";
import Header from "../components/Header";
import { useToast } from "../utils/ToastContext"; 

export default function Playlists() {
  const playlists = useSelector((state: RootState) => state.playlists.itens);
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const dispatch = useDispatch();
  const { showToast } = useToast(); 

  const [nome, setNome] = useState("");
  const [editando, setEditando] = useState<string | null>(null);
  const [novoNome, setNovoNome] = useState("");
  const [lastPlaylistId, setLastPlaylistId] = useState<string | null>(null);
  const [expandida, setExpandida] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("lastPlaylist");
    if (stored) setLastPlaylistId(stored);
  }, []);
  
  const handleAdd = () => {
    if (nome.trim() === "") {
      showToast("⚠ Digite um nome para a playlist!", "error");
      return;
    }
    const nova: Playlist = {
      id: Date.now().toString(),
      nome,
      usuarioId: user?.id || 0,
      musicas: [],
    };
    dispatch(addPlaylist(nova));
    setNome("");
    showToast(`📂 Playlist "${nova.nome}" criada com sucesso!`, "success");
  };
  const handleEdit = (id: string) => {
    if (novoNome.trim() === "") {
      showToast("⚠ Digite um novo nome!", "error");
      return;
    }
    dispatch(editPlaylist({ id, nome: novoNome }));
    showToast(`✏️ Playlist renomeada para "${novoNome}"!`, "success");
    setEditando(null);
    setNovoNome("");
  };
  const handleDelete = (id: string) => {
    if (confirm("Deseja excluir esta playlist?")) {
      dispatch(deletePlaylist(id));
      if (lastPlaylistId === id) {
        sessionStorage.removeItem("lastPlaylist");
        setLastPlaylistId(null);
      }
      showToast("🗑 Playlist excluída com sucesso!", "error");
    }
  };

  const handleAccess = (id: string) => {
    sessionStorage.setItem("lastPlaylist", id);
    setLastPlaylistId(id);
    showToast(`▶️ Tocando playlist "${playlists.find((p) => p.id === id)?.nome}"`, "info");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        fontFamily: "Arial, sans-serif",
        paddingBottom: "2rem",
      }}
    >
      <Header titulo="Minhas Playlists" />

      {/* Criar nova playlist */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          margin: "1.5rem 0",
        }}
      >
        <input
          type="text"
          placeholder="Nome da playlist"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={{
            padding: "0.8rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "250px",
          }}
        />
        <button
          onClick={handleAdd}
          style={{
            padding: "0.8rem 1.5rem",
            backgroundColor: "#009739",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ➕ Criar Playlist
        </button>
      </div>

      {/* Listagem de playlists */}
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {playlists.length === 0 ? (
          <p style={{ textAlign: "center" }}>Nenhuma playlist criada ainda 🎶</p>
        ) : (
          playlists.map((pl) => (
            <div
              key={pl.id}
              style={{
                background: lastPlaylistId === pl.id ? "#eaffea" : "#fff",
                border: lastPlaylistId === pl.id ? "2px solid #009739" : "1px solid #ddd",
                padding: "1.2rem",
                marginBottom: "1.2rem",
                borderRadius: "12px",
                boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
                transition: "0.2s",
              }}
            >
              {editando === pl.id ? (
                <div style={{ display: "flex", gap: "1rem" }}>
                  <input
                    type="text"
                    value={novoNome}
                    onChange={(e) => setNovoNome(e.target.value)}
                    placeholder="Novo nome"
                    style={{
                      flex: 1,
                      padding: "0.6rem",
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                    }}
                  />
                  <button
                    onClick={() => handleEdit(pl.id)}
                    style={{
                      backgroundColor: "#009739",
                      border: "none",
                      borderRadius: "6px",
                      padding: "0.5rem 1rem",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    ✅ Salvar
                  </button>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h3 style={{ margin: 0, color: "#222" }}>
                      📂 {pl.nome}{" "}
                      {lastPlaylistId === pl.id && (
                        <span style={{ color: "#009739", fontSize: "0.9rem" }}>
                          🟢 Última acessada
                        </span>
                      )}
                    </h3>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        style={{
                          backgroundColor: "#1E90FF",
                          border: "none",
                          borderRadius: "6px",
                          padding: "0.4rem 1rem",
                          cursor: "pointer",
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                        onClick={() => {
                          setEditando(pl.id);
                          setNovoNome(pl.nome);
                        }}
                      >
                        ✏️ Renomear
                      </button>
                      <button
                        style={{
                          backgroundColor: "#B22222",
                          border: "none",
                          borderRadius: "6px",
                          padding: "0.4rem 1rem",
                          cursor: "pointer",
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                        onClick={() => handleDelete(pl.id)}
                      >
                        🗑 Excluir
                      </button>
                      <button
                        style={{
                          backgroundColor: "#32CD32",
                          border: "none",
                          borderRadius: "6px",
                          padding: "0.4rem 1rem",
                          cursor: "pointer",
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                        onClick={() => handleAccess(pl.id)}
                      >
                        ▶️ Tocar Playlist
                      </button>
                      {pl.musicas.length > 0 && (
                        <button
                          style={{
                            backgroundColor: "#FFD700",
                            border: "none",
                            borderRadius: "6px",
                            padding: "0.4rem 1rem",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                          onClick={() =>
                            setExpandida(expandida === pl.id ? null : pl.id)
                          }
                        >
                          {expandida === pl.id ? "⬆ Ocultar músicas" : "⬇ Mostrar músicas"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Lista de músicas (expandível) */}
                  {expandida === pl.id && pl.musicas.length > 0 && (
                    <div
                      style={{
                        marginTop: "1rem",
                        background: "#f9f9f9",
                        borderRadius: "8px",
                        padding: "0.8rem",
                      }}
                    >
                      <h4 style={{ margin: "0 0 0.5rem 0", color: "#444" }}>
                        🎶 Músicas ({pl.musicas.length})
                      </h4>
                      <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
                        {pl.musicas.map((m) => (
                          <li
                            key={m.id}
                            style={{
                              marginBottom: "0.4rem",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span>
                              🎵 {m.nome} - {m.artista}
                            </span>
                            <button
                              onClick={() =>
                                dispatch(
                                  removeMusicFromPlaylist({
                                    playlistId: pl.id,
                                    musicId: m.id,
                                  })
                                )
                              }
                              style={{
                                marginLeft: "0.5rem",
                                color: "#B22222",
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                fontSize: "1rem",
                              }}
                            >
                              ❌
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
