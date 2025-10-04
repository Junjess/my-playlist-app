import type { Music } from "./Music";

export interface Playlist {
  id: string;
  nome: string;
  usuarioId: number;
  musicas: Music[];
}