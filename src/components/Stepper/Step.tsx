import { Fade, Tooltip } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Done } from "@material-ui/icons";
import clsx from "clsx";
import React from "react";

interface Props {
  index: number;
  label: string;
  done?: boolean;
  current?: boolean;
  disabled?: boolean;
  onPreviousStepClicked?: (index: number) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  step: {
    flex: "1 1 0px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "48px",
    fontFamily: "Montserrat, sans-serif",
    fontWeight: 600,
    lineHeight: 1.5,
    color: "#53284f",
    borderBottom: "2px solid #53284f",
    transition: theme.transitions.create([
      "border-color",
      "color, background-color",
    ]),
  },
  stepOpen: {
    color: "#CCC",
    borderBottom: "2px solid #CCC",
  },
  stepDone: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "rgba(83, 40, 79, 0.1)",
    },
  },
  stepDisabled: {
    cursor: "initial",
    color: "rgba(83, 40, 79, 0.54)",
    "&:hover": {
      backgroundColor: "white",
    },
  },
  label: {
    marginLeft: "4px",
  },
  prefixContainer: {
    display: "grid",
  },
  prefix: {
    gridColumn: 1,
    gridRow: 1,
    textAlign: "right",
  },
  tooltip: {
    fontSize: "12px",
    backgroundColor: "rgba(0,0,0,0.87)",
  },
  tooltipArrow: {
    color: "rgba(0,0,0,0.87)",
  },
}));

const Step: React.FC<Props> = (props) => {
  const classes = useStyles();
  const onClick = props.onPreviousStepClicked;
  const listener =
    props.done && !props.disabled && onClick
      ? () => onClick(props.index)
      : undefined;

  return (
    <Tooltip
      arrow
      classes={{ tooltip: classes.tooltip, arrow: classes.tooltipArrow }}
      title={props.done && listener ? "Zu diesem Schritt springen" : ""}
      placement="top"
      enterDelay={500}
    >
      <div
        className={clsx(classes.step, {
          [classes.stepOpen]: !props.done && !props.current,
          [classes.stepDone]: !props.disabled && listener && props.done,
          [classes.stepDisabled]: props.disabled,
        })}
        onClick={listener}
      >
        <div className={classes.prefixContainer}>
          <Fade in={props.done}>
            <Done className={classes.prefix} fontSize="small" />
          </Fade>
          <Fade in={!props.done}>
            <span className={classes.prefix}>{props.index + 1}.</span>
          </Fade>
        </div>

        <span className={classes.label}>{props.label}</span>
      </div>
    </Tooltip>
  );
};

export default Step;
