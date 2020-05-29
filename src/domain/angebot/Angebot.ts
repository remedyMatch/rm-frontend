import { Artikel } from "../artikel/Artikel";

export interface Angebot {
  id: string;
  artikel: Artikel;
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
