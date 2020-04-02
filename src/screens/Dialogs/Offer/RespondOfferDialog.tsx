import React, {ChangeEvent, PureComponent} from "react";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {TextareaAutosize} from "@material-ui/core";
import {WithStylesPublic} from "../../../util/WithStylesPublic";
import {apiPost} from "../../../util/ApiUtils";
import {FormTextInput} from "../../../components/Form/FormTextInput";
import {handleDialogButton} from "../../../util/DialogUtils";
import {defined, numberSize, stringLength, validate} from "../../../util/ValidationUtils";
import PopupDialog from "../../../components/Dialog/PopupDialog";
import {FormLocationPicker} from "../../../components/Form/FormLocationPicker";
import {InstitutionStandort} from "../../../Domain/InstitutionStandort";
import {Angebot} from "../../../Domain/Angebot";
import {Institution} from "../../../Domain/Institution";

interface Props extends WithStylesPublic<typeof styles> {
    open: boolean;
    onCancelled: () => void;
    onSaved: () => void;
    angebot?: Angebot;
    eigeneInstitution?: Institution;
}

interface State {
    comment: string;
    location?: string;
    disabled: boolean;
    amount: number;
    error?: string;
}

const initialState = {
    comment: "",
    location: undefined,
    disabled: false,
    amount: 0,
    error: undefined
};

const styles = (theme: Theme) =>
    createStyles({
        caption: {
            textAlign: "right",
            marginTop: "8px"
        },
        formRow: {
            marginTop: "16px"
        },
        comment: {
            marginTop: "16px",
            resize: "none",
            fontSize: "14px",
            padding: "16px",
            "&:focus": {
                outline: "none",
                border: "2px solid " + theme.palette.primary.main
            }
        }
    });

class RespondOfferDialog extends PureComponent<Props, State> {
    state: State = {...initialState};

    private onSave = async () => {
        handleDialogButton(
            this.setState.bind(this),
            this.props.onSaved,
            () => validate(
                defined(this.props.angebot, "Angebot nicht gesetzt!"),
                defined(this.props.eigeneInstitution, "Eigene Institution nicht gesetzt!"),
                defined(this.state.location, "Es muss ein Standort gesetzt werden!"),
                numberSize(this.state.amount, "Die Anzahl", 1),
                stringLength(this.state.comment, "Der Kommentar", 1)
            ),
            () => apiPost("/remedy/angebot/anfragen", {
                angebotId: this.props.angebot!.id,
                kommentar: this.state.comment,
                standortId: this.state.location,
                anzahl: this.state.amount
            }),
            initialState
        );
    };

    private onCancel = () => {
        this.onCloseError();
        this.props.onCancelled();
    };

    private onCloseError = () => {
        this.setState({error: undefined});
    };

    private setComment = (event: ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({comment: event.target.value});
    };

    private setLocation = (location: InstitutionStandort | null) => {
        this.setState({location: location === null ? undefined : location.id});
    };

    private getLocationOptions = () => {
        return ([] as InstitutionStandort[])
            .concat(this.props.eigeneInstitution?.hauptstandort || [])
            .concat(this.props.eigeneInstitution?.standorte || []);
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
                <FormLocationPicker
                    label="Artikel-Standort"
                    options={this.getLocationOptions()}
                    onSelect={this.setLocation}
                    disabled={this.state.disabled}
                    valueId={this.state.location}/>
                <FormTextInput
                    min={1}
                    label="Anzahl"
                    type="number"
                    changeListener={(value: string) => this.setState({amount: +value})}
                    value={"" + this.state.amount}
                    className={classes.formRow}
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

export default withStyles(styles)(RespondOfferDialog);