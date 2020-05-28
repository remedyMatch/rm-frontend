import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import React, {useEffect, useState} from "react";
import { useHistory } from "react-router-dom";
import logo from "../../resources/logo.svg";
import AccountMenu from "./AccountMenu";
import NotificationMenu from "./NotificationMenu";
import useTheme from "@material-ui/core/styles/useTheme";
import { IconButton, useMediaQuery } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Drawer from "@material-ui/core/Drawer";
import { DirectionsWalk, Person, PersonPinCircle } from "@material-ui/icons";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import LoginService from "../../util/LoginService";
import InstitutionLocationDialog from "./InstitutionLocationDialog";
import {loadPerson} from "../../state/person/PersonState";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../state/Store";

const useStyles = makeStyles(() => ({
  header: {
    display: "flex"
  },
  logo: {
    cursor: "pointer",
    maxWidth: "300px",
    minWidth: "220px",
    height: "59px"
  }
}));

const Menu: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const isPhoneSized = useMediaQuery(theme.breakpoints.down("xs"));
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [locationDialogVisible, setLocationDialogVisible] = useState(false);
  const handleLogout = () => {
    LoginService.doLogout();
    setDrawerVisible(false);
  };
  const handleAccountBtnClick = () => {
    history.push("/konto");
    setDrawerVisible(false);
  };
  const handleLocationBtnClick = () => {
    setLocationDialogVisible(true);
    setDrawerVisible(false);
  };

  const person = useSelector((state: RootState) => state.person.value);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadPerson());
  }, [dispatch]);

  const renderMobile = () => {
    return (
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <NotificationMenu />
        <img
          onClick={() => history.push("/")}
          title="Zum Dashboard"
          alt="RemedyMatch Logo"
          className={classes.logo}
          src={logo}
        />
        <IconButton style={{padding: "0.2rem"}} onClick={() => setDrawerVisible(true)}>
          <MenuIcon style={{ color: "#53284f", fontSize: "2rem" }} />
        </IconButton>
        <Drawer
          anchor="right"
          open={drawerVisible}
          onClose={() => setDrawerVisible(false)}
        >
          <Box padding="16px">
            <Box display="flex" justifyContent="flex-end">
              <IconButton style={{padding: "0.2rem"}} onClick={() => setDrawerVisible(false)}>
                <CloseIcon style={{ color: "#53284f", fontSize: "2rem" }} />
              </IconButton>
            </Box>
            <List>
              <ListItem button key={0} onClick={() => handleLocationBtnClick()}>
                <ListItemIcon>
                  <PersonPinCircle
                    style={{ color: "#53284f", fontSize: "2rem" }}
                  />
                </ListItemIcon>
                <ListItemText primary="Institution & Standort wählen" />
              </ListItem>

              <ListItem button key={1} onClick={handleAccountBtnClick}>
                <ListItemIcon>
                  <Person style={{ color: "#53284f", fontSize: "2rem" }} />
                </ListItemIcon>
                <ListItemText primary="Mein Konto" />
              </ListItem>

              <ListItem button key={2} onClick={handleLogout}>
                <ListItemIcon>
                  <DirectionsWalk
                    style={{ color: "#53284f", fontSize: "2rem" }}
                  />
                </ListItemIcon>
                <ListItemText primary="Abmelden" />
              </ListItem>
            </List>
          </Box>
        </Drawer>
        <InstitutionLocationDialog
            open={locationDialogVisible}
            onCancelled={() => setLocationDialogVisible(false)}
            onSaved={() => dispatch(loadPerson())}
            person={person}/>
      </Box>
    );
  };

  const render = () => {
    return (
      <div className={classes.header}>
        <img
          onClick={() => history.push("/")}
          title="Zum Dashboard"
          alt="RemedyMatch Logo"
          className={classes.logo}
          src={logo}
        />
        <NotificationMenu />
        <AccountMenu />
      </div>
    );
  };

  return <>{isPhoneSized ? renderMobile() : render()}</>;
};

export default Menu;
