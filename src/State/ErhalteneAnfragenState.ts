import createApiState from "./ApiState";
import {Anfrage} from "../Domain/Anfrage";

const name = "ErhalteneAnfragen";
const url = "/institution/anfragen/erhalten";
const [erhalteneAnfragenSlice, loadErhalteneAnfragen] = createApiState<Anfrage[]>(name, url);

export {
    erhalteneAnfragenSlice, loadErhalteneAnfragen
};