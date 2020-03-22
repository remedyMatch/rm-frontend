import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {Component, default as React} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import Menu from "../Menu/Menu";
import HomeScreen from "../../screens/HomeScreen";
import {WithStylesPublic} from "../../util/WithStylesPublic";
import SearchScreen from "../../screens/DemandScreen";
import OfferScreen from "../../screens/OfferScreen";
import InstitutionScreen from "../../screens/InstitutionScreen";

interface Props extends WithStylesPublic<typeof styles> {}

interface State {}

const styles = (theme: Theme) =>
    createStyles({
        content: {
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            maxHeight: "calc(100vh - 60px)",
            width: "60vw",
            minWidth: "600px",
            padding: "16px",
            alignSelf: "center"
        }
    });

class Layout extends Component<Props, State> {
    render() {
        const classes = this.props.classes!;
        return (
            <React.Fragment>
                <Menu />
                <div className={classes.content}>
                    <Switch>
                        <Route path="/bedarf" component={SearchScreen}/>
                        <Route path="/angebote" component={OfferScreen}/>
                        <Route path="/institution" component={InstitutionScreen}/>
                        <Route path="/" exact component={HomeScreen}/>
                        <Redirect to="/"/>
                    </Switch>
                </div>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(Layout);
