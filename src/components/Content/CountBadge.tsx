import { makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import clsx from "clsx";

interface Props {
  count?: number;
  className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  badge: {
    backgroundColor: "#007C92",
    borderRadius: "16px",
    fontFamily: "Montserrat, sans-serif",
    fontSize: "16px",
    fontWeight: 600,
    color: "white",
    padding: "0px 16px",
    textAlign: "center",
  },
}));

const CountBadge: React.FC<Props> = (props) => {
  const classes = useStyles();

  if (!props.count) {
    return null;
  }

  return (
    <span className={clsx(classes.badge, props.className)}>{props.count}</span>
  );
};

export default CountBadge;
