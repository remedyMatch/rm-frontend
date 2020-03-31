import React, {Component} from "react";
import {DialogContentText} from "@material-ui/core";
import {Anfrage} from "../../Domain/Anfrage";
import {apiDelete} from "../../util/ApiUtils";
import PopupDialog from "../../components/PopupDialog";
import {defined, validate} from "../../util/ValidationUtils";
import {handleDialogButton} from "../../util/DialogUtils";

interface Props {
    open: boolean;
    onNo: () => void;
    onYes: () => void;
    request?: Anfrage;
}

interface State {
    disabled: boolean;
    error?: string;
}

class CancelReceivedOfferDialog extends Component<Props, State> {
    state: State = {
        disabled: false
    };

    render() {
        return (
            <PopupDialog
                open={this.props.open}
                error={this.state.error}
                title="Institution bearbeiten"
                disabled={this.state.disabled}
                firstTitle="Abbrechen"
                secondTitle="Stornieren"
                onFirst={this.onNo}
                onSecond={this.onYes}
                onCloseError={this.onCloseError}>
                <DialogContentText>
                    Soll die Anfrage an {this.props.request?.institutionAn.name} wirklich storniert werden?
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
                defined(this.props.request, "Anfrage nicht gesetzt!")
            ),
            () => apiDelete("/remedy/anfrage/" + this.props.request!.id)
        );
    };

    private onCloseError = () => {
        this.setState({error: undefined});
    };
}

export default CancelReceivedOfferDialog;