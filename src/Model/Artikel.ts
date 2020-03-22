import {ArtikelKategorie} from "./ArtikelKategorie";

export interface Artikel {
    id: string;
    ean: string;
    name: string;
    beschreibung: string;
    hersteller: string;
    artikelKategorie: ArtikelKategorie;
}