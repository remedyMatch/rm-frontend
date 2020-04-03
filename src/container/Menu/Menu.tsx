import {makeStyles, Theme} from "@material-ui/core/styles";
import {default as React, useEffect} from "react";
import {ExitToApp} from "@material-ui/icons";
import {NavLink, RouteComponentProps, withRouter} from "react-router-dom";
import LoginService from "../../util/LoginService";
import {RootDispatch, RootState} from "../../State/Store";
import {connect, ConnectedProps} from "react-redux";
import {loadAufgaben} from "../../State/AufgabenState";

interface Props extends RouteComponentProps, PropsFromRedux {
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: "sticky",
        top: 0,
        backgroundColor: theme.palette.primary.main,
        zIndex: theme.zIndex.appBar
    },
    header: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "row",
        height: "56px",
        padding: "0px 16px"
    },
    badge: {
        "&>span": {
            right: "8%"
        }
    },
    navlink: {
        fontWeight: 500,
        height: "100%",
        color: "white",
        fontSize: "1rem",
        textDecoration: "none",
        padding: "8px 32px",
        display: "flex",
        alignItems: "center",
        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)"
        },
        cursor: "pointer"
    },
    navlinkActive: {
        fontWeight: "bold",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderBottom: "4px solid " + theme.palette.secondary.main,
        paddingTop: "12px"
    },
    logoutIcon: {
        marginRight: "8px",
        fontSize: "1rem"
    }
}));

const Menu: React.FC<Props> = props => {
    const classes = useStyles();

    useEffect(() => {
        if (!props.aufgabenLoading) {
            props.loadAufgaben();
        }
    }, []);

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <NavLink
                    to="/"
                    exact
                    className={classes.navlink}
                    activeClassName={classes.navlinkActive}>
                    Startseite
                </NavLink>
                <NavLink
                    to="/bedarf"
                    className={classes.navlink}
                    activeClassName={classes.navlinkActive}>
                    Bedarf
                </NavLink>
                <NavLink
                    to="/angebote"
                    className={classes.navlink}
                    activeClassName={classes.navlinkActive}>
                    Angebote
                </NavLink>
                <NavLink
                    to="/aufgaben"
                    className={classes.navlink}
                    activeClassName={classes.navlinkActive}>
                    Aufgaben
                </NavLink>
                <NavLink
                    to="/institution"
                    className={classes.navlink}
                    activeClassName={classes.navlinkActive}>
                    Institution
                </NavLink>
                <a
                    className={classes.navlink}
                    onClick={async () => {
                        await LoginService.doLogout();
                        props.history.push("/");
                    }}>
                    <ExitToApp className={classes.logoutIcon}/>
                    Abmelden
                </a>
            </div>
        </div>
    );
};

const mapStateToProps = (state: RootState) => ({
    aufgaben: state.aufgaben.value,
    aufgabenLoading: state.aufgaben.loading
});

const mapDispatchToProps = (dispatch: RootDispatch) => ({
    loadAufgaben: () => dispatch(loadAufgaben())
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withRouter(Menu));