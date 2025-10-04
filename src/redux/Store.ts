import { configureStore } from "@reduxjs/toolkit";
import playlistsReducer from "./PlaylistSlice";
import musicasReducer from "./MusicSlice";

export const store = configureStore({
  reducer: {
    playlists: playlistsReducer,
    musicas: musicasReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
