import {Institution} from "../institution/Institution";
import {InstitutionStandort} from "../institution/InstitutionStandort";

export interface Match {
    id: string;
    institutionVon: Institution;
    standortVon: InstitutionStandort;
    institutionAn: Institution;
    standortAn: InstitutionStandort;
    kommentarAnfrage: string;
    kommentarAntwort: string;
    entfernung: number;
    artikelKategorieId: string;
    artikelId: string;
    artikelVarianteId: string;
    anzahl: number;
}