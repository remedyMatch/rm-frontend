import React, {Component} from "react";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {WithStylesPublic} from "../util/WithStylesPublic";
import {Typography} from "@material-ui/core";
import EditInstitutionDialog from "./Dialogs/Institution/EditInstitutionDialog";
import {RootDispatch, RootState} from "../State/Store";
import {loadEigeneInstitution} from "../State/EigeneInstitutionState";
import {connect, ConnectedProps} from "react-redux";
import {loadInstitutionTypen} from "../State/InstitutionTypenState";
import {FormButton} from "../components/Form/FormButton";
import clsx from "clsx";
import EditLocationDialog from "./Dialogs/Institution/EditLocationDialog";
import AddLocationDialog from "./Dialogs/Institution/AddLocationDialog";
import DeleteLocationDialog from "./Dialogs/Institution/DeleteLocationDialog";

interface Props extends WithStylesPublic<typeof styles>, PropsFromRedux {
}

interface State {
    editDialogOpen: boolean;
    editLocationDialogOpen: boolean;
    addLocationDialogOpen: boolean;
    deleteLocationId?: string;
}

const styles = (theme: Theme) =>
    createStyles({
        content: {
            width: "calc(100vw - 32px)",
            maxWidth: "500px",
            placeSelf: "center",
            display: "flex",
            flexDirection: "column"
        },
        container: {
            margin: "8px 0px",
            backgroundColor: "white",
            border: "1px solid #CCC",
            padding: "16px",
            borderRadius: "4px",
            textAlign: "center"
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
            width: "100px",
            textAlign: "right",
            padding: "4px 16px"
        },
        right: {
            width: "calc(100% - 100px)",
            fontWeight: 500,
            padding: "4px 16px",
            textAlign: "left"
        },
        footer: {
            textAlign: "right",
            marginTop: "16px"
        },
        missing: {
            fontWeight: 500,
            marginTop: "16px"
        },
        missingError: {
            color: "red"
        },
        additionalAddress: {
            margin: "16px 0px"
        },
        address: {
            "& > p": {
                margin: "0px"
            }
        }
    });

class InstitutionScreen extends Component<Props, State> {
    state: State = {
        editDialogOpen: false,
        addLocationDialogOpen: false,
        editLocationDialogOpen: false,
        deleteLocationId: undefined
    };

    render() {
        const classes = this.props.classes!;

        const standort = this.props.eigeneInstitution?.hauptstandort;
        const standorte = this.props.eigeneInstitution?.standorte;

        return (
            <div className={classes.content}>
                <div className={classes.container}>
                    <Typography
                        variant="subtitle1"
                        className={classes.subtitle}>
                        Mein Konto
                    </Typography>
                    <div className={classes.row}>
                        <span className={classes.left}>Typ:</span>
                        <span className={classes.right}>{this.props.eigeneInstitution?.typ || <span className={clsx(classes.missingError, classes.missing)}>Nicht angegeben!</span>}</span>
                    </div>
                    <div className={classes.row}>
                        <span className={classes.left}>Name:</span>
                        <span className={classes.right}>{this.props.eigeneInstitution?.name || <span className={clsx(classes.missingError, classes.missing)}>Nicht angegeben!</span>}</span>
                    </div>
                    <div className={classes.footer}>
                        <FormButton
                            onClick={this.onEditClicked}
                            variant="text">
                            Bearbeiten
                        </FormButton>
                    </div>
                </div>
                <div className={classes.container}>
                    <Typography
                        variant="subtitle1"
                        className={classes.subtitle}>
                        Hauptstandort
                    </Typography>
                    {standort && (
                        <div className={classes.address}>
                            <p>{standort.name}</p>
                            <p>{standort.strasse}</p>
                            <p>{standort.plz} {standort.ort}</p>
                            <p>{standort.land}</p>
                        </div>
                    )}
                    {!standort && (
                        <span className={clsx(classes.missingError, classes.missing)}>Noch nicht eingetragen!<br/>Bitte auf Bearbeiten klicken.</span>
                    )}
                    <div className={classes.footer}>
                        <FormButton
                            onClick={this.onEditLocationClicked}
                            variant="text">
                            Bearbeiten
                        </FormButton>
                    </div>
                </div>
                <div className={classes.container}>
                    <Typography
                        variant="subtitle1"
                        className={classes.subtitle}>
                        Weitere Standorte
                    </Typography>
                    {standorte?.map(standort => (
                        <div className={clsx(classes.address, classes.additionalAddress)} key={standort.id}>
                            <p>{standort.name}</p>
                            <p>{standort.strasse}</p>
                            <p>{standort.plz} {standort.ort}</p>
                            <p>{standort.land}</p>
                            <FormButton
                                onClick={() => this.onDeleteLocationClicked(standort.id)}
                                variant="text">
                                Standort löschen
                            </FormButton>
                        </div>
                    ))}
                    {(!standorte || standorte.length === 0) && (
                        <span className={classes.missing}>Keine weiteren Standorte vorhanden.<br />Bitte bei Bedarf auf Hinzufügen klicken.</span>
                    )}
                    <div className={classes.footer}>
                        <FormButton
                            onClick={this.onAddLocationClicked}
                            variant="text">
                            Hinzufügen
                        </FormButton>
                    </div>
                </div>
                <EditInstitutionDialog
                    onSaved={this.onEditSaved}
                    onCancelled={this.onEditCancelled}
                    open={this.state.editDialogOpen}
                    typeOptions={this.props.institutionTypen || []}
                    institution={this.props.eigeneInstitution}/>
                <EditLocationDialog
                    onSaved={this.onEditLocationSaved}
                    onCancelled={this.onEditLocationCancelled}
                    open={this.state.editLocationDialogOpen}
                    institution={this.props.eigeneInstitution}/>
                <AddLocationDialog
                    onSaved={this.onAddLocationSaved}
                    onCancelled={this.onAddLocationCancelled}
                    open={this.state.addLocationDialogOpen}
                    institution={this.props.eigeneInstitution}/>
                <DeleteLocationDialog
                    onDeleted={this.onDeleteLocationDeleted}
                    onCancelled={this.onDeleteLocationCancelled}
                    open={!!this.state.deleteLocationId}
                    locationId={this.state.deleteLocationId}/>
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

    private onEditLocationClicked = () => {
        this.setState({editLocationDialogOpen: true});
    };

    private onEditLocationCancelled = () => {
        this.setState({editLocationDialogOpen: false});
    };

    private onEditLocationSaved = () => {
        this.setState({editLocationDialogOpen: false});
        this.props.loadEigeneInstitution();
    };

    private onAddLocationClicked = () => {
        this.setState({addLocationDialogOpen: true});
    };

    private onAddLocationCancelled = () => {
        this.setState({addLocationDialogOpen: false});
    };

    private onAddLocationSaved = () => {
        this.setState({addLocationDialogOpen: false});
        this.props.loadEigeneInstitution();
    };

    private onDeleteLocationClicked = (id: string) => {
        this.setState({deleteLocationId: id});
    };

    private onDeleteLocationCancelled = () => {
        this.setState({deleteLocationId: undefined});
    };

    private onDeleteLocationDeleted = () => {
        this.setState({deleteLocationId: undefined});
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

export default connector(withStyles(styles)(InstitutionScreen));
