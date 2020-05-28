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
  Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Close, Drafts, Notifications } from "@material-ui/icons";
import clsx from "clsx";
import { format, isThisYear, isToday, isYesterday } from "date-fns";
import { de } from "date-fns/locale";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadBenachrichtigungen } from "../../state/benachrichtigung/BenachrichtigungenState";
import { RootDispatch, RootState } from "../../state/Store";
import { apiDelete, apiPut } from "../../util/ApiUtils";

const useStyles = makeStyles(() => ({
  backdrop: {
    zIndex: 1001,
    backgroundColor: "rgba(0,0,0,0.25)",
    backdropFilter: "blur(3px)"
  },
  notifications: {
    margin: "auto 0",
    backgroundColor: "white",
    borderTopLeftRadius: "50%",
    borderTopRightRadius: "50%"
  },
  notificationsActive: {
    zIndex: 1003,
    borderBottomRightRadius: "0px",
    borderBottomLeftRadius: "0px"
  },
  notificationsIcon: {
    color: "#53284f"
  },
  notificationsPopup: {
    borderRadius: "8px"
  },
  notificationsPopupContainer: {
    zIndex: 1002
  },
  notificationsContainer: {
    paddingTop: "24px",
    maxWidth: "400px"
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
    borderTop: "1px solid #CCC"
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
}));

const formatDate = (createdAt: Date) => {
  if (isToday(createdAt)) {
    return format(createdAt, "HH:mm", { locale: de });
  }

  if (isYesterday(createdAt)) {
    return "Gestern, " + format(createdAt, "HH:mm", { locale: de });
  }

  if (isThisYear(createdAt)) {
    return format(createdAt, "dd. MMMM, HH:mm", { locale: de });
  }

  return format(createdAt, "dd. MMMM YYYY, HH:mm", { locale: de });
};

const NotificationMenu: React.FC = () => {
  const classes = useStyles();

  const menuRef = useRef<HTMLButtonElement>(null);

  const [open, setOpen] = useState(false);

  const notifications = useSelector(
    (state: RootState) => state.benachrichtigungen.value || []
  );
  const dispatch: RootDispatch = useDispatch();

  const openMenu = useCallback(() => setOpen(true), []);
  const closeMenu = useCallback(() => setOpen(false), []);

  const markAllNotificationsRead = useCallback(() => {
    for (const notification of notifications) {
      if (!notification.gelesen) {
        apiPut("/notification/" + notification.id, { gelesen: true });
      }
    }
    dispatch(loadBenachrichtigungen());
  }, [notifications, dispatch]);

  const deleteAllReadNotifications = useCallback(() => {
    for (const notification of notifications) {
      if (notification.gelesen) {
        apiDelete("/notification/" + notification.id);
      }
    }
    dispatch(loadBenachrichtigungen());
  }, [notifications, dispatch]);

  useEffect(() => {
    dispatch(loadBenachrichtigungen());
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(
      () => dispatch(loadBenachrichtigungen()),
      30 * 1000
    );
    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <>
      <div
        className={clsx(
          classes.notifications,
          open && classes.notificationsActive
        )}
      >
        <IconButton
          ref={menuRef}
          onClick={openMenu}
          style={{ padding: "0.2rem" }}
        >
          <Badge
            anchorOrigin={{
              horizontal: "right",
              vertical: "bottom"
            }}
            overlap="circle"
            badgeContent={notifications.filter(b => !b.gelesen).length || 0}
            color="error"
          >
            <Notifications
              style={{ fontSize: "2rem" }}
              className={classes.notificationsIcon}
            />
          </Badge>
        </IconButton>
      </div>

      <Backdrop open={open} className={classes.backdrop} />

      <Popper
        open={open}
        anchorEl={menuRef.current}
        className={classes.notificationsPopupContainer}
        transition
        disablePortal
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: "center top" }}>
            <Paper className={classes.notificationsPopup}>
              <ClickAwayListener onClickAway={closeMenu}>
                <div className={classes.notificationsContainer}>
                  <Typography className={classes.notificationsTitle}>
                    Ihre Benachrichtigungen
                  </Typography>

                  <div className={classes.notificationsList}>
                    {notifications.length === 0 && (
                      <Typography className={classes.notificationPlaceholder}>
                        Es sind keine Benachrichtigungen vorhanden.
                      </Typography>
                    )}
                    {notifications.map(value => (
                      <div className={classes.notificationEntry}>
                        <Typography
                          className={clsx(
                            classes.notificationText,
                            value.gelesen && classes.notificationTextRead
                          )}
                        >
                          {value.nachricht}
                        </Typography>
                        <Typography className={classes.notificationTimestamp}>
                          {formatDate(new Date(value.createdAt))}
                        </Typography>
                      </div>
                    ))}
                  </div>

                  <div className={classes.notificationButtons}>
                    <Tooltip
                      arrow
                      classes={{
                        tooltip: classes.tooltip,
                        arrow: classes.tooltipArrow
                      }}
                      title="Alle gelesenen Benachrichtigungen löschen"
                      placement="top"
                      enterDelay={500}
                    >
                      <Button
                        onClick={deleteAllReadNotifications}
                        disabled={
                          notifications.filter(b => b.gelesen).length === 0
                        }
                        className={classes.notificationButton}
                        startIcon={<Close />}
                        variant="text"
                      >
                        Gelesene löschen
                      </Button>
                    </Tooltip>

                    <Tooltip
                      arrow
                      classes={{
                        tooltip: classes.tooltip,
                        arrow: classes.tooltipArrow
                      }}
                      title="Alle Benachrichtigungen als gelesen markieren"
                      placement="top"
                      enterDelay={500}
                    >
                      <Button
                        onClick={markAllNotificationsRead}
                        disabled={
                          notifications.filter(b => !b.gelesen).length === 0
                        }
                        className={classes.notificationButton}
                        startIcon={<Drafts />}
                        variant="text"
                      >
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
  );
};

export default NotificationMenu;
