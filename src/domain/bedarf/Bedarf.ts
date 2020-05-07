import {Artikel} from "../artikel/Artikel";

export interface Bedarf {
    id: string;
    artikel: Artikel;
    artikelVarianteId: string;
    verfuegbareAnzahl: number;
    ort: string;
    steril: boolean;
    medizinisch: boolean;
    kommentar: string;
    entfernung: number;
}