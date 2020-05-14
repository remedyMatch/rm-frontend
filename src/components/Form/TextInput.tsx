import {Typography} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import clsx from "clsx";
import React, {ChangeEvent, useCallback, useState} from "react";

interface Props {
    label: string;
    value?: string;
    className?: string;
    onChange: (newValue: string) => void;
    disabled?: boolean;
    dense?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: "flex",
        "&>div": {
            "&>input": {
                fontWeight: 600,
                fontFamily: "Montserrat, sans-serif",
                fontSize: "16px"
            },
            "&>fieldset": {
                transition: theme.transitions.create("border"),
                border: "2px solid #666",
                "&:hover": {
                    border: "2px solid #53284f"
                }
            }
        }
    },
    focussed: {
        "&>div": {
            "&>fieldset": {
                border: "2px solid #53284f !important"
            }
        }
    },
    label: {
        fontFamily: "Montserrat, sans-serif",
        fontSize: "16px",
        fontWeight: 600,
        color: "#333",
        lineHeight: 1.5,
        marginBottom: "16px",
        display: "flex"
    },
    denseLabel: {
        marginBottom: "8px"
    }
}));

const TextInput: React.FC<Props> = props => {
    const classes = useStyles();
    const {onChange, value, disabled} = props;

    const [focussed, setFocussed] = useState<boolean>(false);

    const onFocus = useCallback(() => setFocussed(true), []);
    const onBlur = useCallback(() => setFocussed(false), []);
    const setValue = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange(e.target.value);
    }, [onChange]);

    return (
        <div className={props.className}>
            <Typography className={clsx(classes.label, props.dense && classes.denseLabel)}>{props.label}</Typography>
            <TextField
                size="small"
                variant="outlined"
                onFocus={onFocus}
                onBlur={onBlur}
                placeholder={props.label}
                value={value}
                className={clsx(classes.root, focussed && classes.focussed)}
                onChange={setValue}
                disabled={disabled}
            />
        </div>
    );
};

export default TextInput;