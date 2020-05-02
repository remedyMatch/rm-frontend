export interface Bedarf {
    id: string;
    artikelKategorieId: string;
    artikelId: string;
    artikelVarianteId: string;
    verfuegbareAnzahl: number;
    ort: string;
    steril: boolean;
    medizinisch: boolean;
    kommentar: string;
    entfernung: number;
}