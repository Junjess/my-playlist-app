import axios from "axios";
import type { Music } from "../types/Music";

const API_URL = "https://www.theaudiodb.com/api/v1/json/2/";

const ARTISTAS_FAMOSOS = [
  "queen",
  "coldplay",
  "rihanna",
  "eminem",
  "beyonce",
  "michael jackson",
  "madonna",
  "bruno mars",
  "ed sheeran",
  "lady gaga",
  "the beatles",
  "metallica",
  "nirvana",
  "linkin park",
  "taylor swift",
];

export const buscarPorMusica = async (nome: string): Promise<Music[]> => {
  const res = await axios.get(`${API_URL}searchtrack.php?t=${encodeURIComponent(nome)}`);
  if (!res.data.track) return [];
  return res.data.track.map((item: any) => ({
    id: item.idTrack,
    nome: item.strTrack,
    artista: item.strArtist,
    genero: item.strGenre || "N/A",
    capa: item.strTrackThumb || item.strAlbumThumb || null,
    tipo: "Música",
  }));
};
export const buscarPorMusicaComArtista = async (
  musica: string,
  artista: string
): Promise<Music[]> => {
  const res = await axios.get(
    `${API_URL}searchtrack.php?s=${encodeURIComponent(artista)}&t=${encodeURIComponent(musica)}`
  );
  if (!res.data.track) return [];
  return res.data.track.map((item: any) => ({
    id: item.idTrack,
    nome: item.strTrack,
    artista: item.strArtist,
    genero: item.strGenre || "N/A",
    capa: item.strTrackThumb || item.strAlbumThumb || null,
    tipo: "Música",
  }));
};
export const buscarPorArtista = async (nome: string): Promise<Music[]> => {
  const res = await axios.get(`${API_URL}track-top10.php?s=${encodeURIComponent(nome)}`);
  if (!res.data.track) return [];
  return res.data.track.map((item: any) => ({
    id: item.idTrack,
    nome: item.strTrack,
    artista: item.strArtist,
    genero: item.strGenre || "N/A",
    capa: item.strTrackThumb || item.strAlbumThumb || null,
    tipo: "Música",
  }));
};
export const buscarPorAlbum = async (nome: string): Promise<Music[]> => {
  const res = await axios.get(`${API_URL}searchalbum.php?a=${encodeURIComponent(nome)}`);
  if (!res.data.album) return [];
  return res.data.album.map((item: any) => ({
    id: item.idAlbum,
    nome: item.strAlbum,
    artista: item.strArtist,
    genero: item.strGenre || "N/A",
    capa: item.strAlbumThumb || null,
    tipo: "Álbum",
  }));
};
export const buscarPorAlbumComArtista = async (
  album: string,
  artista: string
): Promise<Music[]> => {
  const res = await axios.get(
    `${API_URL}searchalbum.php?s=${encodeURIComponent(artista)}&a=${encodeURIComponent(album)}`
  );
  if (!res.data.album) return [];
  return res.data.album.map((item: any) => ({
    id: item.idAlbum,
    nome: item.strAlbum,
    artista: item.strArtist,
    genero: item.strGenre || "N/A",
    capa: item.strAlbumThumb || null,
    tipo: "Álbum",
  }));
};
export const buscarGenerico = async (texto: string): Promise<Music[]> => {
  const [artista, nome] = texto.includes("::") ? texto.split("::") : [texto, ""];
  let musicas: Music[] = [];
  let albuns: Music[] = [];
  let artistas: Music[] = [];
  if (nome) {
    musicas = await buscarPorMusicaComArtista(nome.trim(), artista.trim());
    albuns = await buscarPorAlbumComArtista(nome.trim(), artista.trim());
  } else {
    musicas = await buscarPorMusica(artista.trim());
    albuns = await buscarPorAlbum(artista.trim());
    artistas = await buscarPorArtista(artista.trim());
  }
  const todos = [...musicas, ...albuns, ...artistas];
  return todos.filter(
    (item, index, self) => index === self.findIndex((m) => m.id === item.id)
  );
};

export const buscarMusicasDoAlbum = async (idAlbum: string): Promise<Music[]> => {
  const res = await axios.get(`${API_URL}track.php?m=${idAlbum}`);
  if (!res.data.track) return [];
  return res.data.track.map((item: any) => ({
    id: item.idTrack,
    nome: item.strTrack,
    artista: item.strArtist,
    genero: item.strGenre || "N/A",
    capa: item.strTrackThumb || item.strAlbumThumb || null,
    tipo: "Música",
  }));
};

export const buscarTop10Global = async (): Promise<Music[]> => {
  let allTracks: Music[] = [];
  for (const artista of ARTISTAS_FAMOSOS) {
    try {
      const res = await axios.get(`${API_URL}track-top10.php?s=${encodeURIComponent(artista)}`);
      if (res.data.track) {
        const mapped = res.data.track.map((item: any) => ({
          id: item.idTrack,
          nome: item.strTrack,
          artista: item.strArtist,
          genero: item.strGenre || "N/A",
          capa: item.strTrackThumb || item.strAlbumThumb || null,
          tipo: "Música",
        }));
        allTracks = [...allTracks, ...mapped];
      }
    } catch (err) {
      console.error(`Erro ao buscar artista ${artista}`, err);
    }
  }
  return allTracks.sort(() => Math.random() - 0.5).slice(0, 10);
};
