import {Bedarf} from "./Bedarf";
import {BedarfAnfrage} from "./BedarfAnfrage";

export interface InstitutionBedarf extends Bedarf {
    anfragen: BedarfAnfrage[];
}