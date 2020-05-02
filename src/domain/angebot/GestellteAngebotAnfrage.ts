import {Angebot} from "./Angebot";
import {AngebotAnfrage} from "./AngebotAnfrage";

export interface InstitutionAngebot extends AngebotAnfrage {
    angebot: Angebot[];
}