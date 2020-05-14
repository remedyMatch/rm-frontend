import {makeStyles, Theme} from '@material-ui/core/styles';
import {ArrowForwardIos} from "@material-ui/icons";
import {Pagination} from "@material-ui/lab";
import {format, isThisYear, isToday, isYesterday} from "date-fns";
import {de} from "date-fns/locale";
import React, {useState} from 'react';
import {GestellteAngebotAnfrage} from "../../domain/angebot/GestellteAngebotAnfrage";
import {GestellteBedarfAnfrage} from "../../domain/bedarf/GestellteBedarfAnfrage";
import {Konversation} from "../../domain/nachricht/Konversation";
import {Person} from "../../domain/person/Person";
import {ApiState} from "../../state/util/ApiState";

const useStyles = makeStyles((theme: Theme) => ({
    list: {
        border: "2px solid #aabec6",
        display: "flex",
        flexDirection: "column",
        borderRadius: "8px",
        "&>div:first-child": {
            borderTop: "none"
        }
    },
    resultItem: {
        borderTop: "2px solid #aabec6",
        display: "flex",
        flexDirection: "row",
        padding: "8px 8px 8px 16px",
        cursor: "pointer"
    },
    left: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        maxWidth: "80%",
        overflow: "hidden"
    },
    right: {
        display: "flex",
        flexDirection: "row",
        flexShrink: 0,
        flexGrow: 0,
        marginLeft: "auto",
        alignItems: "center"
    },
    title: {
        fontFamily: "Montserrat, sans-serif",
        fontSize: "16px",
        fontWeight: 600,
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        marginBottom: "4px"
    },
    message: {
        display: "flex",
        flexDirection: "row"
    },
    messageSender: {
        fontFamily: "Montserrat, sans-serif",
        fontSize: "14px",
        fontWeight: 600,
        whiteSpace: "nowrap",
        flexGrow: 0,
        flexShrink: 0,
        color: "rgba(0, 0, 0, 0.54)"
    },
    messageText: {
        fontFamily: "Montserrat, sans-serif",
        fontSize: "14px",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        color: "rgba(0, 0, 0, 0.54)",
        marginLeft: "4px",
        overflow: "hidden",
        flexGrow: 1,
        flexShrink: 1
    },
    time: {
        fontFamily: "Montserrat, sans-serif",
        fontSize: "14px",
        fontWeight: 600,
        color: "rgba(0, 0, 0, 0.54)",
        marginRight: "4px"
    },
    iconRight: {
        color: "rgba(0, 0, 0, 0.38)"
    },
    pagination: {
        justifyContent: "center",
        display: "flex",
        margin: "2em"
    }
}));

interface Props {
    className?: string;
    conversations: Konversation[];
    offerDetails: IdMap<GestellteAngebotAnfrage>;
    demandDetails: IdMap<GestellteBedarfAnfrage>;
    onOpenConversationClicked: (conversationId: string) => void;
}

declare type IdMap<T> = { [key: string]: ApiState<T> };

const PAGE_SIZE = 10;

const mapConversations = (conversations: Konversation[], offerDetails: IdMap<GestellteAngebotAnfrage>, demandDetails: IdMap<GestellteBedarfAnfrage>, person?: Person) => {
    return conversations.filter(k => k.referenzTyp === "ANGEBOT_ANFRAGE" || k.referenzTyp === "BEDARF_ANFRAGE")
        .map(k => {
            if (k.referenzTyp === "ANGEBOT_ANFRAGE") {
                const details = offerDetails[k.referenzId]?.value;
                const mine = details?.institution.id === person?.aktuellerStandort.institution.id;
                const variantId = details?.angebot.artikelVarianteId;
                const variants = details?.angebot.artikel.varianten;
                const variant = variants?.find(v => v.id === variantId);
                const articleName = details ? details.angebot.artikel.name + ((variants?.length || 0) > 1 ? " (" + variant?.variante + ")" : "") : "";
                const message = k.nachrichten.map(m => ({ ...m, timestamp: new Date(m.erstelltAm).getTime() })).sort((a, b) => a.timestamp - b.timestamp).slice(-1)[0];
                return {
                    title: (mine ? "Ihre Anfrage" : "Anfrage von " + (details?.institution.name || "???")) + " zu Angebot: " + (details?.angebot.verfuegbareAnzahl || "???") + " " + (articleName || ""),
                    message: message,
                    id: k.id
                };
            } else {
                const details = demandDetails[k.referenzId]?.value;
                const mine = details?.institution.id === person?.aktuellerStandort.institution.id;
                const variantId = details?.bedarf.artikelVarianteId;
                const variants = details?.bedarf.artikel.varianten;
                const variant = variants?.find(v => v.id === variantId);
                const articleName = details ? details.bedarf.artikel.name + ((variants?.length || 0) > 1 ? " (" + variant?.variante + ")" : "") : "";
                const message = k.nachrichten.map(m => ({ ...m, timestamp: new Date(m.erstelltAm).getTime() })).sort((a, b) => a.timestamp - b.timestamp).slice(-1)[0];
                return {
                    title: (mine ? "Ihre Anfrage" : "Anfrage von " + (details?.institution.name || "???")) + " zu Bedarf: " + (details?.bedarf.verfuegbareAnzahl || "???") + " " + (articleName || ""),
                    message: message,
                    id: k.id
                };
            }
        });
};

const formatDate = (dateString?: string) => {
    if(!dateString) {
        return "";
    }

    const date = new Date(dateString);

    if (isToday(date)) {
        return format(date, "HH:mm", {locale: de});
    }

    if (isYesterday(date)) {
        return "Gestern, " + format(date, "HH:mm", {locale: de});
    }

    if (isThisYear(date)) {
        return format(date, "dd. MMMM, HH:mm", {locale: de});
    }

    return format(date, "dd. MMMM YYYY, HH:mm", {locale: de});
}

const ConversationList: React.FC<Props> = props => {
    const classes = useStyles();

    const [pageIndex, setPageIndex] = useState(0);

    if (props.conversations.length === 0) {
        return <div className={props.className}/>;
    }

    const items = mapConversations(
        props.conversations.slice(pageIndex * PAGE_SIZE, pageIndex * PAGE_SIZE + PAGE_SIZE),
        props.offerDetails,
        props.demandDetails
    );

    return (
        <div className={props.className}>
            <div className={classes.list}>
                {items.map(item => (
                    <div
                        className={classes.resultItem}
                        onClick={() => props.onOpenConversationClicked(item.id)}>
                        <div className={classes.left}>
                            <span className={classes.title}>{item.title}</span>
                            <span className={classes.message}>
                            <span className={classes.messageSender}>{item.message ? item.message?.erstellerName + ":" : undefined}</span>
                            <span className={classes.messageText}>{item.message?.nachricht || "Keine Nachricht gefunden"}</span>
                        </span>
                        </div>
                        <div className={classes.right}>
                            <span className={classes.time}>{formatDate(item.message?.erstelltAm)}</span>
                            <ArrowForwardIos fontSize="small" className={classes.iconRight}/>
                        </div>
                    </div>
                ))}
            </div>
            <Pagination
                color="secondary"
                variant="outlined"
                className={classes.pagination}
                count={Math.ceil(props.conversations.length / PAGE_SIZE)}
                page={pageIndex + 1}
                onChange={(e, page) => setPageIndex(page - 1)}/>
        </div>
    );
};

export default ConversationList;
