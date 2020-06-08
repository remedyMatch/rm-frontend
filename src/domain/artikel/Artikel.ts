import { ArtikelVariante } from "./ArtikelVariante";

export interface Artikel {
  id: string;
  artikelKategorieId: string;
  name: string;
  beschreibung: string;
  varianten: ArtikelVariante[];
}
