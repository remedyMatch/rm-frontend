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
    demandId?: string;
    institutionName?: string;
}

interface State {
    comment: string;
    location: string;
    disabled: boolean;
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

class RespondDemandDialog extends PureComponent<Props, State> {
    state: State = {
        comment: "",
        location: "",
        disabled: false
    };

    private onSave = async () => {
        if(!this.props.demandId) {
            this.setState({
                error: "Bedarf nicht gesetzt!"
            });
            return;
        }

        this.setState({
            disabled: true,
            error: undefined
        });

        const result = await apiPost("/remedy/bedarf/bedienen", {
            bedarfId: this.props.demandId,
            kommentar: this.state.comment,
            standort: this.state.location
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
                <DialogTitle>{this.props.institutionName} kontaktieren</DialogTitle>
                <DialogContent>
                    <div className={classes.content}>
                        <ErrorToast error={this.state.error} onClose={this.onCloseError}/>
                        <FormTextInput
                            label="Standort des Artikels"
                            changeListener={this.setLocation}
                            value={this.state.location}
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

export default withStyles(styles)(RespondDemandDialog);