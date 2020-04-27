import createApiState from "./ApiState";
import {Institution} from "../Domain/Institution";

const name = "EigeneInstitution";
const url = "/institution";
const [eigeneInstitutionSlice, loadEigeneInstitution] = createApiState<Institution>(name, url);

export {
    eigeneInstitutionSlice, loadEigeneInstitution
};