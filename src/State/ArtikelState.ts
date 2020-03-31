import createApiState from "./ApiState";
import {Artikel} from "../Domain/Artikel";

const name = "Artikel";
const url = "/artikel/suche";
const [artikelSlice, loadArtikel] = createApiState<Artikel[]>(name, url);

export {
    artikelSlice, loadArtikel
};