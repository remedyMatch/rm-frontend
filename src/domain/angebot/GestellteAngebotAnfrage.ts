import {Angebot} from "./Angebot";
import {AngebotAnfrage} from "./AngebotAnfrage";

export interface GestellteAngebotAnfrage extends AngebotAnfrage {
    angebot: Angebot;
}