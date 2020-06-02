import {GestellteAngebotAnfrage} from "../../domain/angebot/GestellteAngebotAnfrage";
import createApiMapState from "../util/ApiMapState";

const name = "Nachricht/KonversationAngebotAnfragen";
const url = "/angebot/anfrage/suche";
const [konversationAngebotAnfragenSlice, loadKonversationAngebotAnfragen] = createApiMapState<GestellteAngebotAnfrage>(name, url);

export {
    konversationAngebotAnfragenSlice, loadKonversationAngebotAnfragen
};