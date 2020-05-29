import { GestellteAngebotAnfrage } from "../../domain/angebot/GestellteAngebotAnfrage";
import createApiState from "../util/ApiState";

const name = "Angebot/GestellteAnfrage";
const url = "/angebot/anfrage/gestellt";
const [
  gestellteAngebotAnfragenSlice,
  loadGestellteAngebotAnfragen,
] = createApiState<GestellteAngebotAnfrage[]>(name, url);

export { gestellteAngebotAnfragenSlice, loadGestellteAngebotAnfragen };
