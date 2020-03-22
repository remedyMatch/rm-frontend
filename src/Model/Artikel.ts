export interface ArtikelKategorie {
    id: string;
    name: string;
}

export interface Artikel {
    id: string;
    ean: string;
    name: string;
    beschreibung: string;
    hersteller: string;
    artikelKategorie: ArtikelKategorie;
}