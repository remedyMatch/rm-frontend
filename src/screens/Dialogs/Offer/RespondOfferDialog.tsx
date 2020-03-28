import React, {ChangeEvent, PureComponent} from "react";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextareaAutosize} from "@material-ui/core";
import {WithStylesPublic} from "../../../util/WithStylesPublic";
import ErrorToast from "../../../components/ErrorToast";
import {apiPost} from "../../../util/ApiUtils";
import {FormTextInput} from "../../../components/FormTextInput";

interface Props extends WithStylesPublic<typeof styles> {
    open: boolean;
    onCancelled: () => void;
    onSaved: () => void;
    offerId?: string;
}

interface State {
    comment: string;
    location: string;
    disabled: boolean;
    amount: number;
    error?: string;
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

class RespondOfferDialog extends PureComponent<Props, State> {
    state: State = {
        comment: "",
        location: "",
        amount: 0,
        disabled: false
    };

    private onSave = async () => {
        if(!this.props.offerId) {
            this.setState({
                error: "Angebot nicht gesetzt!"
            });
            return;
        }

        this.setState({
            disabled: true,
            error: undefined
        });

        const result = await apiPost("/remedy/angebot/anfragen", {
            angebotId: this.props.offerId,
            kommentar: this.state.comment,
            standort: this.state.location,
            anzahl: this.state.amount
        });

        if (result.error) {
            this.setState({
                disabled: false,
                error: "Absenden der Anfrage fehlgeschlagen: " + result.error
            });
            return;
        }

        this.setState({
            comment: "",
            disabled: false
        });

        this.props.onSaved();
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
            <Dialog
                maxWidth="lg"
                open={this.props.open}
                onClose={this.onCancel}>
                <DialogTitle>{this.state.location} kontaktieren</DialogTitle>
                <DialogContent>
                    <div className={classes.content}>
                        <ErrorToast error={this.state.error} onClose={this.onCloseError}/>
                        <FormTextInput
                            label="Eigener Standort"
                            changeListener={this.setLocation}
                            value={this.state.location}
                            disabled={this.state.disabled} />
                        <FormTextInput
                            label="Anzahl"
                            type="number"
                            min={1}
                            changeListener={(value: string) =>  this.setState({amount: +value})}
                            value={""+this.state.amount}
                            disabled={this.state.disabled} />
                        <TextareaAutosize
                            rowsMin={3}
                            rowsMax={8}
                            placeholder="Kommentar"
                            value={this.state.comment}
                            disabled={this.state.disabled}
                            className={classes.comment}
                            onChange={this.setComment}/>
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
    };
}

export default withStyles(styles)(RespondOfferDialog);