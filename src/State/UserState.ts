import createApiState from "./ApiState";

export interface User {
    email: string;
    id: string;
    nachname: string;
    telefon: string;
    username: string;
    vorname: string;
}

const name = "User";
const url = "/person";
const [userSlice, loadUser] = createApiState<User>(name, url);

export {
    userSlice, loadUser
};