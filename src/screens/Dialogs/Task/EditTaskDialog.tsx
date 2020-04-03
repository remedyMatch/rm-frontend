import React from "react";
import {Aufgabe} from "../../../Domain/Aufgabe";
import RespondRequestTaskDialog from "./Handler/RespondRequestTaskDialog";
import ConfirmReceiptTaskDialog from "./Handler/ConfirmReceiptTaskDialog";
import {Anfrage} from "../../../Domain/Anfrage";
import {Angebot} from "../../../Domain/Angebot";
import {Bedarf} from "../../../Domain/Bedarf";

interface Props {
    open: boolean;
    onCancelled: () => void;
    onFinished: () => void;
    task?: Aufgabe;
    request?: Anfrage;
    item?: Angebot | Bedarf;
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