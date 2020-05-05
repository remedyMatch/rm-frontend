import {GestellteBedarfAnfrage} from "../../domain/bedarf/GestellteBedarfAnfrage";
import createApiState from "../ApiState";

const name = "Bedarf/GestellteAnfrage";
const url = "/bedarf/anfrage/gestellt";
const [gestellteBedarfAnfragenSlice, loadGestellteBedarfAnfragen] = createApiState<GestellteBedarfAnfrage[]>(name, url);

export {
    gestellteBedarfAnfragenSlice, loadGestellteBedarfAnfragen
};