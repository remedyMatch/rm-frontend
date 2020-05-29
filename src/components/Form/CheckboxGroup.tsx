import { Typography } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

interface Props {
  label?: string;
  className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  label: {
    fontFamily: "Montserrat, sans-serif",
    fontSize: "16px",
    fontWeight: 600,
    color: "#333",
    lineHeight: 1.5,
    marginBottom: "16px",
    display: "flex",
  },
  group: {
    border: "2px solid #666",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    "&>*:first-child": {
      borderTopLeftRadius: "5px",
      borderTopRightRadius: "5px",
    },
    "&>*:last-child": {
      borderBottomLeftRadius: "5px",
      borderBottomRightRadius: "5px",
    },
  },
}));

const CheckboxGroup: React.FC<Props> = (props) => {
  const classes = useStyles();

  return (
    <div className={props.className}>
      {props.label && (
        <Typography className={classes.label}>{props.label}</Typography>
      )}
      <div className={classes.group}>{props.children}</div>
    </div>
  );
};

export default CheckboxGroup;
