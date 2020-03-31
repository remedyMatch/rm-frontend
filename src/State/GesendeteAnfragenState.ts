import createApiState from "./ApiState";
import {Anfrage} from "../Domain/Anfrage";

const name = "GesendeteAnfragen";
const url = "/institution/anfragen/gesendet";
const [gesendeteAnfragenSlice, loadGesendeteAnfragen] = createApiState<Anfrage[]>(name, url);

export {
    gesendeteAnfragenSlice, loadGesendeteAnfragen
};