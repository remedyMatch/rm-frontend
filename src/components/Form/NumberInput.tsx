import { IconButton, Typography } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Add, Remove } from "@material-ui/icons";
import clsx from "clsx";
import React, { ChangeEvent, useCallback, useMemo, useState } from "react";

interface Props {
  label: string;
  value?: number;
  className?: string;
  onChange: (newValue?: number) => void;
  disabled?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    "&>div": {
      "&>input": {
        fontWeight: 600,
        fontFamily: "Montserrat, sans-serif",
        textAlign: "center",
        fontSize: "16px",
      },
      "&>fieldset": {
        transition: theme.transitions.create("border"),
        border: "2px solid #666",
        "&:hover": {
          border: "2px solid #53284f",
        },
      },
      "&>button": {
        color: "#666",
      },
      "&:hover>button": {
        color: "#53284f",
      },
    },
  },
  focussed: {
    "&>div": {
      "&>fieldset": {
        border: "2px solid #53284f !important",
      },
      "&>button": {
        color: "#53284f",
      },
    },
  },
  disabledButton: {
    color: "#CCC !important",
  },
  label: {
    fontFamily: "Montserrat, sans-serif",
    fontSize: "16px",
    fontWeight: 600,
    color: "#333",
    lineHeight: 1.5,
    marginBottom: "16px",
    display: "flex",
  },
}));

const numberFormat = new Intl.NumberFormat("de-DE");

const NumberInput: React.FC<Props> = (props) => {
  const classes = useStyles();
  const { onChange, value, disabled } = props;

  const [focussed, setFocussed] = useState<boolean>(false);

  const onFocus = useCallback(() => setFocussed(true), []);
  const onBlur = useCallback(() => setFocussed(false), []);
  const setValueSafe = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const amount = parseFloat(e.target.value);
      if (!isNaN(amount)) {
        onChange(amount);
      } else if (e.target.value.length === 0) {
        onChange(undefined);
      }
    },
    [onChange]
  );

  const displayValue = useMemo(
    () =>
      value === undefined
        ? value
        : focussed
        ? value
        : numberFormat.format(value),
    [focussed, value]
  );

  return (
    <div className={props.className}>
      <Typography className={classes.label}>{props.label}</Typography>
      <TextField
        size="small"
        variant="outlined"
        onFocus={onFocus}
        onBlur={onBlur}
        value={displayValue}
        className={clsx(classes.root, focussed && classes.focussed)}
        onChange={setValueSafe}
        disabled={disabled}
        InputProps={{
          startAdornment: (
            <IconButton
              size="small"
              className={clsx(
                (disabled || (value || 0) === 0) && classes.disabledButton
              )}
              onClick={() => onChange((props.value || 0) - 1)}
              disabled={disabled || (value || 0) === 0}
            >
              <Remove />
            </IconButton>
          ),
          endAdornment: (
            <IconButton
              size="small"
              onClick={() => onChange((value || 0) + 1)}
              disabled={disabled}
            >
              <Add />
            </IconButton>
          ),
        }}
      />
    </div>
  );
};

export default NumberInput;
