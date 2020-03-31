import createApiState from "./ApiState";

const name = "InstitutionTypen";
const url = "/institution/typ";
const [institutionTypenSlice, loadInstitutionTypen] = createApiState<string[]>(name, url);

export {
    institutionTypenSlice, loadInstitutionTypen
};