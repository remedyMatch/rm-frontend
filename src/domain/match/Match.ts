import {Artikel} from "../artikel/Artikel";
import {Institution} from "../institution/Institution";
import {InstitutionStandort} from "../institution/InstitutionStandort";

export type InseratTyp = "BEDARF" | "ANGEBOT";

export interface Match {
    institutionVon: Institution;
    standortVon: InstitutionStandort;
    institutionAn: Institution;
    standortAn: InstitutionStandort;
    anfrageId: string;
    inseratId: string;
    entfernung: number;
    artikel: Artikel;
    artikelVarianteId: string;
    anzahl: number;
    inseratTyp: InseratTyp;
}