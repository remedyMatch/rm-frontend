import { Button, Typography } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { ArrowForward } from "@material-ui/icons";
import clsx from "clsx";
import React from "react";

interface Props {
  title: string;
  showPlaceholder?: boolean;
  placeholder?: React.ReactNode;
  className?: string;
  actionDisabled?: boolean;
  action?: string;
  onActionClicked?: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    borderRadius: "8px",
    border: "2px solid #CCC",
    display: "flex",
    flexDirection: "column",
  },
  cardHeader: {
    color: "#007c92",
    fontFamily: "Montserrat, sans-serif",
    fontSize: "16px",
    fontWeight: 600,
    padding: "24px 24px 0px 24px",
  },
  cardContent: {
    padding: "12px 0px",
    flexGrow: 1,
  },
  cardPlaceholder: {
    width: "100%",
    display: "flex",
    textAlign: "center",
    flexDirection: "column",
    justifyContent: "center",
    padding: "36px",
    flexGrow: 1,
    fontFamily: "Montserrat, sans-serif",
    color: "rgba(0,0,0,0.54)",
  },
  cardLink: {
    textTransform: "none",
    fontFamily: "Montserrat, sans-serif",
    width: "100%",
    transition: theme.transitions.create("background-color"),
    justifyContent: "left",
    padding: "12px 24px",
    fontWeight: 600,
    color: "#007c92",
    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.04)",
    },
  },
  cardFooterLink: {
    borderTopLeftRadius: "0px",
    borderTopRightRadius: "0px",
  },
}));

const ContentCard: React.FC<Props> = ({
  className,
  title,
  placeholder,
  showPlaceholder,
  onActionClicked,
  actionDisabled,
  action,
  children,
}) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.card, className)}>
      <Typography className={classes.cardHeader}>{title}</Typography>

      {(!showPlaceholder || !placeholder) && (
        <div className={classes.cardContent}>{children}</div>
      )}

      {showPlaceholder && placeholder && (
        <div className={classes.cardPlaceholder}>{placeholder}</div>
      )}

      {action && (
        <Button
          onClick={onActionClicked}
          disabled={actionDisabled}
          startIcon={<ArrowForward />}
          variant="text"
          className={clsx(classes.cardLink, classes.cardFooterLink)}
        >
          {action}
        </Button>
      )}
    </div>
  );
};

export default ContentCard;
