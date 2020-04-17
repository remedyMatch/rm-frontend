import createApiState from "./ApiState";
import {Bedarf} from "../Domain/Bedarf";

const name = "Bedarfe";
const url = "/bedarf";
const [bedarfeSlice, loadBedarfe] = createApiState<Bedarf[]>(name, url);

export {
    bedarfeSlice, loadBedarfe
};