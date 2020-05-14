import {IconButton} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Send} from "@material-ui/icons";
import clsx from "clsx";
import {format, isThisYear, isToday, isYesterday} from "date-fns";
import {de} from "date-fns/locale";
import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useRouteMatch} from "react-router-dom";
import TextArea from "../components/Form/TextArea";
import {Konversation} from "../domain/nachricht/Konversation";
import {RootState} from "../state/Store";
import {apiGet, apiPost} from "../util/ApiUtils";

const useStyles = makeStyles(() => ({
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
        flexDirection: "column",
        whiteSpace: "pre-line"
    },
    messageLeft: {
        marginRight: "35%",
        placeSelf: "flex-start",
        backgroundColor: "white"
    },
    messageRight: {
        marginLeft: "35%",
        placeSelf: "flex-end",
        backgroundColor: "#aabec6"
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
        marginBottom: "4px"
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
    const history = useHistory();
    const match = useRouteMatch<{ conversationId: string }>();

    const conversations = useSelector((state: RootState) => state.konversationen.value) || [];
    const person = useSelector((state: RootState) => state.person.value);

    const [conversation, setConversation] = useState<Konversation | undefined>(conversations.find(k => k.id === match.params.conversationId));
    const [inputText, setInputText] = useState("");
    const [inputDisabled, setInputDisabled] = useState(false);

    const loadConversation = useCallback(() => {
        const load = async (id: string) => {
            const result = await apiGet<Konversation>("/remedy/konversation/" + id);
            if (!result.error) {
                setConversation(result.result);
            }
        };
        load(match.params.conversationId);
    }, [match]);

    const onSendClicked = useCallback(() => {
        const send = async () => {
            setInputDisabled(true);
            const result = await apiPost("/remedy/konversation/" + match.params.conversationId + "/nachricht", {
                nachricht: inputText.trim()
            });
            if (!result.error) {
                loadConversation();
                setInputText("");
                setInputDisabled(false);
            }
        };
        send();
    }, [match, inputText, loadConversation]);

    useEffect(() => {
        loadConversation();
        const interval = setInterval(loadConversation, 10 * 1000);
        return () => clearInterval(interval);
    }, [dispatch, loadConversation]);

    return (
        <>
            <div className={classes.container}>
                <div className={classes.header}>
                    <span
                        className={classes.title}>Konversation über Angebot über 200 Einweghandschuhe in Größe XXL</span>
                    <span className={classes.participants}>{conversation?.beteiligte.join(", ")}</span>
                </div>

                <div className={classes.messageContainer}>
                    {
                        conversation?.nachrichten.slice().map(m => ({
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