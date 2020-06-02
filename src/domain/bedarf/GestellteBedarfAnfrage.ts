import {Bedarf} from "./Bedarf";
import {BedarfAnfrage} from "./BedarfAnfrage";

export interface GestellteBedarfAnfrage extends BedarfAnfrage {
    bedarf: Bedarf;
}