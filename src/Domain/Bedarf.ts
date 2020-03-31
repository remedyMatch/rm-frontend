import {Artikel} from "./Artikel";
import {InstitutionStandort} from "./InstitutionStandort";

export interface Bedarf {
    id: string;
    artikel: Artikel;
    anzahl: number;
    standort: InstitutionStandort;
    kommentar: string;
    rest: number;
    institutionId: string;
    steril: boolean;
    originalverpackt: boolean;
    medizinisch: boolean;
    bedient: boolean;
    entfernung: number;
}