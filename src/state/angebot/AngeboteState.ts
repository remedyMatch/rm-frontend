import {Angebot} from "../../domain/angebot/Angebot";
import createApiState from "../ApiState";

const name = "Angebot/Angebote";
const url = "/angebot/suche";
const [angeboteSlice, loadAngebote] = createApiState<Angebot[]>(name, url);

export {
    angeboteSlice, loadAngebote
};