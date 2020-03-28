import React, {Component} from "react";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";
import {Anfrage} from "../../Model/Anfrage";
import {WithStylesPublic} from "../../util/WithStylesPublic";
import {apiDelete} from "../../util/ApiUtils";
import ErrorToast from "../../components/ErrorToast";

interface Props extends WithStylesPublic<typeof styles> {
    open: boolean;
    onNo: () => void;
    onYes: () => void;
    request?: Anfrage;
}

interface State {
    disabled: boolean;
    error?: string;
}

const styles = (theme: Theme) => createStyles({
    content: {
        width: "40vw",
        paddingBottom: "16px",
        display: "flex",
        flexDirection: "column"
    }
});

class CancelReceivedOfferDialog extends Component<Props, State> {
    state: State = {
        disabled: false
    };

    render() {
        const classes = this.props.classes!;
        return (
            <Dialog
                maxWidth="md"
                open={this.props.open}
                disableBackdropClick>
                <DialogTitle>Anfrage stornieren?</DialogTitle>
                <DialogContent>
                    <div className={classes.content}>
                        <DialogContentText>
                            Soll die Anfrage an {this.props.request?.institutionAn.name} wirklich storniert werden?
                        </DialogContentText>
                        <ErrorToast error={this.state.error} onClose={this.onCloseError}/>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button disabled={this.state.disabled} onClick={this.onNo} color="secondary">
                        Abbrechen
                    </Button>
                    <Button disabled={this.state.disabled} onClick={this.onYes} color="secondary">
                        Stornieren
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    private onNo = () => {
        this.props.onNo();
    };

    private onYes = async () => {
        if (!this.props.request) {
            this.setState({
                error: "Anfrage nicht gesetzt!"
            });
            return;
        }
        this.setState({disabled: true});
        const result = await apiDelete("/remedy/anfrage/" + this.props.request!.id);
        if (result.error) {
            this.setState({
                disabled: false,
                error: result.error
            });
        } else {
            this.setState({
                disabled: false
            });
            this.props.onYes();
        }
    };

    private onCloseError = () => {
        this.setState({error: undefined});
    };
}

export default withStyles(styles)(CancelReceivedOfferDialog);