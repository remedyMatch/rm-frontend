import React, {PureComponent} from "react";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {WithStylesPublic} from "../../../../util/WithStylesPublic";
import {Aufgabe} from "../../../../domain/old/Aufgabe";
import {Button, Typography} from "@material-ui/core";
import {apiPost} from "../../../../util/ApiUtils";
import {handleDialogButton} from "../../../../util/DialogUtils";
import {defined, validate} from "../../../../util/ValidationUtils";
import PopupDialog from "../../../../components/Dialog/PopupDialog";
import {LocalOffer, LocationOn, Search} from "@material-ui/icons";
import {Match} from "../../../../domain/old/Match";
import {Artikel} from "../../../../domain/old/Artikel";

interface Props extends WithStylesPublic<typeof styles> {
    onCancelled: () => void;
    onFinished: () => void;
    task?: Aufgabe;
    match?: Match;
    article?: Artikel;
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

    render() {
        const classes = this.props.classes!;

        const article = this.props.article;
        const match = this.props.match;
        const requestor = match?.institutionVon;
        const location = match?.standortVon;
        const isOffer = match?.anfrageTyp === "Angebot";

        return (
            <PopupDialog
                open
                width="md"
                error={this.state.error}
                title="Wareneingang bestätigen"
                disabled={this.state.disabled}
                firstTitle="Abbrechen"
                onFirst={this.onCancel}
                onCloseError={this.onCloseError}>
                <Typography variant="body1" className={classes.description}>
                    Bitte bestätige, dass die versendete Ware bei dir eingetroffen ist:
                </Typography>
                <div className={classes.iconContainer}>
                    <LocationOn/>
                    <Typography variant="body1" className={classes.text}>
                        <b>Versendende Organisation:</b> <br/>
                        {requestor?.name} <br/>
                        {location?.strasse} <br/>
                        {location?.plz} {location?.ort} <br/>
                        {location?.land} <br/>
                        <i>ca. {match?.entfernung.toFixed()} km entfernt</i>
                    </Typography>
                </div>
                <div className={classes.iconContainer}>
                    {isOffer ? <LocalOffer/> : <Search/>}
                    <Typography variant="body1" className={classes.text}>
                        <b>{isOffer ? "Angebot" : "Bedarf"}:</b> <br/>
                        {
                            // TODO
                        }
                        {/* <i>{article?.hersteller}</i> <br/> */ }
                        {article?.name} <br/>
                        {match?.anzahl} Stück
                    </Typography>
                </div>
                <div className={classes.buttonRow}>
                    <Button
                        disableElevation
                        className={classes.button}
                        size="large"
                        variant="contained"
                        color="primary"
                        onClick={this.onSave}>
                        Wareneingang bestätigen
                    </Button>
                </div>
            </PopupDialog>
        );
    }
}

export default withStyles(styles)(RespondRequestTaskDialog);