import {Artikel} from "./Artikel";
import {Institution} from "./Institution";

export interface Angebot {
    id: string;
    artikel: Artikel;
    anzahl: number;
    kommentar: string;
    standort: string;
    haltbarkeit: string;
    steril: boolean;
    originalverpackt: boolean;
    medizinisch: boolean;
    institution: Institution;
}