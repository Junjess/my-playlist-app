import { createSlice } from "@reduxjs/toolkit";
import type {PayloadAction } from "@reduxjs/toolkit";
import type { Playlist } from "../types/Playlist";
import type { Music } from "../types/Music";

const STORAGE_KEY = "batucao_playlists";

const loadAllPlaylists = (): Playlist[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveAllPlaylists = (playlists: Playlist[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
};

const loadUserPlaylists = (): Playlist[] => {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const all = loadAllPlaylists();
  return all.filter((p) => p.usuarioId === user.id);
};

interface PlaylistState {
  itens: Playlist[];
}

const initialState: PlaylistState = {
  itens: loadUserPlaylists(),
};

const playlistSlice = createSlice({
  name: "playlists",
  initialState,
  reducers: {
    addPlaylist: (state, action: PayloadAction<Playlist>) => {
      const all = loadAllPlaylists();
      all.push(action.payload);
      saveAllPlaylists(all);
      const user = JSON.parse(sessionStorage.getItem("user") || "{}");
      state.itens = all.filter((p) => p.usuarioId === user.id);
    },
    deletePlaylist: (state, action: PayloadAction<string>) => {
      const all = loadAllPlaylists().filter((p) => p.id !== action.payload);
      saveAllPlaylists(all);
      const user = JSON.parse(sessionStorage.getItem("user") || "{}");
      state.itens = all.filter((p) => p.usuarioId === user.id);
    },
    editPlaylist: (state, action: PayloadAction<{ id: string; nome: string }>) => {
      const all = loadAllPlaylists();
      const pl = all.find((p) => p.id === action.payload.id);
      if (pl) pl.nome = action.payload.nome;
      saveAllPlaylists(all);
      const user = JSON.parse(sessionStorage.getItem("user") || "{}");
      state.itens = all.filter((p) => p.usuarioId === user.id);
    },
    addMusicToPlaylist: (
      state,
      action: PayloadAction<{ playlistId: string; music: Music }>
    ) => {
      const all = loadAllPlaylists();
      const pl = all.find((p) => p.id === action.payload.playlistId);
      if (pl && !pl.musicas.some((m) => m.id === action.payload.music.id)) {
        pl.musicas.push(action.payload.music);
        saveAllPlaylists(all);
      }
      const user = JSON.parse(sessionStorage.getItem("user") || "{}");
      state.itens = all.filter((p) => p.usuarioId === user.id);
    },
    removeMusicFromPlaylist: (
      state,
      action: PayloadAction<{ playlistId: string; musicId: string }>
    ) => {
      const all = loadAllPlaylists();
      const pl = all.find((p) => p.id === action.payload.playlistId);
      if (pl) {
        pl.musicas = pl.musicas.filter((m) => m.id !== action.payload.musicId);
        saveAllPlaylists(all);
      }
      const user = JSON.parse(sessionStorage.getItem("user") || "{}");
      state.itens = all.filter((p) => p.usuarioId === user.id);
    },
    loadPlaylistsAfterLogin: (state) => {
      state.itens = loadUserPlaylists();
    },
  },
});

export const {
  addPlaylist,
  deletePlaylist,
  editPlaylist,
  addMusicToPlaylist,
  removeMusicFromPlaylist,
  loadPlaylistsAfterLogin,
} = playlistSlice.actions;

export default playlistSlice.reducer;
