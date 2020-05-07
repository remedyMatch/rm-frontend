import {
    Backdrop,
    Badge,
    Button,
    ClickAwayListener,
    Grow,
    IconButton,
    Paper,
    Popper,
    Tooltip,
    Typography, WithStyles
} from "@material-ui/core";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {ArrowDropDown, Close, Drafts, LocationCity, Notifications} from "@material-ui/icons";
import clsx from "clsx";
import {format} from "date-fns";
import {de} from "date-fns/locale";
import React, {Component} from "react";
import {connect, ConnectedProps} from "react-redux";
import logo from "../../resources/logo.svg";
import {loadBenachrichtigungen} from "../../state/benachrichtigung/BenachrichtigungenState";
import {loadPerson} from "../../state/person/PersonState";
import {RootDispatch, RootState} from "../../state/Store";
import {apiDelete, apiPut} from "../../util/ApiUtils";
import {RouteComponentProps, withRouter} from "react-router-dom";

interface Props extends WithStyles<typeof styles>, PropsFromRedux, RouteComponentProps {
}

interface State {
    notificationsMenuOpen: boolean;
}

const styles = (theme: Theme) =>
    createStyles({
        header: {
            display: "flex"
        },
        logo: {
            cursor: "pointer",
            marginLeft: "-14px",
            width: "300px",
            height: "59px"
        },
        institution: {
            minWidth: "250px",
            cursor: "pointer",
            border: "2px solid #CCC",
            borderRadius: "8px",
            padding: "4px 8px",
            marginLeft: "24px",
            display: "flex",
            alignItems: "center",
            transition: theme.transitions.create("background-color"),
            "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)"
            }
        },
        institutionIcon: {
            color: "#53284f",
            height: "1.5em",
            width: "1.5em"
        },
        institutionText: {
            marginLeft: "12px",
            marginRight: "12px",
            display: "flex",
            flexDirection: "column"
        },
        institutionName: {
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            fontSize: "14px"
        },
        institutionLocation: {
            fontFamily: "Montserrat, sans-serif",
            fontSize: "12px"
        },
        institutionEdit: {
            color: "#53284f"
        },
        notifications: {
            marginLeft: "auto",
            backgroundColor: "white",
            borderTopLeftRadius: "50%",
            borderTopRightRadius: "50%",
            zIndex: 1002
        },
        notificationsIcon: {
            color: "#53284f"
        },
        notificationsBackdrop: {
            zIndex: 1001,
            backgroundColor: "rgba(0,0,0,0.25)",
            backdropFilter: "blur(3px)"
        },
        notificationsPopup: {
            borderRadius: "8px"
        },
        notificationsPopupContainer: {
            zIndex: 1002
        },
        notificationsContainer: {
            paddingTop: "24px",
            width: "400px"
        },
        notificationsList: {
            maxHeight: "600px",
            overflowY: "auto",
            "&>*:first-child": {
                borderTop: "0px"
            },
            "&::-webkit-scrollbar": {
                width: "12px"
            },
            "&::-webkit-scrollbar-track": {
                backgroundColor: "rgba(0,0,0,0.1)"
            },
            "&::-webkit-scrollbar-thumb": {
                backgroundColor: "darkgrey",
                borderRadius: "6px"
            }
        },
        notificationsTitle: {
            fontFamily: "Montserrat, sans-serif",
            fontSize: "18px",
            textAlign: "center",
            fontWeight: 600,
            color: "#007c92",
            paddingBottom: "24px",
            borderBottom: "1px solid #CCC"
        },
        notificationPlaceholder: {
            padding: "32px",
            fontFamily: "Montserrat, sans-serif",
            fontSize: "16px",
            fontWeight: 600,
            textAlign: "center",
            color: "rgba(0, 0, 0, 0.54)"
        },
        notificationEntry: {
            borderTop: "1px solid #CCC",
            padding: "12px 16px",
            "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)"
            }
        },
        notificationText: {
            fontFamily: "Montserrat, sans-serif",
            letterSpacing: "-0.02em",
            fontWeight: 600,
            fontSize: "16px"
        },
        notificationTextRead: {
            fontWeight: "normal"
        },
        notificationTimestamp: {
            fontFamily: "Montserrat, sans-serif",
            fontSize: "12px",
            color: "rgba(0, 0, 0, 0.54)",
            marginTop: "8px",
            textAlign: "right"
        },
        notificationButtons: {
            display: "flex",
            borderTop: "1px solid #CCC",
        },
        notificationButton: {
            height: "56px",
            width: "50%",
            fontSize: "16px",
            color: "#007c92",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "0px"
        },
        tooltip: {
            fontSize: "12px",
            backgroundColor: "rgba(0,0,0,0.87)"
        },
        tooltipArrow: {
            color: "rgba(0,0,0,0.87)"
        }
    });

class Menu extends Component<Props, State> {
    state: State = {
        notificationsMenuOpen: false
    };
    private ref = React.createRef<HTMLButtonElement>();

    render() {
        const classes = this.props.classes;
        const curInst = this.props.person?.aktuelleInstitution;

        return (
            <>

                <div className={classes.header}>

                    <img
                        onClick={this.onLogoClicked}
                        title="Zum Dashboard"
                        alt="RemedyMatch Logo"
                        className={classes.logo}
                        src={logo}/>

                    <div className={classes.notifications}>
                        <IconButton
                            ref={this.ref}
                            onClick={this.showNotificationsMenu}>
                            <Badge
                                anchorOrigin={{
                                    horizontal: "right",
                                    vertical: "bottom"
                                }}
                                overlap="circle"
                                badgeContent={this.props.benachrichtigungen?.filter(b => !b.gelesen).length || 0}
                                color="error">
                                <Notifications
                                    fontSize="large"
                                    className={classes.notificationsIcon}/>
                            </Badge>
                        </IconButton>
                    </div>

                    <div className={classes.institution}>
                        <LocationCity className={classes.institutionIcon}/>

                        <div className={classes.institutionText}>
                            <Typography className={classes.institutionName}>
                                {curInst?.institution.name}
                            </Typography>
                            <Typography className={classes.institutionLocation}>
                                {curInst?.standort.strasse} {curInst?.standort.hausnummer}, {curInst?.standort.plz} {curInst?.standort.ort}
                            </Typography>
                        </div>

                        <ArrowDropDown className={classes.institutionEdit}/>
                    </div>

                </div>

                <Backdrop
                    open={this.state.notificationsMenuOpen}
                    className={classes.notificationsBackdrop}/>

                <Popper
                    open={this.state.notificationsMenuOpen}
                    anchorEl={this.ref.current}
                    className={classes.notificationsPopupContainer}
                    transition
                    disablePortal>
                    {({TransitionProps}) => (
                        <Grow {...TransitionProps}
                              style={{transformOrigin: 'center top'}}>
                            <Paper className={classes.notificationsPopup}>
                                <ClickAwayListener onClickAway={this.hideNotificationsMenu}>
                                    <div className={classes.notificationsContainer}>

                                        <Typography className={classes.notificationsTitle}>
                                            Ihre Benachrichtigungen
                                        </Typography>

                                        <div className={classes.notificationsList}>
                                            {(this.props.benachrichtigungen || []).length === 0 && (
                                                <Typography className={classes.notificationPlaceholder}>
                                                    Es sind keine Benachrichtigungen vorhanden.
                                                </Typography>
                                            )}
                                            {this.props.benachrichtigungen?.map(value => (
                                                <div className={classes.notificationEntry}>
                                                    <Typography
                                                        className={clsx(classes.notificationText, value.gelesen && classes.notificationTextRead)}>
                                                        {value.nachricht}
                                                    </Typography>
                                                    <Typography className={classes.notificationTimestamp}>
                                                        {format(new Date(value.createdAt), "dd. MMMM, HH:mm", {locale: de})}
                                                    </Typography>
                                                </div>
                                            ))}
                                        </div>

                                        <div className={classes.notificationButtons}>

                                            <Tooltip
                                                arrow
                                                classes={{tooltip: classes.tooltip, arrow: classes.tooltipArrow}}
                                                title="Alle gelesenen Benachrichtigungen löschen"
                                                placement="top"
                                                enterDelay={500}>
                                                <Button
                                                    onClick={this.deleteAllReadNotifications}
                                                    disabled={(this.props.benachrichtigungen || []).filter(b => b.gelesen).length === 0}
                                                    className={classes.notificationButton}
                                                    startIcon={<Close/>}
                                                    variant="text">
                                                    Gelesene löschen
                                                </Button>
                                            </Tooltip>

                                            <Tooltip
                                                arrow
                                                classes={{tooltip: classes.tooltip, arrow: classes.tooltipArrow}}
                                                title="Alle Benachrichtigungen als gelesen markieren"
                                                placement="top"
                                                enterDelay={500}>
                                                <Button
                                                    onClick={this.markAllNotificationsRead}
                                                    disabled={(this.props.benachrichtigungen || []).filter(b => !b.gelesen).length === 0}
                                                    className={classes.notificationButton}
                                                    startIcon={<Drafts/>}
                                                    variant="text">
                                                    Alle gelesen
                                                </Button>
                                            </Tooltip>

                                        </div>

                                    </div>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>

            </>
        )
    }

    componentDidMount = async () => {
        this.props.loadBenachrichtigungen();
        this.props.loadPerson();
    };

    private markAllNotificationsRead = async () => {
        for (const benachrichtigung of (this.props.benachrichtigungen || [])) {
            if (!benachrichtigung.gelesen) {
                await apiPut("/notification/" + benachrichtigung.id, {gelesen: true});
            }
        }
        this.props.loadBenachrichtigungen();
    };

    private deleteAllReadNotifications = async () => {
        for (const benachrichtigung of (this.props.benachrichtigungen || [])) {
            if (benachrichtigung.gelesen) {
                await apiDelete("/notification/" + benachrichtigung.id);
            }
        }
        this.props.loadBenachrichtigungen();
    };

    private showNotificationsMenu = () => this.setNotificationsMenuOpen(true);
    private hideNotificationsMenu = () => this.setNotificationsMenuOpen(false);

    private setNotificationsMenuOpen = (open: boolean) => {
        this.setState({
            notificationsMenuOpen: open
        });
    };

    private onLogoClicked = () => {
        this.props.history.push("/");
    };
}

const mapStateToProps = (state: RootState) => ({
    benachrichtigungen: state.benachrichtigungen.value,
    person: state.person.value
});

const mapDispatchToProps = (dispatch: RootDispatch) => ({
    loadBenachrichtigungen: () => dispatch(loadBenachrichtigungen()),
    loadPerson: () => dispatch(loadPerson())
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withRouter(withStyles(styles)(Menu)));