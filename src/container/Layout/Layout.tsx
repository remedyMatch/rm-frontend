import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {Component, default as React} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import SearchScreen from "../../screens/DemandScreen";
import HomeScreen from "../../screens/HomeScreen";
import InstitutionScreen from "../../screens/InstitutionScreen";
import OfferScreen from "../../screens/OfferScreen";
import {WithStylesPublic} from "../../util/WithStylesPublic";

interface Props extends WithStylesPublic<typeof styles> {
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

        return (
            <React.Fragment>
                <div className={classes.content}>
                    <Switch>
                        <Route path="/bedarf" component={SearchScreen}/>
                        <Route path="/angebote" component={OfferScreen}/>
                        <Route path="/konto" component={InstitutionScreen}/>
                        <Route path="/" exact component={HomeScreen}/>
                        <Redirect to="/"/>
                    </Switch>
                </div>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(Layout);