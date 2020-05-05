import {IconButton} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import {Add, Remove} from "@material-ui/icons";
import clsx from "clsx";
import React, {ChangeEvent, useCallback, useMemo, useState} from "react";

interface Props {
    label: string;
    value?: number;
    className?: string;
    onChange: (newValue: number) => void;
    disabled?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        "&>div": {
            "&>input": {
                textAlign: "center"
            },
            "&>fieldset": {
                transition: theme.transitions.create("border"),
                border: "2px solid #CCC",
                "&:hover": {
                    border: "2px solid #53284f"
                }
            },
            "&>button": {
                color: "#CCC"
            },
            "&:hover>button": {
                color: "#53284f"
            }
        }
    },
    focussed: {
        "&>div": {
            "&>fieldset": {
                border: "2px solid #53284f"
            },
            "&>button": {
                color: "#53284f"
            }
        }
    },
    disabledButton: {
        color: "#EEE !important"
    }
}));

const numberFormat = new Intl.NumberFormat('de-DE');

const NumberInput: React.FC<Props> = props => {
    const classes = useStyles();
    const {onChange, value, disabled} = props;

    const [focussed, setFocussed] = useState<boolean>(false);

    const onFocus = useCallback(() => setFocussed(true), []);
    const onBlur = useCallback(() => setFocussed(false), []);
    const setValueSafe = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const amount = parseFloat(e.target.value);
        if (!isNaN(amount) || e.target.value.length === 0) {
            onChange(amount);
        }
    }, [onChange]);

    const displayValue = useMemo(() => focussed ? value === undefined ? "" : value : numberFormat.format(value || 0), [focussed, value]);

    return (
        <TextField
            size="small"
            variant="outlined"
            onFocus={onFocus}
            onBlur={onBlur}
            value={displayValue}
            className={clsx(classes.root, focussed && classes.focussed, props.className)}
            onChange={setValueSafe}
            disabled={disabled || false}
            InputProps={{
                startAdornment: (
                    <IconButton
                        size="small"
                        className={clsx((disabled || (value || 0) === 0) && classes.disabledButton)}
                        onClick={() => onChange((props.value || 0) - 1)}
                        disabled={disabled || (value || 0) === 0}>
                        <Remove/>
                    </IconButton>
                ),
                endAdornment: (
                    <IconButton
                        size="small"
                        onClick={() => onChange((value || 0) + 1)}
                        disabled={disabled}>
                        <Add/>
                    </IconButton>
                )
            }}
        />
    );
};

export default NumberInput;