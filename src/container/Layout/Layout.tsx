import {WithStyles} from "@material-ui/core";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {Component, default as React} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import Footer from "../../components/Layout/Footer";
import OfferFlowScreen from "../../screens/OfferFlowScreen";
import SearchScreen from "../../screens/old/DemandScreen";
import DashboardScreen from "../../screens/DashboardScreen";
import InstitutionScreen from "../../screens/old/InstitutionScreen";
import OfferScreen from "../../screens/old/OfferScreen";
import Menu from "./Menu";
import MapScreen from "../../screens/Map/MapScreen";

interface Props extends WithStyles<typeof styles> {
}

interface State {
}

const styles = (theme: Theme) =>
    createStyles({
        content: {
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
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
        const classes = this.props.classes;

        return (
            <React.Fragment>
                <div className={classes.content}>
                    <Menu/>
                    <Switch>
                        <Route path="/bedarf" component={SearchScreen}/>
                        <Route path="/angebote" component={OfferScreen}/>
                        <Route path="/konto" component={InstitutionScreen}/>
                        <Route path="/angebot" component={OfferFlowScreen} />
                        <Route path="/" exact component={DashboardScreen}/>
                        <Route path="/map" component={MapScreen}/>
                        <Redirect to="/"/>
                    </Switch>
                    <Footer/>
                </div>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(Layout);