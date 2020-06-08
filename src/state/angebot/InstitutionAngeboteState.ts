import { InstitutionAngebot } from "../../domain/angebot/InstitutionAngebot";
import createApiState from "../util/ApiState";

const name = "Angebot/InstitutionAngebote";
const url = "/angebot";
const [institutionAngeboteSlice, loadInstitutionAngebote] = createApiState<
  InstitutionAngebot[]
>(name, url);

export { institutionAngeboteSlice, loadInstitutionAngebote };
