import {Button, IconButton, Theme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Close, Send} from "@material-ui/icons";
import clsx from "clsx";
import {format, isThisYear, isToday, isYesterday} from "date-fns";
import {de} from "date-fns/locale";
import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useRouteMatch} from "react-router-dom";
import TextArea from "../components/Form/TextArea";
import {Angebot} from "../domain/angebot/Angebot";
import {GestellteAngebotAnfrage} from "../domain/angebot/GestellteAngebotAnfrage";
import {Bedarf} from "../domain/bedarf/Bedarf";
import {GestellteBedarfAnfrage} from "../domain/bedarf/GestellteBedarfAnfrage";
import {Konversation} from "../domain/nachricht/Konversation";
import {loadKonversationAngebotAnfragen} from "../state/nachricht/KonversationAngebotAnfragenState";
import {loadKonversationBedarfAnfragen} from "../state/nachricht/KonversationBedarfAnfragenState";
import {RootState} from "../state/Store";
import {apiGet, apiPost} from "../util/ApiUtils";

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        border: "2px solid #aabec6",
        borderRadius: "8px",
        marginTop: "16px",
        flexGrow: 1,
        maxHeight: "calc(100vh - 159px)",
        display: "flex",
        flexDirection: "column"
    },
    header: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#aabec6",
        padding: "8px 16px"
    },
    title: {
        fontFamily: "Montserrat, sans-serif",
        fontSize: "18px",
        fontWeight: 600
    },
    participants: {
        fontFamily: "Montserrat, sans-serif",
        fontSize: "16px",
        marginTop: "4px",
        color: "rgba(0, 0, 0, 0.54)"
    },
    messageContainer: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        flexShrink: 1,
        overflowY: "auto",
        padding: "8px 16px",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        "&::-webkit-scrollbar": {
            width: "12px"
        },
        "&::-webkit-scrollbar-track": {
            backgroundColor: "rgba(0,0,0,0.1)"
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "darkgrey",
            borderRadius: "6px"
        }
    },
    message: {
        margin: "8px 0px",
        padding: "8px 16px",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column"
    },
    messageLeft: {
        marginRight: "35%",
        placeSelf: "flex-start",
        backgroundColor: "white"
    },
    messageRight: {
        marginLeft: "35%",
        placeSelf: "flex-end",
        backgroundColor: "#d4dee2"
    },
    messageSender: {
        fontFamily: "Montserrat, sans-serif",
        fontSize: "14px",
        fontWeight: 600,
        color: "rgba(0, 0, 0, 0.87)"
    },
    messageText: {
        fontFamily: "Montserrat, sans-serif",
        fontSize: "16px",
        color: "rgba(0, 0, 0, 0.87)",
        marginTop: "4px",
        marginBottom: "4px",
        userSelect: "text",
        whiteSpace: "pre-line"
    },
    messageSent: {
        fontFamily: "Montserrat, sans-serif",
        fontSize: "12px",
        color: "rgba(0, 0, 0, 0.54)",
        placeSelf: "flex-end"
    },
    footer: {
        display: "flex",
        flexDirection: "row",
        flexGrow: 0,
        flexShrink: 0,
        backgroundColor: "#aabec6"
    },
    footerInput: {
        margin: "8px 0px 4px 8px",
        flexGrow: 1
    },
    footerSend: {
        width: "48px",
        height: "48px",
        margin: "auto 8px"
    },
    actionContainer: {
        backgroundColor: "#aabec6",
        paddingTop: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    actionHint: {
        fontFamily: "Montserrat, sans-serif",
        fontSize: "14px",
        color: "rgba(0, 0, 0, 0.87)"
    },
    actionButtonContainer: {
        display: "flex",
        flexDirection: "row"
    },
    button: {
        fontFamily: "Montserrat, sans-serif",
        fontWeight: 600,
        textTransform: "none",
        padding: "8px 24px",
        transition: theme.transitions.create(["border", "color", "background-color"]),
        height: "48px",
        minWidth: "144px",
        backgroundColor: "white",
        color: "rgba(0, 0, 0, 0.87)",
        whiteSpace: "nowrap",
        margin: "8px 8px 0px 8px",
        border: "2px solid #666",
        borderRadius: "8px",
        "&:hover": {
            backgroundColor: "#CCC"
        }
    },
    errorContainer: {
        backgroundColor: "darkorange",
        padding: "8px",
        width: "100%",
        display: "flex",
        flexDirection: "row"
    },
    errorMessage: {
        color: "white",
        fontFamily: "Montserrat, sans-serif",
        fontWeight: 600,
        fontSize: "14px",
        flexGrow: 1,
        alignSelf: "center"
    },
    dismissErrorButton: {
        height: "36px",
        width: "36px",
        placeSelf: "center",
        color: "rgba(255, 255, 255, 0.87)"
    }
}));

const formatDate = (dateString?: string) => {
    if (!dateString) {
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

const ConversationScreen: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const match = useRouteMatch<{ conversationId: string }>();

    const conversations = useSelector((state: RootState) => state.konversationen.value) || [];
    const person = useSelector((state: RootState) => state.person.value);
    const conversationDemandDetails = useSelector((state: RootState) => state.konversationBedarfAnfragen.value);
    const conversationOfferDetails = useSelector((state: RootState) => state.konversationAngebotAnfragen.value);

    const [conversation, setConversation] = useState<Konversation | undefined>(conversations.find(k => k.id === match.params.conversationId));
    const [inputText, setInputText] = useState("");
    const [inputDisabled, setInputDisabled] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (conversation?.referenzTyp === "ANGEBOT_ANFRAGE") {
            dispatch(loadKonversationAngebotAnfragen(conversation.referenzId));
        } else if (conversation?.referenzTyp === "BEDARF_ANFRAGE") {
            dispatch(loadKonversationBedarfAnfragen(conversation.referenzId));
        }
    }, [dispatch, conversation]);

    const refreshData = useCallback(async () => {
        if (conversation?.referenzTyp === "ANGEBOT_ANFRAGE") {
            dispatch(loadKonversationAngebotAnfragen(conversation.referenzId));
        } else if (conversation?.referenzTyp === "BEDARF_ANFRAGE") {
            dispatch(loadKonversationBedarfAnfragen(conversation.referenzId));
        }

        const result = await apiGet<Konversation>("/remedy/konversation/" + match.params.conversationId);
        if (!result.error) {
            setConversation(result.result);
        }
    }, [conversation, dispatch, match]);

    const onSendClicked = useCallback(async () => {
        setInputDisabled(true);
        const result = await apiPost("/remedy/konversation/" + match.params.conversationId + "/nachricht", {
            nachricht: inputText.trim()
        });
        if (!result.error) {
            refreshData();
            setInputText("");
            setInputDisabled(false);
        } else {
            setInputDisabled(false);
            setError(result.error);
        }
    }, [match, inputText, refreshData]);

    const onDismissErrorClicked = useCallback(() => setError(undefined), []);

    useEffect(() => {
        refreshData();
        const interval = setInterval(refreshData, 10 * 1000);
        return () => clearInterval(interval);
    }, [dispatch, refreshData]);

    let ad: Angebot | Bedarf | undefined;
    let request: GestellteBedarfAnfrage | GestellteAngebotAnfrage | undefined;
    if (conversation?.referenzTyp === "ANGEBOT_ANFRAGE") {
        request = conversationOfferDetails[conversation?.referenzId || ""]?.value;
        ad = request?.angebot;
    } else if (conversation?.referenzTyp === "BEDARF_ANFRAGE") {
        request = conversationDemandDetails[conversation?.referenzId || ""]?.value;
        ad = request?.bedarf;
    }
    const variantId = ad?.artikelVarianteId;
    const variants = ad?.artikel.varianten;
    const variant = variants?.find(v => v.id === variantId);
    const articleName = request ? ad?.artikel.name + ((variants?.length || 0) > 1 ? " (" + variant?.variante + ")" : "") : "";
    const mine = request?.institution.id === person?.aktuellerStandort.institution.id;
    const title = (mine ? "Ihre Anfrage " : ("Anfrage von " + (request?.institution.name || "???"))) + " zu " + (conversation?.referenzTyp === "ANGEBOT_ANFRAGE" ? "Angebot" : "Bedarf") + ": " + (ad?.verfuegbareAnzahl || "???") + " " + (articleName || "");

    const requestAction = useCallback(async (action: "accept" | "dismiss" | "cancel") => {
        setInputDisabled(true);
        const type = conversation?.referenzTyp === "ANGEBOT_ANFRAGE" ? "angebot" : "bedarf";
        const result = await apiPost(`/remedy/${type}/${ad?.id}/anfrage/${conversation?.referenzId}/${action === "cancel" ? "stornieren" : "beantworten"}`, action !== "cancel" ? {
            entscheidung: action === "accept"
        } : undefined);
        if(result.error) {
            setError(result.error);
            setInputDisabled(false);
        } else {
            refreshData();
        }
    }, [refreshData, conversation, ad]);

    const onCancelRequestClicked = useCallback(() => requestAction("cancel"), [requestAction]);
    const onAcceptRequestClicked = useCallback(() => requestAction("accept"), [requestAction]);
    const onDismissRequestClicked = useCallback(() => requestAction("dismiss"), [requestAction]);

    return (
        <>
            <div className={classes.container}>
                <div className={classes.header}>
                    <span
                        className={classes.title}>{title}</span>
                    <span className={classes.participants}>{conversation?.beteiligte.join(", ")}</span>
                </div>

                <div className={classes.messageContainer}>
                    {
                        conversation?.nachrichten.map(m => ({
                            ...m,
                            timestamp: new Date(m.erstelltAm).getTime()
                        })).sort((a, b) => a.timestamp - b.timestamp).map(message => (
                            <div
                                className={clsx(classes.message, person?.aktuellerStandort.institution.id === message.erstellerInstitution ? classes.messageRight : classes.messageLeft)}>
                                <span className={classes.messageSender}>{message.erstellerName}</span>
                                <span className={classes.messageText}>{message.nachricht}</span>
                                <span className={classes.messageSent}>{formatDate(message.erstelltAm)}</span>
                            </div>
                        ))
                    }
                </div>

                {error && (
                    <div className={classes.errorContainer}>
                        <span className={classes.errorMessage}>
                            {error}
                        </span>
                        <IconButton
                            className={classes.dismissErrorButton}
                            size="small"
                            onClick={onDismissErrorClicked}>
                            <Close/>
                        </IconButton>
                    </div>
                )}

                {request?.status === "OFFEN" && (
                    <div className={classes.actionContainer}>
                        <span className={classes.actionHint}>
                            {mine
                                ? "Diese Anfrage wurde noch nicht beantwortet."
                                : "Sie haben diese Anfrage noch nicht beantwortet."}
                        </span>
                        <div className={classes.actionButtonContainer}>
                            {!mine && (
                                <>
                                    <Button
                                        onClick={onDismissRequestClicked}
                                        disableElevation
                                        disabled={inputDisabled}
                                        className={classes.button}
                                        variant="contained"
                                        size="small">
                                        Anfrage ablehnen
                                    </Button>
                                    <Button
                                        onClick={onAcceptRequestClicked}
                                        disableElevation
                                        disabled={inputDisabled}
                                        className={classes.button}
                                        variant="contained"
                                        size="small">
                                        Anfrage annehmen
                                    </Button>
                                </>
                            )}
                            {mine && (
                                <Button
                                    onClick={onCancelRequestClicked}
                                    disableElevation
                                    disabled={inputDisabled}
                                    className={classes.button}
                                    variant="contained"
                                    size="small">
                                    Anfrage stornieren
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {request?.status !== "OFFEN" && (
                    <div className={classes.actionContainer}>
                        <span className={classes.actionHint}>
                            {request?.status === "ANGENOMMEN" && "Diese Anfrage wurde angenommen."}
                            {request?.status === "ABGELEHNT" && "Diese Anfrage wurde abgelehnt."}
                            {request?.status === "STORNIERT" && "Diese Anfrage wurde storniert."}
                        </span>
                    </div>
                )}

                <div className={classes.footer}>
                    <TextArea
                        disabled={inputDisabled}
                        className={classes.footerInput}
                        placeholder="Ihre Nachricht..."
                        onChange={setInputText}
                        value={inputText}
                        minLines={1}
                        maxLines={5}/>
                    <IconButton
                        disabled={inputDisabled || inputText.trim().length === 0}
                        className={classes.footerSend}
                        onClick={onSendClicked}>
                        <Send/>
                    </IconButton>
                </div>
            </div>
        </>
    );
};

export default ConversationScreen;