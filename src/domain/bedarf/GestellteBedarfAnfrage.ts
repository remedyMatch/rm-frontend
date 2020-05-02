import {Bedarf} from "./Bedarf";
import {BedarfAnfrage} from "./BedarfAnfrage";

export interface InstitutionAngebot extends BedarfAnfrage {
    bedarf: Bedarf[];
}