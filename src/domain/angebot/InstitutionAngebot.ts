import {Angebot} from "./Angebot";
import {AngebotAnfrage} from "./AngebotAnfrage";

export interface InstitutionAngebot extends Angebot {
    anfragen: AngebotAnfrage[];
}