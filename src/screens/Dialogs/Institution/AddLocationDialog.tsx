import React, {Component} from "react";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {WithStylesPublic} from "../../../util/WithStylesPublic";
import {apiPost} from "../../../util/ApiUtils";
import {Institution} from "../../../Domain/Institution";
import {FormTextInput} from "../../../components/Form/FormTextInput";
import PopupDialog from "../../../components/Dialog/PopupDialog";
import {stringLength, validate} from "../../../util/ValidationUtils";
import {handleDialogButton} from "../../../util/DialogUtils";

interface Props extends WithStylesPublic<typeof styles> {
    open: boolean;
    onCancelled: () => void;
    onSaved: () => void;
    institution?: Institution;
}

interface State {
    name: string;
    plz: string;
    ort: string;
    strasse: string;
    hausnummer: string;
    land: string;
    disabled: boolean;
    error?: string;
}

const styles = (theme: Theme) =>
    createStyles({
        formRow: {
            marginTop: "8px"
        }
    });

const initialState = {
    name: "",
    plz: "",
    ort: "",
    strasse: "",
    hausnummer: "",
    land: "",
    disabled: false,
    error: undefined
};

class AddLocationDialog extends Component<Props, State> {
    state: State = {...initialState};

    private onSave = () => {
        handleDialogButton(
            this.setState.bind(this),
            this.props.onSaved,
            () => validate(
                stringLength(this.state.name, "Der Name", 1),
                stringLength(this.state.strasse, "Die Straße", 1),
                stringLength(this.state.plz, "Die PLZ", 1),
                stringLength(this.state.ort, "Der Ort", 1),
                stringLength(this.state.land, "Das Land", 1),
            ),
            () => apiPost("/remedy/institution/standort", {
                name: this.state.name,
                strasse: this.state.strasse,
                plz: this.state.plz,
                ort: this.state.ort,
                land: this.state.land
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

    private setName = (name: string) => {
        this.setState({
            error: undefined,
            name: name
        });
    };

    private setStrasse = (strasse: string) => {
        this.setState({
            error: undefined,
            strasse: strasse
        });
    };

    private setHausnummer = (hausnummer: string) => {
        this.setState({
            error: undefined,
            hausnummer: hausnummer
        });
    };

    private setPlz = (plz: string) => {
        this.setState({
            error: undefined,
            plz: plz
        });
    };

    private setOrt = (ort: string) => {
        this.setState({
            error: undefined,
            ort: ort
        });
    };

    private setLand = (land: string) => {
        this.setState({
            error: undefined,
            land: land
        });
    };

    public render = () => {
        const classes = this.props.classes!;

        return (
            <PopupDialog
                fullWidth={false}
                open={this.props.open}
                error={this.state.error}
                title="Weiteren Standort hinzufügen"
                disabled={this.state.disabled}
                firstTitle="Abbrechen"
                secondTitle="Speichern"
                onFirst={this.onCancel}
                onSecond={this.onSave}
                onCloseError={this.onCloseError}>
                <FormTextInput
                    label="Name"
                    changeListener={this.setName}
                    value={this.state.name}
                    className={classes.formRow}
                    disabled={this.state.disabled}/>
                <FormTextInput
                    label="Straße"
                    changeListener={this.setStrasse}
                    value={this.state.strasse}
                    className={classes.formRow}
                    disabled={this.state.disabled}/>
                <FormTextInput
                    label="Hausnummer"
                    changeListener={this.setHausnummer}
                    value={this.state.hausnummer}
                    className={classes.formRow}
                    disabled={this.state.disabled}/>
                <FormTextInput
                    label="PLZ"
                    changeListener={this.setPlz}
                    value={this.state.plz}
                    className={classes.formRow}
                    disabled={this.state.disabled}/>
                <FormTextInput
                    label="Ort"
                    changeListener={this.setOrt}
                    value={this.state.ort}
                    className={classes.formRow}
                    disabled={this.state.disabled}/>
                <FormTextInput
                    label="Land"
                    changeListener={this.setLand}
                    value={this.state.land}
                    className={classes.formRow}
                    disabled={this.state.disabled}/>
            </PopupDialog>
        );
    };
}

export default withStyles(styles)(AddLocationDialog);