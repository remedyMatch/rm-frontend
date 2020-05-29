import { Button } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { ArrowForward } from "@material-ui/icons";
import clsx from "clsx";
import React from "react";

interface Props {
  title: string;
  onClick: () => void;
  className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
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
  linkCard: {
    backgroundColor: "#53284f",
    borderRadius: "8px",
    height: "48px",
    marginRight: "1em",
    transition: theme.transitions.create("background-color"),
    "&:hover": {
      backgroundColor: "#42203f",
    },
  },
  linkCardLink: {
    color: "white",
  },
}));

const LinkCard: React.FC<Props> = (props) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.linkCard, props.className)}>
      <Button
        onClick={props.onClick}
        startIcon={<ArrowForward />}
        variant="text"
        className={clsx(classes.cardLink, classes.linkCardLink)}
      >
        {props.title}
      </Button>
    </div>
  );
};

export default LinkCard;
