import { Konversation } from "../../domain/nachricht/Konversation";
import createApiState from "../util/ApiState";

const name = "Nachricht/Konversationen";
const url = "/konversation";
const [konversationenSlice, loadKonversationen] = createApiState<
  Konversation[]
>(name, url);

export { konversationenSlice, loadKonversationen };
