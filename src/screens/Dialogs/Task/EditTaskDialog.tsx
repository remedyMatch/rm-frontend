import React from "react";
import {Aufgabe} from "../../../domain/old/Aufgabe";
import RespondRequestTaskDialog from "./Handler/RespondRequestTaskDialog";
import ConfirmReceiptTaskDialog from "./Handler/ConfirmReceiptTaskDialog";
import {AngebotAnfrage} from "../../../domain/Anfrage";
import {Angebot} from "../../../domain/old/Angebot";
import {Bedarf} from "../../../domain/old/Bedarf";
import {Match} from "../../../domain/old/Match";
import {Artikel} from "../../../domain/old/Artikel";

interface Props {
    open: boolean;
    onCancelled: () => void;
    onFinished: () => void;
    task?: Aufgabe;
    request?: AngebotAnfrage;
    item?: Angebot | Bedarf;
    match?: Match;
    article?: Artikel;
}

const EditTaskDialog: React.FC<Props> = props => {
    switch (props.task?.taskKey) {
        case "angebot_anfrage_prozess_beantworten":
        case "bedarf_anfrage_prozess_beantworten": {
            return (
                <RespondRequestTaskDialog
                    task={props.task}
                    item={props.item}
                    request={props.request}
                    onFinished={props.onFinished}
                    onCancelled={props.onCancelled}/>
            );
        }
        case "match_prozess_empfang_bestaetigen": {
            return (
                <ConfirmReceiptTaskDialog
                    task={props.task}
                    match={props.match}
                    article={props.article}
                    onFinished={props.onFinished}
                    onCancelled={props.onCancelled}/>
            );
        }
        default: {
            return null;
        }
    }
};

export default EditTaskDialog;