import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {Component, default as React} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import Menu from "../Menu/Menu";
import HomeScreen from "../../screens/HomeScreen";
import {WithStylesPublic} from "../../util/WithStylesPublic";
import SearchScreen from "../../screens/DemandScreen";
import OfferScreen from "../../screens/OfferScreen";
import InstitutionScreen from "../../screens/InstitutionScreen";
import TaskScreen from "../../screens/TaskScreen";
import {RootDispatch, RootState} from "../../State/Store";
import {loadEigeneInstitution} from "../../State/EigeneInstitutionState";
import {connect, ConnectedProps} from "react-redux";
import {Backdrop, CircularProgress, DialogContentText, Typography} from "@material-ui/core";
import PopupDialog from "../../components/Dialog/PopupDialog";

interface Props extends WithStylesPublic<typeof styles>, PropsFromRedux {
}

interface State {
}

const styles = (theme: Theme) =>
    createStyles({
        content: {
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: "calc(100vh - 60px)",
            width: "100vw",
            minWidth: "600px",
            maxWidth: "1200px",
            padding: "16px",
            alignSelf: "center"
        },
        setupWarning: {
            width: "calc(100vw - 32px)",
            maxWidth: "500px",
            placeSelf: "center",
            display: "flex",
            flexDirection: "column",
            margin: "8px 0px",
            backgroundColor: "white",
            border: "1px solid #CCC",
            padding: "16px",
            borderRadius: "4px",
            textAlign: "center"
        },
        setupWarningHeading: {
            fontWeight: 500,
            marginBottom: "16px"
        }
    });

class Layout extends Component<Props, State> {
    render() {
        const classes = this.props.classes!;
        const inst = this.props.eigeneInstitution;

        if (!inst) {
            if(this.props.eigeneInstitutionError && !this.props.eigeneInstitutionLoading) {
                return (
                    <PopupDialog
                        open
                        error={this.props.eigeneInstitutionError}
                        title="Fehler beim Laden"
                        firstTitle="Neu laden"
                        onFirst={this.props.loadEigeneInstitution}>
                        <DialogContentText>
                            Es ist ein Fehler beim Laden aufgetreten. Klicke unten auf neu laden, um es erneut zu versuchen.
                        </DialogContentText>
                    </PopupDialog>
                );
            }

            return (
                <Backdrop
                    open
                    timeout={500}>
                    <CircularProgress
                        variant="indeterminate"/>
                </Backdrop>
            );
        }

        if (!inst.typ || !inst.name || !inst.hauptstandort) {
            return (
                <div className={classes.content}>
                    <div className={classes.setupWarning}>
                        <Typography variant="subtitle1" className={classes.setupWarningHeading}>Willkommen bei RemedyMatch!</Typography>
                        <Typography variant="body1">Bevor du deinen Account verwenden kannst, benötigen wir noch einige
                            Informationen über deine Organisation. Bitte trage alle relevanten Daten unten
                            ein. Du kannst diese Informationen auch später jederzeit anpassen.</Typography>
                    </div>
                    <Switch>
                        <Route path="/institution" component={InstitutionScreen}/>
                        <Redirect to="/institution"/>
                    </Switch>
                </div>
            );
        }

        return (
            <React.Fragment>
                <Menu/>
                <div className={classes.content}>
                    <Switch>
                        <Route path="/bedarf" component={SearchScreen}/>
                        <Route path="/angebote" component={OfferScreen}/>
                        <Route path="/aufgaben" component={TaskScreen}/>
                        <Route path="/institution" component={InstitutionScreen}/>
                        <Route path="/" exact component={HomeScreen}/>
                        <Redirect to="/"/>
                    </Switch>
                </div>
            </React.Fragment>
        );
    }

    componentDidMount(): void {
        this.props.loadEigeneInstitution();
    }
}

const mapStateToProps = (state: RootState) => ({
    eigeneInstitution: state.eigeneInstitution.value,
    eigeneInstitutionLoading: state.eigeneInstitution.loading,
    eigeneInstitutionError: state.eigeneInstitution.error
});

const mapDispatchToProps = (dispatch: RootDispatch) => ({
    loadEigeneInstitution: () => dispatch(loadEigeneInstitution())
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withStyles(styles)(Layout));
