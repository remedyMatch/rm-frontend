import React, {Component} from "react";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {WithStylesPublic} from "../util/WithStylesPublic";
import {Typography} from "@material-ui/core";
import {FormButton} from "../components/FormButton";
import EditInstitutionDialog from "./Dialogs/EditInstitutionDialog";
import {RootDispatch, RootState} from "../State/Store";
import {loadEigeneInstitution} from "../State/EigeneInstitutionState";
import {connect, ConnectedProps} from "react-redux";
import {loadInstitutionTypen} from "../State/InstitutionTypenState";

interface Props extends WithStylesPublic<typeof styles>, PropsFromRedux {
}

interface State {
    editDialogOpen: boolean;
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
                    <span className={classes.right}>{this.props.eigeneInstitution?.id}</span>
                </div>
                <div className={classes.row}>
                    <span className={classes.left}>Institution-Key:</span>
                    <span className={classes.right}>{this.props.eigeneInstitution?.institutionKey}</span>
                </div>
                <div className={classes.row}>
                    <span className={classes.left}>Institution-Typ:</span>
                    <span className={classes.right}>{this.props.eigeneInstitution?.typ}</span>
                </div>
                <div className={classes.row}>
                    <span className={classes.left}>Institution-Name:</span>
                    <span className={classes.right}>{this.props.eigeneInstitution?.name}</span>
                </div>
                <div className={classes.row}>
                    <span className={classes.left}>Institution-Standort:</span>
                    <span className={classes.right}>{this.props.eigeneInstitution?.standort}</span>
                </div>
                <div className={classes.footer}>
                    <FormButton
                        onClick={this.onEditClicked}
                        size="small"
                        className={classes.button}>
                        Institution bearbeiten
                    </FormButton>
                </div>
                <EditInstitutionDialog
                    onSaved={this.onEditSaved}
                    onCancelled={this.onEditCancelled}
                    open={this.state.editDialogOpen}
                    typeOptions={this.props.institutionTypen || []}
                    institution={this.props.eigeneInstitution} />
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
        this.props.loadEigeneInstitution();
    };

    componentDidMount = async () => {
        this.props.loadEigeneInstitution();
        this.props.loadInstitutionTypen();
    };
}

const mapStateToProps = (state: RootState) => ({
    eigeneInstitution: state.eigeneInstitution.value,
    institutionTypen: state.institutionTypen.value
});

const mapDispatchToProps = (dispatch: RootDispatch) => ({
    loadEigeneInstitution: () => dispatch(loadEigeneInstitution()),
    loadInstitutionTypen: () => dispatch(loadInstitutionTypen())
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withStyles(styles)(OfferScreen));
