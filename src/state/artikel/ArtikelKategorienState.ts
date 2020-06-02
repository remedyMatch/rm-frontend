import {ArtikelKategorie} from "../../domain/artikel/ArtikelKategorie";
import createApiState from "../util/ApiState";

const name = "Artikel/Kategorien";
const url = "/artikel/kategorie";
const [artikelKategorienSlice, loadArtikelKategorien] = createApiState<ArtikelKategorie[]>(name, url);

export {
    artikelKategorienSlice, loadArtikelKategorien
};