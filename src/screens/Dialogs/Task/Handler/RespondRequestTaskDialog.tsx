import {Button, Typography} from "@material-ui/core";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {Email, LocalOffer, LocationOn, Search} from "@material-ui/icons";
import React, {PureComponent} from "react";
import PopupDialog from "../../../../components/Dialog/PopupDialog";
import {Anfrage} from "../../../../Domain/Anfrage";
import {Angebot} from "../../../../Domain/Angebot";
import {Aufgabe} from "../../../../Domain/Aufgabe";
import {Bedarf} from "../../../../Domain/Bedarf";
import {apiPost} from "../../../../util/ApiUtils";
import {handleDialogButton} from "../../../../util/DialogUtils";
import {defined, validate} from "../../../../util/ValidationUtils";
import {WithStylesPublic} from "../../../../util/WithStylesPublic";

interface Props extends WithStylesPublic<typeof styles> {
    onCancelled: () => void;
    onFinished: () => void;
    task?: Aufgabe;
    request?: Anfrage;
    item?: Angebot | Bedarf;
}

interface State {
    disabled: boolean;
    error?: string;
}

const initialState = {
    disabled: false,
    error: undefined
};

const styles = (theme: Theme) =>
    createStyles({
        description: {
            marginBottom: "8px"
        },
        subtitle: {
            fontWeight: 500
        },
        button: {
            textTransform: "none",
            margin: "8px 4px"
        },
        buttonRow: {
            display: "flex",
            padding: "8px 12px",
            justifyContent: "space-around"
        },
        text: {
            paddingLeft: "16px",
            whiteSpace: "pre-line"
        },
        iconContainer: {
            display: "flex",
            padding: "16px 16px 16px 32px"
        }
    });

class RespondRequestTaskDialog extends PureComponent<Props, State> {
    state: State = {...initialState};

    private onSave = (accept: boolean) => {
        handleDialogButton(
            this.setState.bind(this),
            this.props.onFinished,
            () => validate(
                defined(this.props.task, "Aufgabe nicht gesetzt!")
            ),
            () => apiPost("/remedy/aufgabe", {
                taskId: this.props.task!.taskId,
                variables: {
                    angenommen: accept
                }
            }),
            initialState
        );
    };

    private onNo = () => {
        this.onSave(false);
    };

    private onYes = () => {
        this.onSave(true);
    };

    private onCancel = () => {
        this.onCloseError();
        this.props.onCancelled();
    };

    private onCloseError = () => {
        this.setState({error: undefined});
    };

    render() {
        const classes = this.props.classes!;

        const item = this.props.item;
        const request = this.props.request;
        const requestor = request?.institutionVon;
        const isOffer = request?.angebotId !== null;

        return (
            <PopupDialog
                open
                width="md"
                error={this.state.error}
                title="Anfrage beantworten"
                disabled={this.state.disabled}
                firstTitle="Abbrechen"
                onFirst={this.onCancel}
                onCloseError={this.onCloseError}>
                <Typography variant="body1" className={classes.description}>
                    Du hast eine Anfrage zu deinem {isOffer ? "Angebot" : "Bedarf"} erhalten:
                </Typography>
                <div className={classes.iconContainer}>
                    <LocationOn/>
                    <Typography variant="body1" className={classes.text}>
                        <b>Anfragende Organisation:</b> <br/>
                        {requestor?.name !== request?.standortVon?.name && (<>{requestor?.name} <br/></>)}
                        {request?.standortVon?.name} <br/>
                        {request?.standortVon?.strasse} <br/>
                        {request?.standortVon?.plz} {request?.standortVon?.ort} <br/>
                        {request?.standortVon?.land} <br/>
                        <i>ca. {request?.entfernung.toFixed()} km entfernt</i>
                    </Typography>
                </div>
                <div className={classes.iconContainer}>
                    {isOffer ? <LocalOffer/> : <Search/>}
                    <Typography variant="body1" className={classes.text}>
                        <b>{isOffer ? "Angebot" : "Bedarf"}:</b> <br/>
                        { // TODO
                        }
                        { /*<i>{item?.artikel.hersteller}</i> <br/>
                        {item?.artikel.name} <br/>*/ }
                        {request?.anzahl} Stück
                    </Typography>
                </div>
                <div className={classes.iconContainer}>
                    <Email/>
                    <Typography variant="body1" className={classes.text}>
                        <b>Gesendete Nachricht:</b> <br/>
                        {request?.kommentar || <i>Keiner</i>}
                    </Typography>
                </div>
                <div className={classes.buttonRow}>
                    <div>
                        <Button
                            disableElevation
                            size="large"
                            className={classes.button}
                            variant="outlined"
                            color="primary"
                            onClick={this.onNo}>
                            Anfrage ablehnen
                        </Button>
                        <Button
                            disableElevation
                            className={classes.button}
                            size="large"
                            variant="contained"
                            color="primary"
                            onClick={this.onYes}>
                            Anfrage akzeptieren
                        </Button>
                    </div>
                </div>
            </PopupDialog>
        );
    }
}

export default withStyles(styles)(RespondRequestTaskDialog);