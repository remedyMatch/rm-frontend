import { Artikel } from "../artikel/Artikel";
import { InstitutionStandort } from "../institution/InstitutionStandort";

export interface Bedarf {
  id: string;
  artikel: Artikel;
  artikelVarianteId: string;
  verfuegbareAnzahl: number;
  standort: InstitutionStandort;
  steril: boolean;
  medizinisch: boolean;
  kommentar: string;
  entfernung: number;
}
