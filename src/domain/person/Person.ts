import {Institution} from "../institution/Institution";
import {InstitutionStandort} from "../institution/InstitutionStandort";
import {Person2Institution} from "./Person2Institution";

interface PersonInstitutionEntry {
    institution: Institution;
    standorte: InstitutionStandort[];
}

export interface Person {
    id: string;
    username: string;
    vorname: string;
    nachname: string;
    email: string;
    telefon: string;
    institutionen: PersonInstitutionEntry[];
    aktuellerStandort: Person2Institution;
}