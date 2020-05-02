import {Artikel} from "../../domain/artikel/Artikel";
import createApiState from "../ApiState";

const name = "Artikel/Artikel";
const url = "/artikel";
const [artikelSlice, loadArtikel] = createApiState<Artikel[]>(name, url);

export {
    artikelSlice, loadArtikel
};