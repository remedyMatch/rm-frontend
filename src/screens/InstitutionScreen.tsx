import React, {Component} from "react";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {WithStylesPublic} from "../util/WithStylesPublic";
import {apiGet} from "../util/ApiUtils";
import {Institution} from "../Model/Institution";
import {Typography} from "@material-ui/core";
import {FormButton} from "../components/FormButton";

interface Props extends WithStylesPublic<typeof styles> {
}

interface State {
    editDialogOpen: boolean;
    institution?: Institution;
}

const styles = (theme: Theme) =>
    createStyles({
        content: {
            width: "600px",
            placeSelf: "center",
            backgroundColor: "white",
            border: "1px solid #CCC",
            borderRadius: "4px",
            padding: "16px",
            marginTop: "32px"
        },
        subtitle: {
            fontWeight: 500,
            marginBottom: "16px",
            textAlign: "center"
        },
        row: {
            display: "flex"
        },
        left: {
            width: "35%",
            textAlign: "right",
            padding: "4px 16px"
        },
        right: {
            width: "65%",
            fontWeight: 500,
            padding: "4px 16px"
        },
        button: {
            marginTop: "32px"
        },
        footer: {
            display: "flex",
            justifyContent: "center"
        }
    });

class OfferScreen extends Component<Props, State> {
    state: State = {
        editDialogOpen: false
    };

    render() {
        const classes = this.props.classes!;

        return (
            <div className={classes.content}>
                <Typography variant="subtitle1" className={classes.subtitle}>Meine Institution</Typography>
                <div className={classes.row}>
                    <span className={classes.left}>Institution-ID:</span>
                    <span className={classes.right}>{this.state.institution?.id}</span>
                </div>
                <div className={classes.row}>
                    <span className={classes.left}>Institution-Key:</span>
                    <span className={classes.right}>{this.state.institution?.institutionKey}</span>
                </div>
                <div className={classes.row}>
                    <span className={classes.left}>Institution-Name:</span>
                    <span className={classes.right}>{this.state.institution?.name}</span>
                </div>
                <div className={classes.row}>
                    <span className={classes.left}>Institution-Typ:</span>
                    <span className={classes.right}>{this.state.institution?.typ}</span>
                </div>
                <div className={classes.footer}>
                    <FormButton
                        onClick={this.onEditClicked}
                        size="small"
                        className={classes.button}>
                        Institution bearbeiten
                    </FormButton>
                </div>
            </div>
        )
    }

    private onEditClicked = () => {
        this.setState({editDialogOpen: true});
    };

    private onEditCancelled = () => {
        this.setState({editDialogOpen: false});
    };

    private onEditSaved = () => {
        this.setState({editDialogOpen: false});
        this.loadInstitution();
    };

    componentDidMount = async () => {
        this.loadInstitution();
    };

    private loadInstitution = async () => {
        const result = await apiGet<Institution>("/remedy/institution/assigned");
        if (!result.error) {
            this.setState({
                institution: result.result
            });
        }
    };
}

export default withStyles(styles)(OfferScreen);
