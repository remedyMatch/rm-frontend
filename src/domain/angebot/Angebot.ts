import { Artikel } from "../artikel/Artikel";
import { InstitutionStandort } from "../institution/InstitutionStandort";

export interface Angebot {
  id: string;
  artikel: Artikel;
  artikelVarianteId: string;
  verfuegbareAnzahl: number;
  standort: InstitutionStandort;
  haltbarkeit: string;
  steril: boolean;
  originalverpackt: boolean;
  medizinisch: boolean;
  kommentar: string;
  entfernung: number;
}
