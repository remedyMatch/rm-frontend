import {InstitutionStandort} from "./InstitutionStandort";

export type InstitutionTyp = "ANDERE" | "ARZT" | "GEWERBE_UND_INDUSTRIE" | "KRANKENHAUS" | "LIEFERANT" | "PFLEGEDIENST" | "PRIVAT";

export interface Institution {
    id: string;
    name: string;
    typ: InstitutionTyp;
    standorte: InstitutionStandort[];
}