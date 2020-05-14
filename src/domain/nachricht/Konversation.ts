import {Nachricht} from "./Nachricht";

export type NachrichtReferenzTyp = "ANGEBOT_ANFRAGE" | "BEDARF_ANFRAGE" | "LIEFERAUFTRAG";

export interface Konversation {
    id: string;
    beteiligte: string[];
    nachrichten: Nachricht[];
    referenzId: string;
    referenzTyp: NachrichtReferenzTyp;
}