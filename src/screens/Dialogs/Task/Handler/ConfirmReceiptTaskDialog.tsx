import React, {PureComponent} from "react";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {WithStylesPublic} from "../../../../util/WithStylesPublic";
import {Aufgabe} from "../../../../Domain/Aufgabe";
import {Typography} from "@material-ui/core";
import {apiPost} from "../../../../util/ApiUtils";
import {handleDialogButton} from "../../../../util/DialogUtils";
import {defined, validate} from "../../../../util/ValidationUtils";
import PopupDialog from "../../../../components/Dialog/PopupDialog";

interface Props extends WithStylesPublic<typeof styles> {
    onCancelled: () => void;
    onFinished: () => void;
    task?: Aufgabe;
}

interface State {
    disabled: boolean;
    error?: string;
}

const styles = (theme: Theme) =>
    createStyles({
        description: {
            marginBottom: "8px"
        },
        subtitle: {
            fontWeight: 500
        }
    });

class ConfirmReceiptTaskDialog extends PureComponent<Props, State> {
    state: State = {
        disabled: false
    };

    private onSave = () => {
        handleDialogButton(
            this.setState.bind(this),
            this.props.onFinished,
            () => validate(
                defined(this.props.task, "Aufgabe nicht gesetzt!")
            ),
            () => apiPost("/remedy/aufgabe", {
                taskId: this.props.task!.taskId,
                variables: {}
            })
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

    render() {
        const classes = this.props.classes!;

        return (
            <PopupDialog
                open
                width="md"
                error={this.state.error}
                title={"Aufgabe " + this.props.task?.taskName + " bearbeiten"}
                disabled={this.state.disabled}
                firstTitle="Abbrechen"
                secondTitle="Empfang bestätigen"
                onFirst={this.onCancel}
                onSecond={this.onSave}
                onCloseError={this.onCloseError}>
                <Typography variant="body1" className={classes.description}>
                    {this.props.task?.displayName}
                </Typography>
                <Typography variant="subtitle1" className={classes.subtitle}>
                    Durch Abschicken des Formulars bestätigst du den Empfang der Ware.
                </Typography>
            </PopupDialog>
        );
    }
}

export default withStyles(styles)(ConfirmReceiptTaskDialog);