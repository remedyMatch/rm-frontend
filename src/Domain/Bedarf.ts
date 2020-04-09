import {InstitutionStandort} from "./InstitutionStandort";

export interface Bedarf {
    id: string;
    artikelId: string;
    artikelVarianteId: string;
    anzahl: number;
    rest: number;
    institutionId: string;
    standort: InstitutionStandort;
    steril: boolean;
    medizinisch: boolean;
    kommentar: string;
    entfernung: number;
}