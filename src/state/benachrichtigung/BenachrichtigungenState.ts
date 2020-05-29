import { Benachrichtigung } from "../../domain/benachrichtigung/Benachrichtigung";
import createApiState from "../util/ApiState";
import { Url } from "../util/Url";

const name = "Benachrichtigung/Benachrichtigungen";
const url: Url = {
  baseUrl: "/notification",
  url: "/",
};
const [benachrichtigungenSlice, loadBenachrichtigungen] = createApiState<
  Benachrichtigung[]
>(name, url);

export { benachrichtigungenSlice, loadBenachrichtigungen };
