import {Match} from "../../domain/match/Match";
import createApiState from "../ApiState";

const name = "Match/Matches";
const url = "/match";
const [matchesSlice, loadMatches] = createApiState<Match[]>(name, url);

export {
    matchesSlice, loadMatches
};