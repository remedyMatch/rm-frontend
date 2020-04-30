import createApiState from "./ApiState";
import { Person } from "../Domain/Person";

const name = "Person";
const url = "/person";
const [personSlice, loadPerson] = createApiState<Person>(name, url);

export {
    personSlice, loadPerson
};