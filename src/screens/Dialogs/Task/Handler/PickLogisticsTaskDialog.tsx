import React, {PureComponent} from "react";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {WithStylesPublic} from "../../../../util/WithStylesPublic";
import {Aufgabe} from "../../../../Domain/Aufgabe";
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
import PopupDialog from "../../../../components/PopupDialog";
import {handleDialogButton} from "../../../../util/DialogUtils";
import {defined, validate} from "../../../../util/ValidationUtils";

interface Props extends WithStylesPublic<typeof styles> {
    onCancelled: () => void;
    onFinished: () => void;
    task?: Aufgabe;
}

interface State {
    disabled: boolean;
    error?: string;
    selfDistribution: boolean;
}

const initialState = {
    disabled: false,
    error: undefined,
    selfDistribution: false
};

const styles = (theme: Theme) =>
    createStyles({
        description: {
            marginBottom: "8px"
        },
        subtitle: {
            fontWeight: 500
        }
    });

class PickLogisticsTaskDialog extends PureComponent<Props, State> {
    state: State = {...initialState};

    private onSave = () => {
        handleDialogButton(
            this.setState,
            this.props.onFinished,
            () => validate(
                defined(this.props.task, "Aufgabe nicht gesetzt!")
            ),
            () => apiPost("/remedy/aufgabe", {
                taskId: this.props.task!.taskId,
                variables: {
                    selbstAusliefern: this.state.selfDistribution
                }
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

    private setSelfDistribution = (e: any, selfDistribution: boolean) => {
        this.setState({selfDistribution: selfDistribution});
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
                secondTitle="Absenden"
                onFirst={this.onCancel}
                onSecond={this.onSave}
                onCloseError={this.onCloseError}>
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
                            checked={this.state.selfDistribution}
                            onChange={this.setSelfDistribution}
                        />
                    )}
                    label="Ware selbst ausliefern"
                />
            </PopupDialog>
        );
    }
}

export default withStyles(styles)(PickLogisticsTaskDialog);