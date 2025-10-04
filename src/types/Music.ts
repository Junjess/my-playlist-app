export interface Music {
  id: string;
  nome: string;
  artista: string;
  genero?: string;
  capa?: string | null;
  tipo?: "Música" | "Artista" | "Álbum";
}