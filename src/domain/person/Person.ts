import {Person2Institution} from "./Person2Institution";

export interface Person {
    id: string;
    username: string;
    vorname: string;
    nachname: string;
    email: string;
    telefon: string;
    aktuelleInstitution: Person2Institution;
    institutionen: Person2Institution[];
}