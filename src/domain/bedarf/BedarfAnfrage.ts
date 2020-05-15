import {Institution} from "../institution/Institution";
import {InstitutionStandort} from "../institution/InstitutionStandort";

export type BedarfAnfrageStatus = "ANGENOMMEN" | "ABGELEHNT" | "STORNIERT" | "OFFEN" | "MATCHED";
export interface BedarfAnfrage {
    id: string;
    institution: Institution;
    standort: InstitutionStandort;
    anzahl: number;
    kommentar: string;
    status: BedarfAnfrageStatus;
    entfernung: number;
}