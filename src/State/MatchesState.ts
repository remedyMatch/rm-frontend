import createApiState from "./ApiState";
import {Match} from "../Domain/Match";

const name = "Matches";
const url = "/match";
const [matchesSlice, loadMatches] = createApiState<Match[]>(name, url);

export {
    matchesSlice, loadMatches
};