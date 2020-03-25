import React, {PureComponent} from "react";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {WithStylesPublic} from "../../../../util/WithStylesPublic";
import {Aufgabe} from "../../../../Model/Aufgabe";
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Typography
} from "@material-ui/core";
import {apiPost} from "../../../../util/ApiUtils";
import ErrorToast from "../../../../components/ErrorToast";

interface Props extends WithStylesPublic<typeof styles> {
    onCancelled: () => void;
    onFinished: () => void;
    task?: Aufgabe;
}

interface State {
    disabled: boolean;
    error?: string;
    accept: boolean;
}

const styles = (theme: Theme) =>
    createStyles({
        content: {
            width: "60vw",
            maxWidth: "400px",
            paddingBottom: "16px",
            display: "flex",
            flexDirection: "column"
        },
        description: {
            marginBottom: "8px"
        },
        subtitle: {
            fontWeight: 500
        }
    });

class RespondRequestTaskDialog extends PureComponent<Props, State> {
    state: State = {
        accept: false,
        disabled: false
    };

    private setAccept = (e: any, accept: boolean) => {
        this.setState({
            accept: accept
        });
    };

    private onSave = async () => {
        if(!this.props.task) {
            this.setState({
                error: "Aufgabe nicht gesetzt!"
            });
            return;
        }

        this.setState({
            disabled: true,
            error: undefined
        });

        const result = await apiPost("/remedy/aufgabe", {
            taskId: this.props.task.taskId,
            variables: {
                angenommen: this.state.accept
            }
        });

        if (result.error) {
            this.setState({
                disabled: false,
                error: "Speichern der Angaben fehlgeschlagen: " + result.error
            });
            return;
        }

        this.setState({
            accept: false,
            disabled: false
        });

        this.props.onFinished();
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

    render() {
        const classes = this.props.classes!;

        return (
            <Dialog
                open
                maxWidth="lg"
                onClose={this.props.onCancelled}>
                <DialogTitle>Aufgabe {this.props.task?.taskName} bearbeiten</DialogTitle>
                <DialogContent>
                    <div className={classes.content}>
                        <ErrorToast error={this.state.error} onClose={this.onCloseError}/>
                        <Typography variant="body1" className={classes.description}>
                            {this.props.task?.displayName}
                        </Typography>
                        <Typography variant="subtitle1" className={classes.subtitle}>
                            Bitte das folgende Formular ausfüllen, um die Aufgabe abzuschließen:
                        </Typography>
                        <FormControlLabel
                            control={(
                                <Checkbox
                                    disabled={this.state.disabled}
                                    checked={this.state.accept}
                                    onChange={this.setAccept}
                                />
                            )}
                            label="Anfrage akzeptieren"
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.onCancel} color="secondary">
                        Abbrechen
                    </Button>
                    <Button onClick={this.onSave} color="secondary">
                        Absenden
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(RespondRequestTaskDialog);