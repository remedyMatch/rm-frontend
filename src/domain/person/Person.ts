import {Person2Institution} from "./Person2Institution";

export interface Person {
    id: string;
    username: string;
    vorname: string;
    nachname: string;
    email: string;
    telefon: string;
    standorte: Person2Institution[];
    aktuellerStandort: Person2Institution;
}