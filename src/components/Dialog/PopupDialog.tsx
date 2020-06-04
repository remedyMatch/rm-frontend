import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Theme,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";
import ErrorToast from "./ErrorToast";

declare type Width = "small" | "medium" | "large" | string | undefined;

interface Props {
  open: boolean;
  title: string;
  subtitle?: string;
  width?: Width; //TODO Remove
  error?: string;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean; // TODO Remove
  firstDisabled?: boolean;
  secondDisabled?: boolean;
  onFirst?: () => void;
  onSecond?: () => void;
  firstTitle?: string;
  secondTitle?: string;
  onCloseError?: () => void;
  errorClassName?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  children: {
    display: "flex",
    flexDirection: "column",
  },
  childrenWrapper: {
    margin: "0.5em",
    padding: "0px 24px",
    "&::-webkit-scrollbar": {
      width: "12px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "rgba(0,0,0,0.1)",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "darkgrey",
      borderRadius: "6px",
    },
  },
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.25)",
    backdropFilter: "blur(3px)",
  },
  paper: {
    margin: "-0.5rem",
    boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    maxWidth: "600px",
    width: "calc(100vw - 0.2rem)",
  },
  title: {
    fontFamily: "Montserrat, sans-serif",
    fontSize: "20px",
    fontWeight: 600,
    color: "#333",
    textAlign: "center",
    lineHeight: 1.35,
    padding: "24px",
  },
  subtitle: {
    fontFamily: "Montserrat, sans-serif",
    fontSize: "16px",
    color: "#333",
    textAlign: "center",
    lineHeight: 1.2,
    padding: "0px 24px 24px 24px",
  },
  buttons: {
    margin: "16px",
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
  },
  button: {
    margin: "4px 8px",
    color: "#007C92",
    fontFamily: "Montserrat, sans-serif",
    fontWeight: 600,
    textTransform: "none",
    padding: "8px 24px",
    transition: theme.transitions.create([
      "border",
      "color",
      "background-color",
    ]),
    height: "48px",
    minWidth: "144px",
  },
  buttonSecondary: {
    border: "2px solid #007C92",
    "&:hover": {
      backgroundColor: "rgba(0, 124, 146, 0.1)",
      border: "2px solid #006374",
    },
  },
  buttonPrimary: {
    backgroundColor: "#007C92",
    color: "white",
    "&:hover": {
      backgroundColor: "#006374",
    },
  },
  titleWrapper: {
    padding: "16px 24px 0px 24px",
  },
  error: {
    marginBottom: "16px",
  },
}));

// TODO: Error stylen

const PopupDialog: React.FC<Props> = (props) => {
  const classes = useStyles(props);
  return (
    <Dialog
      BackdropProps={{
        className: classes.backdrop,
      }}
      PaperProps={{
        className: classes.paper,
        elevation: undefined,
      }}
      open={props.open}
      disableBackdropClick
    >
      <DialogTitle disableTypography className={classes.titleWrapper}>
        <Typography className={classes.title}>{props.title}</Typography>
        {props.subtitle && (
          <Typography className={classes.subtitle}>{props.subtitle}</Typography>
        )}
        <ErrorToast
          error={props.error}
          onClose={props.onCloseError}
          className={clsx(classes.error, props.errorClassName)}
        />
      </DialogTitle>

      <DialogContent className={classes.childrenWrapper}>
        <div className={classes.children}>{props.children}</div>
      </DialogContent>

      {(props.onFirst || props.onSecond) && (
        <DialogActions className={classes.buttons}>
          {props.onFirst && (
            <Button
              disableElevation
              className={clsx(classes.button, classes.buttonSecondary)}
              onClick={props.onFirst}
              variant="outlined"
              disabled={props.disabled || props.firstDisabled}
            >
              {props.firstTitle || "Abbrechen"}
            </Button>
          )}
          {props.onSecond && (
            <Button
              disableElevation
              className={clsx(classes.button, classes.buttonPrimary)}
              onClick={props.onSecond}
              variant="contained"
              disabled={props.disabled || props.secondDisabled}
            >
              {props.secondTitle || "Fertig"}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default PopupDialog;
