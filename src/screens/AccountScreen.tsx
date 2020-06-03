import { makeStyles, Theme } from "@material-ui/core/styles";
import { LocationCity, Person } from "@material-ui/icons";
import React from "react";
import { useSelector } from "react-redux";
import {
  NavLink,
  Redirect,
  Route,
  Switch,
  useLocation
} from "react-router-dom";
import { RootState } from "../state/Store";
import AccountDetails from "./AccountScreen/AccountDetails";
import InstitutionDetails from "./AccountScreen/InstitutionDetails";
import InstitutionOverview from "./AccountScreen/InstitutionOverview";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: "3rem",
  },
  navigation: {
    backgroundColor: "#53284f",
    borderRadius: "8px",
    "&>a:first-child": {
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px"
    },
    "&>a:last-child": {
      borderBottomLeftRadius: "8px",
      borderBottomRightRadius: "8px"
    }
  },
  navigationButton: {
    display: "flex",
    borderRadius: "0px",
    fontSize: "14px",
    color: "white",
    fontWeight: 600,
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
    backgroundColor: "#42203f"
  },
  institutionIcon: {
    height: "0.8em",
    width: "0.8em",
    marginLeft: "16px",
    marginRight: "8px"
  }
}));

const AccountScreen: React.FC = props => {
  const classes = useStyles();

  // Loaded in Menu component
  const person = useSelector((state: RootState) => state.person.value);
  const location = useLocation();

  return (
    <Grid container spacing={1} className={classes.root}>
      <Grid item xs={12} sm={4} spacing={2}>
          <Paper className={classes.navigation}>
        <NavLink
          exact
          to="/konto"
          activeClassName={classes.navigationButtonActive}
          className={classes.navigationButton}
        >
          Mein Konto
        </NavLink>
        <NavLink
          exact
          to="/konto/institutionen"
          activeClassName={classes.navigationButtonActive}
          className={classes.navigationButton}
        >
          Meine Institutionen
        </NavLink>
        {location.pathname.startsWith("/konto/institutionen") &&
          person?.institutionen.map(institution => (
            <NavLink
              to={"/konto/institutionen/" + institution.institution.id}
              activeClassName={classes.navigationButtonActive}
              className={classes.navigationButton}
            >
              {institution.institution.typ === "PRIVAT" ? (
                <Person className={classes.institutionIcon} />
              ) : (
                <LocationCity className={classes.institutionIcon} />
              )}
              {institution.institution.name}
            </NavLink>
          ))}
          </Paper>
      </Grid>

      <Grid item xs={12} sm={8}>
        <Switch>
          <Route path="/konto" exact component={AccountDetails} />
          <Route
            path="/konto/institutionen"
            exact
            component={InstitutionOverview}
          />
          <Route
            path="/konto/institutionen/:id"
            component={InstitutionDetails}
          />
          <Redirect to="/konto" />
        </Switch>
      </Grid>
    </Grid>
  );
};

export default AccountScreen;
