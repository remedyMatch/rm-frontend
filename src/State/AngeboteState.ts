import createApiState from "./ApiState";
import {Angebot} from "../Domain/Angebot";

const name = "Angebot";
const url = "/angebot";
const [angeboteSlice, loadAngebote] = createApiState<Angebot[], Angebot[]>(name, url);

export {
    angeboteSlice, loadAngebote
};