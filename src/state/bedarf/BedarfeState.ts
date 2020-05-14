import {Bedarf} from "../../domain/bedarf/Bedarf";
import createApiState from "../util/ApiState";

const name = "Bedarf/Bedarfe";
const url = "/bedarf/suche";
const [bedarfeSlice, loadBedarfe] = createApiState<Bedarf[]>(name, url);

export {
    bedarfeSlice, loadBedarfe
};