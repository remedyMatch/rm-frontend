import {WithStyles} from "@material-ui/core";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {Component, default as React} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import AccountScreen from "../../screens/AccountScreen";
import AdScreen from "../../screens/AdScreen";
import DashboardScreen from "../../screens/DashboardScreen";
import DemandFlowScreen from "../../screens/DemandFlowScreen";
import OfferFlowScreen from "../../screens/OfferFlowScreen";
import Footer from "./Footer";
import Menu from "./Menu";

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
                        <Route path="/konto" component={AccountScreen}/>
                        <Route path="/angebot" component={OfferFlowScreen}/>
                        <Route path="/bedarf" component={DemandFlowScreen}/>
                        <Route path="/inserate" component={AdScreen}/>
                        <Route path="/" exact component={DashboardScreen}/>
                        <Redirect to="/"/>
                    </Switch>
                    <Footer/>
                </div>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(Layout);