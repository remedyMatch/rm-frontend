import {Artikel} from "./Artikel";
import {Institution} from "./Institution";

export interface Bedarf {
    id: string;
    artikel: Artikel;
    anzahl: number;
    kommentar: string;
    standort: string;
    steril: boolean;
    originalverpackt: boolean;
    medizinisch: boolean;
    institutionId: string;
}