import createApiState from "./ApiState";
import {Institution} from "../Domain/Institution";

const name = "User";
const url = "/person";
const [userSlice, loadUser] = createApiState<Institution>(name, url);

export {
    userSlice, loadUser
};