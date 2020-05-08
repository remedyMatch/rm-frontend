import {Institution} from "../institution/Institution";
import {InstitutionStandort} from "../institution/InstitutionStandort";

export interface Person2Institution {
    id: string;
    institution: Institution;
    standort: InstitutionStandort;
    oeffentlich: boolean;
}