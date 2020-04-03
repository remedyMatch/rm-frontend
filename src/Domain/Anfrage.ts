import {Institution} from "./Institution";
import {InstitutionStandort} from "./InstitutionStandort";

export interface Anfrage {
    id: string;
    kommentar: string;
    institutionVon: Institution;
    institutionAn: Institution;
    bedarfId?: string;
    angebotId?: string;
    standortAn: InstitutionStandort;
    standortVon: InstitutionStandort;
    entfernung: number;
    prozessInstanzId: string;
    artikelId: string;
    anzahl: number;
    status: string;
}