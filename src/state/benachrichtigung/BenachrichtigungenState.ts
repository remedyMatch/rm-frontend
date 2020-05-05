import {Benachrichtigung} from "../../domain/benachrichtigung/Benachrichtigung";
import createApiState, {Url} from "../ApiState";

const name = "Benachrichtigung/Benachrichtigungen";
const url: Url = {
    baseUrl: "/notification",
    url: "/"
};
const [benachrichtigungenSlice, loadBenachrichtigungen] = createApiState<Benachrichtigung[]>(name, url);

export {
    benachrichtigungenSlice, loadBenachrichtigungen
};