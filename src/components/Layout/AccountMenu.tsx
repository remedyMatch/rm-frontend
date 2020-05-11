import {Backdrop, Button, ClickAwayListener, Grow, Paper, Popper, Theme, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {ArrowDropDown, DirectionsWalk, LocationCity, Person, PersonPinCircle} from "@material-ui/icons";
import clsx from "clsx";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {loadPerson} from "../../state/person/PersonState";
import {RootDispatch, RootState} from "../../state/Store";
import LoginService from "../../util/LoginService";
import InstitutionLocationDialog from "./InstitutionLocationDialog";

const useStyles = makeStyles((theme: Theme) => ({
    backdrop: {
        zIndex: 1001,
        backgroundColor: "rgba(0,0,0,0.25)",
        backdropFilter: "blur(3px)"
    },
    accountMenu: {
        backgroundColor: "white",
        minWidth: "320px",
        minHeight: "51px",
        cursor: "pointer",
        border: "2px solid #CCC",
        borderRadius: "8px",
        padding: "4px 8px",
        marginLeft: "24px",
        display: "inline-table", // Required to prevent fractional pixel widths which destroys the clean look of the popup
        transition: theme.transitions.create("background-color, border-radius"),
        "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)"
        }
    },
    accountMenuButton: {
        display: "flex",
        alignItems: "center"
    },
    accountMenuActive: {
        borderBottomLeftRadius: "0px",
        borderBottomRightRadius: "0px",
        borderBottom: "none",
        zIndex: 1002,
        "&:hover": {
            backgroundColor: "white"
        }
    },
    accountMenuIcon: {
        color: "#53284f",
        height: "1.5em",
        width: "1.5em"
    },
    accountMenuText: {
        marginLeft: "12px",
        marginRight: "12px",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1
    },
    accountMenuInstitution: {
        fontFamily: "Montserrat, sans-serif",
        fontWeight: 600,
        fontSize: "14px"
    },
    accountMenuLocation: {
        fontFamily: "Montserrat, sans-serif",
        fontSize: "12px"
    },
    accountMenuDropdown: {
        color: "#53284f",
        transition: theme.transitions.create("transform")
    },
    accountMenuDropdownActive: {
        transform: "rotate(180deg)"
    },
    accountMenuPopup: {
        borderRadius: "0px 0px 8px 8px",
        border: "2px solid #CCC",
        borderTop: "none",
        top: "-1px !important"
    },
    accountMenuPopupContainer: {
        zIndex: 1001
    },
    accountMenuContainer: {
        paddingTop: "18px"
    },
    accountMenuAction: {
        fontFamily: "Montserrat, sans-serif",
        fontWeight: 600,
        fontSize: "14px",
        textTransform: "none",
        width: "100%",
        color: "rgba(0, 0, 0, 0.87)",
        whiteSpace: "nowrap",
        padding: "8px",
        justifyContent: "left",
        borderRadius: "0px",
        textAlign: "left"
    },
    accountMenuActionIcon: {
        color: "#53284f",
        height: "1.3em",
        width: "1.5em",
        justifyContent: "center",
        margin: "0px 8px"
    }
}));

const AccountMenu: React.FC = () => {
    const classes = useStyles();

    const menuRef = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(false);
    const [locationMenuOpen, setLocationMenuOpen] = useState(false);

    const history = useHistory();

    const person = useSelector((state: RootState) => state.person.value);
    const dispatch: RootDispatch = useDispatch();

    const openMenu = useCallback(() => setOpen(true), []);
    const closeMenu = useCallback(() => setOpen(false), []);

    const onChooseButtonClicked = useCallback(() => {
        setOpen(false);
        setLocationMenuOpen(true);
    }, []);
    const onAccountButtonClicked = useCallback(() => {
        history.push("/konto");
        setOpen(false);
    }, [history]);
    const onLogoutButtonClicked = useCallback(() => {
        LoginService.doLogout();
        setOpen(false);
    }, []);
    const onLocationMenuCancelled = useCallback(() => {
        setLocationMenuOpen(false);
    }, []);
    const onLocationMenuSaved = useCallback(() => {
        dispatch(loadPerson());
    }, [dispatch]);

    useEffect(() => {
        dispatch(loadPerson());
    }, [dispatch]);

    const curInst = person?.aktuellerStandort;

    return (
        <>

            <div
                onClick={openMenu}
                className={clsx(classes.accountMenu, open && classes.accountMenuActive)}
                ref={menuRef}>

                <div className={classes.accountMenuButton}>

                    <LocationCity className={classes.accountMenuIcon}/>

                    <div className={classes.accountMenuText}>
                        <Typography className={classes.accountMenuInstitution}>
                            {curInst?.institution.name}
                        </Typography>
                        <Typography className={classes.accountMenuLocation}>
                            {curInst?.standort.strasse} {curInst?.standort.hausnummer}, {curInst?.standort.plz} {curInst?.standort.ort}
                        </Typography>
                    </div>

                    <ArrowDropDown
                        className={clsx(classes.accountMenuDropdown, open && classes.accountMenuDropdownActive)}/>

                </div>
            </div>

            <Backdrop
                open={open || locationMenuOpen}
                className={classes.backdrop}/>

            <InstitutionLocationDialog
                open={locationMenuOpen}
                onCancelled={onLocationMenuCancelled}
                onSaved={onLocationMenuSaved}
                person={person}/>

            <Popper
                style={{width: menuRef.current?.offsetWidth}}
                open={open}
                anchorEl={menuRef.current}
                className={classes.accountMenuPopupContainer}
                transition
                disablePortal>
                {({TransitionProps}) => (
                    <Grow {...TransitionProps}
                          style={{transformOrigin: 'top'}}>
                        <Paper className={classes.accountMenuPopup}>
                            <ClickAwayListener onClickAway={closeMenu}>
                                <div className={classes.accountMenuContainer}>

                                    <Button
                                        onClick={onChooseButtonClicked}
                                        startIcon={<PersonPinCircle className={classes.accountMenuActionIcon}/>}
                                        variant="text"
                                        className={classes.accountMenuAction}>
                                        Institution & Standort wählen
                                    </Button>

                                    <Button
                                        onClick={onAccountButtonClicked}
                                        startIcon={<Person className={classes.accountMenuActionIcon}/>}
                                        variant="text"
                                        className={classes.accountMenuAction}>
                                        Mein Konto
                                    </Button>

                                    <Button
                                        onClick={onLogoutButtonClicked}
                                        startIcon={<DirectionsWalk className={classes.accountMenuActionIcon}/>}
                                        variant="text"
                                        className={classes.accountMenuAction}>
                                        Abmelden
                                    </Button>

                                </div>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>

        </>
    )
};

export default AccountMenu;