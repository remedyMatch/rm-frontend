import {ArtikelKategorie} from "../Domain/ArtikelKategorie";
import createApiState from "./ApiState";

const name = "ArtikelKategorien";
const url = "/artikel/kategorie";
const [artikelKategorienSlice, loadArtikelKategorien] = createApiState<ArtikelKategorie[]>(name, url);

export {
    artikelKategorienSlice, loadArtikelKategorien
};