import {Person} from "../../domain/person/Person";
import createApiState from "../util/ApiState";

const name = "Person/Person";
const url = "/person";
const [personSlice, loadPerson] = createApiState<Person>(name, url);

export {
    personSlice, loadPerson
};