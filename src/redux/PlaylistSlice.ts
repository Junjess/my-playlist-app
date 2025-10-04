import { createSlice} from "@reduxjs/toolkit";
import type {PayloadAction}from "@reduxjs/toolkit";
import type { Playlist } from "../types/Playlist";
import type { Music } from "../types/Music";

const STORAGE_KEY = "batucao_playlists";

const loadPlaylists = (): Playlist[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const savePlaylists = (playlists: Playlist[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
};

interface PlaylistState {
  itens: Playlist[];
}

const initialState: PlaylistState = {
  itens: loadPlaylists(), 
};

const playlistSlice = createSlice({
  name: "playlists",
  initialState,
  reducers: {
    addPlaylist: (state, action: PayloadAction<Playlist>) => {
      state.itens.push(action.payload);
      savePlaylists(state.itens); 
    },
    deletePlaylist: (state, action: PayloadAction<string>) => {
      state.itens = state.itens.filter((p) => p.id !== action.payload);
      savePlaylists(state.itens);
    },
    editPlaylist: (state, action: PayloadAction<{ id: string; nome: string }>) => {
      const playlist = state.itens.find((p) => p.id === action.payload.id);
      if (playlist) {
        playlist.nome = action.payload.nome;
        savePlaylists(state.itens);
      }
    },
    addMusicToPlaylist: (
      state,
      action: PayloadAction<{ playlistId: string; music: Music }>
    ) => {
      const playlist = state.itens.find((p) => p.id === action.payload.playlistId);
      if (playlist && !playlist.musicas.find((m) => m.id === action.payload.music.id)) {
        playlist.musicas.push(action.payload.music);
        savePlaylists(state.itens);
      }
    },
    removeMusicFromPlaylist: (
      state,
      action: PayloadAction<{ playlistId: string; musicId: string }>
    ) => {
      const playlist = state.itens.find((p) => p.id === action.payload.playlistId);
      if (playlist) {
        playlist.musicas = playlist.musicas.filter((m) => m.id !== action.payload.musicId);
        savePlaylists(state.itens);
      }
    },
  },
});

export const {
  addPlaylist,
  deletePlaylist,
  editPlaylist,
  addMusicToPlaylist,
  removeMusicFromPlaylist,
} = playlistSlice.actions;

export default playlistSlice.reducer;
