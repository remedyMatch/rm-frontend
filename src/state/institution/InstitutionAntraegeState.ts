import { InstitutionAntrag } from "../../domain/institution/InstitutionAntrag";
import createApiState from "../util/ApiState";

const name = "Institution/Antraege";
const url = "/institution/antrag";
const [institutionAntraegeSlice, loadInstitutionAntraege] = createApiState<
  InstitutionAntrag[]
>(name, url);

export { institutionAntraegeSlice, loadInstitutionAntraege };
