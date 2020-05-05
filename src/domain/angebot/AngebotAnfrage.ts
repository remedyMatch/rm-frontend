import {Institution} from "../institution/Institution";
import {InstitutionStandort} from "../institution/InstitutionStandort";

export type AngebotAnfrageStatus = "ANGENOMMEN" | "ABGELEHNT" | "STORNIERT" | "OFFEN";
export interface AngebotAnfrage {
    id: string;
    type: string;
    institution: Institution;
    standort: InstitutionStandort;
    anzahl: number;
    kommentar: string;
    status: AngebotAnfrageStatus;
    entfernung: number;
}