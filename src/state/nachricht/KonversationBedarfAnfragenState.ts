import { GestellteBedarfAnfrage } from "../../domain/bedarf/GestellteBedarfAnfrage";
import createApiMapState from "../util/ApiMapState";

const name = "Nachricht/KonversationBedarfAnfragen";
const url = "/bedarf/anfrage/suche";
const [
  konversationBedarfAnfragenSlice,
  loadKonversationBedarfAnfragen,
] = createApiMapState<GestellteBedarfAnfrage>(name, url);

export { konversationBedarfAnfragenSlice, loadKonversationBedarfAnfragen };
