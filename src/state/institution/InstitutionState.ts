import {Institution} from "../../domain/institution/Institution";
import createApiState from "../ApiState";

const name = "Institution/Institution";
const url = "/institution";
const [institutionSlice, loadInstitution] = createApiState<Institution>(name, url);

export {
    institutionSlice, loadInstitution
};