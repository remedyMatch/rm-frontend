import { InstitutionBedarf } from "../../domain/bedarf/InstitutionBedarf";
import createApiState from "../util/ApiState";

const name = "Bedarf/InstitutionBedarfe";
const url = "/bedarf";
const [institutionBedarfeSlice, loadInstitutionBedarfe] = createApiState<
  InstitutionBedarf[]
>(name, url);

export { institutionBedarfeSlice, loadInstitutionBedarfe };
