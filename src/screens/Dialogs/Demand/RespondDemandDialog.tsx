import React, {ChangeEvent, PureComponent} from "react";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {TextareaAutosize} from "@material-ui/core";
import {WithStylesPublic} from "../../../util/WithStylesPublic";
import {apiPost} from "../../../util/ApiUtils";
import {FormTextInput} from "../../../components/FormTextInput";
import {handleDialogButton} from "../../../util/DialogUtils";
import {defined, validate} from "../../../util/ValidationUtils";
import PopupDialog from "../../../components/PopupDialog";

interface Props extends WithStylesPublic<typeof styles> {
    open: boolean;
    onCancelled: () => void;
    onSaved: () => void;
    demandId?: string;
    standort?: string;
}

interface State {
    comment: string;
    location: string;
    disabled: boolean;
    amount: number;
    error?: string;
}

const initialState = {
    comment: "",
    location: "",
    disabled: false,
    amount: 0,
    error: undefined
};

const styles = (theme: Theme) =>
    createStyles({
        comment: {
            marginTop: "16px",
            resize: "none",
            fontSize: "14px",
            padding: "16px",
            "&:focus": {
                outline: "none",
                border: "2px solid " + theme.palette.primary.main
            }
        },
        caption: {
            textAlign: "right",
            marginTop: "8px"
        }
    });

class RespondDemandDialog extends PureComponent<Props, State> {
    state: State = {...initialState};

    private onSave = async () => {
        handleDialogButton(
            this.setState.bind(this),
            this.props.onSaved,
            () => validate(
                defined(this.props.demandId, "Bedarf nicht gesetzt!")
            ),
            () => apiPost("/remedy/bedarf/bedienen", {
                bedarfId: this.props.demandId,
                kommentar: this.state.comment,
                standort: this.state.location,
                anzahl: this.state.amount
            }),
            initialState
        );
    };

    private onCancel = () => {
        this.setState({
            error: undefined
        });

        this.props.onCancelled();
    };

    private onCloseError = () => {
        this.setState({error: undefined});
    };

    private setLocation = (location: string) => {
        this.setState({location: location});
    };

    private setComment = (event: ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({comment: event.target.value});
    };

    public render = () => {
        const classes = this.props.classes!;

        return (
            <PopupDialog
                width="md"
                open={this.props.open}
                error={this.state.error}
                title="Kontakt aufnehmen"
                disabled={this.state.disabled}
                firstTitle="Abbrechen"
                secondTitle="Absenden"
                onFirst={this.onCancel}
                onSecond={this.onSave}
                onCloseError={this.onCloseError}>
                <FormTextInput
                    label="Standort des Artikels"
                    changeListener={this.setLocation}
                    value={this.state.location}
                    disabled={this.state.disabled}/>
                <FormTextInput
                    min={1}
                    label="Anzahl"
                    type="number"
                    changeListener={(value: string) => this.setState({amount: +value})}
                    value={"" + this.state.amount}
                    disabled={this.state.disabled}/>
                <TextareaAutosize
                    rowsMin={3}
                    rowsMax={8}
                    placeholder="Kommentar"
                    value={this.state.comment}
                    disabled={this.state.disabled}
                    className={classes.comment}
                    onChange={this.setComment}/>
            </PopupDialog>
        );
    };
}

export default withStyles(styles)(RespondDemandDialog);