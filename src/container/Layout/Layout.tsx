import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {Component, default as React} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import Menu from "../Menu/Menu";
import HomeScreen from "../../screens/HomeScreen";
import {WithStylesPublic} from "../../util/WithStylesPublic";
import SearchScreen from "../../screens/SearchScreen";
import StockScreen from "../../screens/StockScreen";
import ProposeScreen from "../../screens/ProposeScreen";

interface Props extends WithStylesPublic<typeof styles> {}

interface State {}

const styles = (theme: Theme) =>
    createStyles({
        content: {
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            maxHeight: "calc(100vh - 60px)"
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
                        <Route path="/suche" component={SearchScreen}/>
                        <Route path="/biete" component={StockScreen}/>
                        <Route path="/propose" component={ProposeScreen}/>
                        <Route path="/" component={HomeScreen}/>
                        <Redirect to="/"/>
                    </Switch>
                </div>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(Layout);
