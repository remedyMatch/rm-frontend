import {CssBaseline} from "@material-ui/core";
import {createStyles, Theme, ThemeProvider, withStyles} from "@material-ui/core/styles";
import {default as React, PureComponent} from "react";
import {RouteComponentProps, withRouter} from "react-router-dom";
import Themes from "../../theme";
import {WithStylesPublic} from "../../util/WithStylesPublic";
import Layout from "../Layout/Layout";

interface Props extends RouteComponentProps, WithStylesPublic<typeof styles> {
}

interface State {
    // lastTokenRefresh: number;
}

// let timeout: any;

const styles = (theme: Theme) =>
    createStyles({
        root: {
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column"
        }
    });

class App extends PureComponent<Props, State> {
    state: State = {
        // lastTokenRefresh: 0
    };

    render() {
        const classes = this.props.classes!;

        return (
            <ThemeProvider theme={Themes.light}>
                <div className={classes.root}>
                    <CssBaseline/>
                    <Layout />
                </div>
            </ThemeProvider>
        );
    }

    componentDidMount(): void {
        // this.setTokenRefreshTimeout();
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        // this.setTokenRefreshTimeout();
    }

    private setTokenRefreshTimeout = () => {
        /*if (timeout) {
            clearTimeout(timeout);
        }

        if (!this.props.tokenDetails?.loggedIn) {
            timeout = setTimeout(this.setTokenRefreshTimeout, 5000);
        } else {
            timeout = setTimeout(this.refreshToken, Math.max(1000, this.props.tokenDetails!.accessTokenExpiresAt! - new Date().getTime() - 30000));
        }*/
    };

    private refreshToken = async () => {
        /*if (this.props.tokenDetails?.loggedIn && this.props.tokenDetails!.refreshTokenExpiresAt! < new Date().getTime()) {
            const path = this.props.location.pathname + this.props.location.search + this.props.location.hash;
            this.props.history.push("/login?redirect=" + encodeURIComponent(path));
        } else {
            await apiGet("/refresh");
            this.props.loadTokenInfo();
            this.setTokenRefreshTimeout();
        }*/
    };
}

export default withRouter(withStyles(styles)(App));
