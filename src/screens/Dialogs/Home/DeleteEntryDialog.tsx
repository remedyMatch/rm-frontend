import React, {Component} from "react";
import {DialogContentText} from "@material-ui/core";
import {apiDelete} from "../../../util/ApiUtils";
import PopupDialog from "../../../components/Dialog/PopupDialog";
import {defined, validate} from "../../../util/ValidationUtils";
import {handleDialogButton} from "../../../util/DialogUtils";

interface Props {
    open: boolean;
    onNo: () => void;
    onYes: () => void;
    requestId?: string;
    isDemand?: boolean;
    item?: {
        rest: number;
        artikel: {
            name: string;
        };
    }
}

interface State {
    disabled: boolean;
    error?: string;
}

class DeleteEntryDialog extends Component<Props, State> {
    state: State = {
        disabled: false
    };

    render() {
        return (
            <PopupDialog
                open={this.props.open}
                error={this.state.error}
                title="Anzeige löschen"
                disabled={this.state.disabled}
                firstTitle="Abbrechen"
                secondTitle="Löschen"
                onFirst={this.onNo}
                onSecond={this.onYes}
                onCloseError={this.onCloseError}>
                <DialogContentText>
                    Soll
                    {this.props.isDemand && " der Bedarf nach "}
                    {!this.props.isDemand && " das Angebot über "}
                    {this.props.item?.rest + " "}
                    {this.props.item?.artikel.name + " "}
                    wirklich gelöscht werden?
                </DialogContentText>
            </PopupDialog>
        );
    }

    private onNo = () => {
        this.onCloseError();
        this.props.onNo();
    };

    private onYes = () => {
        handleDialogButton(
            this.setState.bind(this),
            this.props.onYes,
            () => validate(
                defined(this.props.requestId, "Anfrage nicht gesetzt!")
            ),
            () => apiDelete("/remedy/" + (this.props.isDemand ? "bedarf/" : "angebot/") + this.props.requestId)
        );
    };

    private onCloseError = () => {
        this.setState({error: undefined});
    };
}

export default DeleteEntryDialog;