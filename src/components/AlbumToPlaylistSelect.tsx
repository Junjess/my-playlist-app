import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/Store";
import { addPlaylist, addMusicToPlaylist } from "../redux/PlaylistSlice";
import { buscarMusicasDoAlbum } from "../service/api";
import type { Music } from "../types/Music";
import { useState } from "react";

interface Props {
  albumId: string;
  albumNome: string;
  artista: string;
}

export default function AlbumToPlaylistSelect({ albumId, albumNome, artista }: Props) {
  const playlists = useSelector((state: RootState) => state.playlists.itens);
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const dispatch = useDispatch();
  const [selected, setSelected] = useState("");

  const userPlaylists = playlists.filter((p) => p.usuarioId === user.id);
  
  const handleCreateNew = async () => {
    const musicas = await buscarMusicasDoAlbum(albumId);
    if (musicas.length === 0) {
      alert("⚠ Nenhuma faixa encontrada neste álbum!");
      return;
    }
    dispatch(
      addPlaylist({
        id: Date.now().toString(),
        nome: `${albumNome} - ${artista}`,
        usuarioId: user.id,
        musicas,
      })
    );
    alert(`📀 Álbum "${albumNome}" foi salvo como nova playlist com ${musicas.length} músicas!`);
  };
  const handleAddToExisting = async () => {
    if (!selected) {
      alert("Selecione uma playlist existente!");
      return;
    }
    const musicas = await buscarMusicasDoAlbum(albumId);
    if (musicas.length === 0) {
      alert("⚠ Nenhuma faixa encontrada neste álbum!");
      return;
    }
    for (const musica of musicas) {
      dispatch(addMusicToPlaylist({ playlistId: selected, music: musica }));
    }
    alert(`📀 Álbum "${albumNome}" adicionado à playlist selecionada (${musicas.length} faixas).`);
    setSelected("");
  };

  return (
    <div style={{ marginTop: "0.8rem" }}>
      {userPlaylists.length === 0 ? (
        <button
          onClick={handleCreateNew}
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
          📀 Criar playlist com este álbum
        </button>
      ) : (
        <>
          <button
            onClick={handleCreateNew}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#32CD32",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
              width: "100%",
              marginBottom: "0.5rem",
            }}
          >
            ➕ Nova Playlist com este Álbum
          </button>

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
            <option value="">Adicionar a playlist existente...</option>
            {userPlaylists.map((pl) => (
              <option key={pl.id} value={pl.id}>
                {pl.nome}
              </option>
            ))}
          </select>

          <button
            onClick={handleAddToExisting}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#FFA500",
              color: "#000",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
              width: "100%",
            }}
          >
            📂 Adicionar este Álbum à Playlist
          </button>
        </>
      )}
    </div>
  );
}
