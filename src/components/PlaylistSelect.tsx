import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/Store";
import { addMusicToPlaylist } from "../redux/PlaylistSlice";
import type { Music } from "../types/Music";
import { useState } from "react";

interface Props {
  music: Music;
}

export default function PlaylistSelect({ music }: Props) {
  const playlists = useSelector((state: RootState) => state.playlists.itens);
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const dispatch = useDispatch();
  const [selected, setSelected] = useState("");

  const userPlaylists = playlists.filter((p) => p.usuarioId === user.id);

  const handleAdd = () => {
    if (!selected) {
      alert("Selecione uma playlist!");
      return;
    }
    dispatch(addMusicToPlaylist({ playlistId: selected, music }));
    alert(`🎵 ${music.nome} foi adicionada à playlist!`);
    setSelected("");
  };

  return (
    <div style={{ marginTop: "0.8rem" }}>
      {userPlaylists.length === 0 ? (
        <p style={{ fontSize: "0.9rem", color: "#777" }}>
          Crie uma playlist primeiro 📂
        </p>
      ) : (
        <>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              width: "100%",
              marginBottom: "0.5rem",
            }}
          >
            <option value="">Selecione a playlist</option>
            {userPlaylists.map((pl) => (
              <option key={pl.id} value={pl.id}>
                {pl.nome}
              </option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#FFD700",
              color: "#000",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
              width: "100%",
            }}
          >
            ➕ Adicionar
          </button>
        </>
      )}
    </div>
  );
}
