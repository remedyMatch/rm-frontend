import { makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import Step from "./Step";
import clsx from "clsx";

export interface StepDescription {
  title: string;
  disabled?: boolean;
}

interface Props {
  steps: StepDescription[];
  currentStep: number;
  finished?: boolean;
  className?: string;
  onPreviousStepClicked?: (index: number) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    zIndex: 0,
  },
  stepper: {
    width: "100%",
    display: "flex",
  },
  progress: {
    zIndex: -1,
    marginTop: "-2px",
    display: "flex",
    height: "2px",
    flexDirection: "row",
    position: "relative",
    left: "50%",
    marginLeft: "-50vw",
    width: "100vw",
  },
  progressLeft: {
    width: "50%",
    borderBottom: "2px solid #53284f",
  },
  progressRight: {
    width: "50%",
    borderBottom: "2px solid #CCC",
  },
  progressRightFinished: {
    borderBottom: "2px solid #53284f",
  },
}));

const Stepper: React.FC<Props> = (props) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.container, props.className)}>
      <div className={classes.stepper}>
        {props.steps.map((step, index) => (
          <Step
            onPreviousStepClicked={props.onPreviousStepClicked}
            index={index}
            label={step.title}
            disabled={step.disabled}
            current={index === props.currentStep}
            done={index < props.currentStep}
          />
        ))}
      </div>
      <div className={classes.progress}>
        <div className={classes.progressLeft} />
        <div
          className={clsx(
            classes.progressRight,
            props.finished && classes.progressRightFinished
          )}
        />
      </div>
    </div>
  );
};

export default Stepper;
