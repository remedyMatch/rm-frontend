import React, {ChangeEvent, Component} from "react";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import {WithStylesPublic} from "../../util/WithStylesPublic";
import {apiPut} from "../../util/ApiUtils";
import ErrorToast from "../../components/ErrorToast";
import {Autocomplete} from "@material-ui/lab";
import {Institution} from "../../Model/Institution";
import {FormTextInput} from "../../components/FormTextInput";

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
    location: string;
    disabled: boolean;
    error?: string;
}

const styles = (theme: Theme) =>
    createStyles({
        content: {
            width: "40vh",
            paddingBottom: "16px",
            display: "flex",
            flexDirection: "column"
        },
        formRow: {
            marginTop: "16px"
        }
    });

class CreateRoleDialog extends Component<Props, State> {
    state: State = {
        name: "",
        location: "",
        disabled: false
    };

    private onSave = async () => {
        if(!this.props.institution) {
            this.setState({
                error: "Institution nicht gesetzt!"
            });
            return;
        }

        if (this.state.name.length === 0) {
            this.setState({
                error: "Der Name darf nicht leer sein!"
            });
            return;
        }

        if (this.state.location.length === 0) {
            this.setState({
                error: "Der Standort darf nicht leer sein!"
            });
            return;
        }

        if (!this.state.type) {
            this.setState({
                error: "Der Typ muss gesetzt sein!"
            });
            return;
        }

        this.setState({
            disabled: true,
            error: undefined
        });

        const result = await apiPut("/remedy/institution", {
            standort: this.state.location,
            name: this.state.name,
            typ: this.state.type,
            id: this.props.institution.id
        });

        if (result.error) {
            this.setState({
                disabled: false,
                error: result.error
            });
        } else {
            this.setState({
                disabled: false
            });
            this.props.onSaved();
        }
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

    private setName = (name: string) => {
        this.setState({
            error: undefined,
            name: name
        });
    };

    private setLocation = (location: string) => {
        this.setState({
            error: undefined,
            location: location
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
            <Dialog
                maxWidth="lg"
                open={this.props.open}
                onClose={this.onCancel}>
                <DialogTitle>Institution bearbeiten</DialogTitle>
                <DialogContent>
                    <div className={classes.content}>
                        <ErrorToast error={this.state.error} onClose={this.onCloseError}/>
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
                            disabled={this.state.disabled} />
                        <FormTextInput
                            label="Standort"
                            changeListener={this.setLocation}
                            value={this.state.location}
                            className={classes.formRow}
                            disabled={this.state.disabled} />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.onCancel} color="secondary">
                        Abbrechen
                    </Button>
                    <Button onClick={this.onSave} color="secondary">
                        Speichern
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        if(!prevProps.institution && this.props.institution) {
            this.setState({
                name: this.props.institution.name,
                location: this.props.institution.standort,
                type: this.props.institution.typ,
            })
        }
    }
}

export default withStyles(styles)(CreateRoleDialog);