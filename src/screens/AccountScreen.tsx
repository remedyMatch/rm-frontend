import {makeStyles, Theme} from "@material-ui/core/styles";
import clsx from "clsx";
import React, {useMemo} from "react";
import {useSelector} from "react-redux";
import {NavLink, Redirect, Route, Switch, useLocation} from "react-router-dom";
import {RootState} from "../state/Store";
import AccountDetails from "./AccountScreen/AccountDetails";
import InstitutionDetails from "./AccountScreen/InstitutionDetails";
import InstitutionOverview from "./AccountScreen/InstitutionOverview";
import DemandFlowScreen from "./DemandFlowScreen";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: "flex",
        flexDirection: "row",
        marginTop: "6em"
    },
    navigation: {
        backgroundColor: "#53284f",
        borderRadius: "8px",
        minWidth: "250px",
        display: "flex",
        flexDirection: "column",
        margin: "0em 4em auto 0em",
        border: "2px solid #CCC",
        flexShrink: 0,
        "&>a:first-child": {
            borderTop: "none",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px"
        },
        "&>a:last-child": {
            borderBottomLeftRadius: "8px",
            borderBottomRightRadius: "8px"
        }
    },
    navigationButton: {
        borderRadius: "0px",
        fontSize: "16px",
        borderTop: "1px solid #CCC",
        color: "white",
        fontFamily: "Montserrat, sans-serif",
        textTransform: "none",
        textDecoration: "none",
        padding: "12px 24px",
        transition: theme.transitions.create("background-color"),
        "&:hover": {
            backgroundColor: "#42203f"
        }
    },
    navigationButtonActive: {
        fontWeight: 600,
        backgroundColor: "#42203f"
    },
    navigationButtonNested: {
        paddingLeft: "48px"
    },
    content: {
        flexGrow: 1
    }
}));

const AccountScreen: React.FC = props => {
    const classes = useStyles();

    // Loaded in Menu component
    const person = useSelector((state: RootState) => state.person.value);
    const location = useLocation();

    // Filter institutions
    const institutions = useMemo(
        () => person?.standorte
            .map(s => s.institution)
            .filter((s, i, a) => a.find(x => x.id === s.id) === s),
        [person]);

    return (
        <>
            <div className={classes.root}>

                <div className={classes.navigation}>
                    <NavLink
                        exact
                        to="/konto"
                        activeClassName={classes.navigationButtonActive}
                        className={classes.navigationButton}>
                        Mein Konto
                    </NavLink>
                    <NavLink
                        exact
                        to="/konto/institutionen"
                        activeClassName={classes.navigationButtonActive}
                        className={classes.navigationButton}>
                        Meine Institutionen
                    </NavLink>
                    {location.pathname.startsWith("/konto/institutionen") && institutions?.map(institution => (
                        <NavLink
                            to={"/konto/institutionen/" + institution.id}
                            activeClassName={classes.navigationButtonActive}
                            className={clsx(classes.navigationButton, classes.navigationButtonNested)}>
                            {institution.name}
                        </NavLink>
                    ))}
                    <NavLink
                        to="/konto/benachrichtigungen"
                        activeClassName={classes.navigationButtonActive}
                        className={classes.navigationButton}>
                        Benachrichtigungen
                    </NavLink>
                </div>

                <div className={classes.content}>
                    <Switch>
                        <Route path="/konto" exact component={AccountDetails}/>
                        <Route path="/konto/institutionen" exact component={InstitutionOverview}/>
                        <Route path="/konto/institutionen/:id" component={InstitutionDetails}/>
                        <Route path="/konto/benachrichtigungen" component={DemandFlowScreen}/>
                        <Redirect to="/konto"/>
                    </Switch>
                </div>
            </div>
        </>
    )
};

export default AccountScreen;