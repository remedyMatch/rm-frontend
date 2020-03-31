import createApiState from "./ApiState";
import {Aufgabe} from "../Domain/Aufgabe";

const name = "Aufgaben";
const url = "/aufgabe";
const [aufgabenSlice, loadAufgaben] = createApiState<Aufgabe[]>(name, url);

export {
    aufgabenSlice, loadAufgaben
};