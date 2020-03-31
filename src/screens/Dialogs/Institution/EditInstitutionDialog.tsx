import React, {Component} from "react";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {TextField} from "@material-ui/core";
import {WithStylesPublic} from "../../../util/WithStylesPublic";
import {apiPut} from "../../../util/ApiUtils";
import {Autocomplete} from "@material-ui/lab";
import {Institution} from "../../../Domain/Institution";
import {FormTextInput} from "../../../components/FormTextInput";
import PopupDialog from "../../../components/PopupDialog";
import {defined, stringLength, validate} from "../../../util/ValidationUtils";
import {handleDialogButton} from "../../../util/DialogUtils";

interface Props extends WithStylesPublic<typeof styles> {
    open: boolean;
    onCancelled: () => void;
    onSaved: () => void;
    typeOptions: string[];
    institution?: Institution;
}

interface State {
    name: string;
    type?: string;
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
    type: undefined,
    disabled: false,
    error: undefined
};

class EditInstitutionDialog extends Component<Props, State> {
    state: State = {...initialState};

    private onSave = () => {
        handleDialogButton(
            this.setState.bind(this),
            this.props.onSaved,
            () => validate(
                defined(this.props.institution, "Institution nicht gesetzt!"),
                stringLength(this.state.name, "Der Name", 1),
                defined(this.state.type, "Der Typ muss gesetzt sein!")
            ),
            () => apiPut("/remedy/institution", {
                name: this.state.name,
                typ: this.state.type,
                id: this.props.institution!.id
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

    private setType = (event: any, type: string | null) => {
        this.setState({
            error: undefined,
            type: type || undefined
        });
    };

    public render = () => {
        const classes = this.props.classes!;

        return (
            <PopupDialog
                open={this.props.open}
                error={this.state.error}
                title="Institution bearbeiten"
                disabled={this.state.disabled}
                firstTitle="Abbrechen"
                secondTitle="Speichern"
                onFirst={this.onCancel}
                onSecond={this.onSave}
                onCloseError={this.onCloseError}>
                <Autocomplete
                    size="small"
                    onChange={this.setType}
                    options={this.props.typeOptions}
                    value={this.state.type || null}
                    disableClearable
                    renderInput={params => (
                        <TextField
                            {...params}
                            label="Typ"
                            variant="outlined"/>
                    )}
                />
                <FormTextInput
                    label="Name"
                    changeListener={this.setName}
                    value={this.state.name}
                    className={classes.formRow}
                    disabled={this.state.disabled}/>
            </PopupDialog>
        );
    };

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        if (!prevProps.institution && this.props.institution) {
            this.setState({
                name: this.props.institution.name || "",
                type: this.props.institution.typ
            })
        }
    }
}

export default withStyles(styles)(EditInstitutionDialog);