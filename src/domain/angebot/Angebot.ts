export interface Angebot {
    id: string;
    artikelKategorieId: string;
    artikelId: string;
    artikelVarianteId: string;
    verfuegbareAnzahl: number;
    ort: string;
    haltbarkeit: string;
    steril: boolean;
    originalverpackt: boolean;
    medizinisch: boolean;
    kommentar: string;
    entfernung: number;
}