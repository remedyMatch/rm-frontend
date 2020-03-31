import createApiState from "./ApiState";
import {Anfrage} from "../Domain/Anfrage";

const name = "GesendeteAnfragen";
const url = "/institution/anfragen/gestellt";
const [gesendeteAnfragenSlice, loadGesendeteAnfragen] = createApiState<Anfrage[]>(name, url);

export {
    gesendeteAnfragenSlice, loadGesendeteAnfragen
};