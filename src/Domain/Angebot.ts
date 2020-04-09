import {InstitutionStandort} from "./InstitutionStandort";

export interface Angebot {
    id: string;
    artikelId: string;
    artikelVarianteId: string;
    anzahl: number;
    institutionId: string;
    standort: InstitutionStandort;
    haltbarkeit: string;
    steril: boolean;
    originalverpackt: boolean;
    medizinisch: boolean;
    kommentar: string;
    entfernung: number;
}