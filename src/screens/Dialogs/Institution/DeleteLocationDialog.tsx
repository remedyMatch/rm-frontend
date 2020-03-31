import React, {Component} from "react";
import {DialogContentText} from "@material-ui/core";
import {apiDelete} from "../../../util/ApiUtils";
import PopupDialog from "../../../components/Dialog/PopupDialog";
import {defined, validate} from "../../../util/ValidationUtils";
import {handleDialogButton} from "../../../util/DialogUtils";

interface Props {
    open: boolean;
    onCancelled: () => void;
    onDeleted: () => void;
    locationId?: string;
}

interface State {
    disabled: boolean;
    error?: string;
}

const initialState = {
    disabled: false,
    error: undefined
};

class DeleteLocationDialog extends Component<Props, State> {
    state: State = {...initialState};

    private onDelete = () => {
        handleDialogButton(
            this.setState.bind(this),
            this.props.onDeleted,
            () => validate(
                defined(this.props.locationId, "Standort nicht gesetzt!")
            ),
            () => apiDelete("/remedy/institution/standort/" + this.props.locationId)
        );
    };

    private onCancel = () => {
        this.onCloseError();
        this.props.onCancelled();
    };

    private onCloseError = () => {
        this.setState({error: undefined});
    };

    public render = () => {
        return (
            <PopupDialog
                fullWidth={false}
                open={this.props.open}
                error={this.state.error}
                title="Weiteren Standort löschen"
                disabled={this.state.disabled}
                firstTitle="Abbrechen"
                secondTitle="Löschen"
                onFirst={this.onCancel}
                onSecond={this.onDelete}
                onCloseError={this.onCloseError}>
                <DialogContentText>
                    Soll der Standort wirklich gelöscht werden?
                </DialogContentText>
            </PopupDialog>
        );
    };
}

export default DeleteLocationDialog;