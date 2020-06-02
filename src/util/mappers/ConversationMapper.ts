import {Angebot} from "../../domain/angebot/Angebot";
import {GestellteAngebotAnfrage} from "../../domain/angebot/GestellteAngebotAnfrage";
import {Bedarf} from "../../domain/bedarf/Bedarf";
import {GestellteBedarfAnfrage} from "../../domain/bedarf/GestellteBedarfAnfrage";
import {Konversation} from "../../domain/nachricht/Konversation";
import {Person} from "../../domain/person/Person";
import {ApiState} from "../../state/util/ApiState";

export declare type IdMap<T> = { [key: string]: ApiState<T> };

export const getOfferRequestIds = (conversations: Konversation[]) => {
    return conversations
        .filter(c => c.referenzTyp === "ANGEBOT_ANFRAGE")
        .map(c => c.referenzId);
};

export const getDemandRequestIds = (conversations: Konversation[]) => {
    return conversations
        .filter(c => c.referenzTyp === "BEDARF_ANFRAGE")
        .map(c => c.referenzId);
};

export const mapConversations = (
    conversations: Konversation[],
    offerDetails: IdMap<GestellteAngebotAnfrage>,
    demandDetails: IdMap<GestellteBedarfAnfrage>,
    person: Person | undefined,
    config?: {
        withPrefix: boolean
    }
) => {
    return conversations
        .filter(k => k.referenzTyp === "ANGEBOT_ANFRAGE" || k.referenzTyp === "BEDARF_ANFRAGE")
        .map(conversation => {
            let ad: Angebot | Bedarf | undefined;
            let request: GestellteBedarfAnfrage | GestellteAngebotAnfrage | undefined;
            let type: "offer" | "demand" | undefined;

            if (conversation.referenzTyp === "ANGEBOT_ANFRAGE") {
                request = offerDetails[conversation?.referenzId || ""]?.value;
                ad = request?.angebot;
                type = "offer";
            } else if (conversation.referenzTyp === "BEDARF_ANFRAGE") {
                request = demandDetails[conversation?.referenzId || ""]?.value;
                ad = request?.bedarf;
                type = "demand";
            }

            const variantId = ad?.artikelVarianteId;
            const variants = ad?.artikel.varianten;
            const variant = variants?.find(v => v.id === variantId);
            const articleName = request ? ad?.artikel.name + ((variants?.length || 0) > 1 ? " (" + variant?.variante + ")" : "") : "";
            const mine = request?.institution.id === person?.aktuellerStandort.institution.id;
            const message = conversation.nachrichten.map(m => ({
                ...m,
                timestamp: new Date(m.erstelltAm).getTime()
            })).sort((a, b) => a.timestamp - b.timestamp).slice(-1)[0];

            const requestor = mine
                ? (config?.withPrefix ? "Ihre Anfrage" : "Sie")
                : (config?.withPrefix ? "Anfrage von " : "") + (request?.institution.name || "???");

            return {
                title: requestor + " zu " + (type === "offer" ? "Angebot: " : "Bedarf: ") + (request?.anzahl || "???") + " " + (articleName || ""),
                message: message,
                timestamp: message?.timestamp || 0,
                id: conversation.id,
                status: request?.status
            };
        })
        .sort((a, b) => b.timestamp - a.timestamp);
};