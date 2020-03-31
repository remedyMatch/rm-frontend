import React from "react";
import {Aufgabe} from "../../../Domain/Aufgabe";
import RespondRequestTaskDialog from "./Handler/RespondRequestTaskDialog";
import PickLogisticsTaskDialog from "./Handler/PickLogisticsTaskDialog";
import ConfirmReceiptTaskDialog from "./Handler/ConfirmReceiptTaskDialog";

interface Props {
    open: boolean;
    onCancelled: () => void;
    onFinished: () => void;
    task?: Aufgabe;
}

const EditTaskDialog: React.FC<Props> = props => {
    switch (props.task?.taskKey) {
        case "anfrage_prozess_beantworten": {
            return (
                <RespondRequestTaskDialog
                    task={props.task}
                    onFinished={props.onFinished}
                    onCancelled={props.onCancelled}/>
            );
        }
        case "anfrage_prozess_logistikart": {
            return (
                <PickLogisticsTaskDialog
                    task={props.task}
                    onFinished={props.onFinished}
                    onCancelled={props.onCancelled}/>
            );
        }
        case "anfrage_prozess_empfang_bestaetigen": {
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