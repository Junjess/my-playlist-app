import { createSlice, createAsyncThunk  } from "@reduxjs/toolkit";
import type { Music } from "../types/Music";
import { buscarTop10Global, buscarGenerico } from "../service/api";

const STORAGE_KEY = "batucao_top10";

const loadTop10 = (): Music[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};
const saveTop10 = (musicas: Music[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(musicas));
};
const clearTop10 = () => {
  localStorage.removeItem(STORAGE_KEY);
};
interface MusicState {
  itens: Music[];
  titulo: string;
  status: "idle" | "loading" | "succeeded" | "failed";
}
const initialState: MusicState = {
  itens: loadTop10(), 
  titulo: "Top 10 Global",
  status: "idle",
};
export const fetchMusicas = createAsyncThunk("musicas/fetch", async (termo: string) => {
  if (!termo) {
    const top10 = await buscarTop10Global();
    saveTop10(top10); 
    return { titulo: "Top 10 Global", itens: top10 };
  }
  const itens = await buscarGenerico(termo);
  return { titulo: `Resultados para "${termo}"`, itens };
});

const musicSlice = createSlice({
  name: "musicas",
  initialState,
  reducers: {
    limparTop10: (state) => {
      state.itens = [];
      state.titulo = "Top 10 Global";
      clearTop10(); 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMusicas.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMusicas.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.itens = action.payload.itens;
        state.titulo = action.payload.titulo;
      })
      .addCase(fetchMusicas.rejected, (state) => {
        state.status = "failed";
      });
  },
});
export const { limparTop10 } = musicSlice.actions;
export default musicSlice.reducer;
