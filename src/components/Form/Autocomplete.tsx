import {TextField, Theme, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Autocomplete as MUIAutocomplete} from "@material-ui/lab";
import clsx from "clsx";
import React, {FC, useCallback, useState} from "react";

interface Props<T> {
    disabled?: boolean;
    options: T[];
    onChange: (value?: T) => void;
    getOptionLabel?: (value: T) => string;
    label: string;
    value?: T;
    dense?: boolean;
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: "flex",
        "&>div>div": {
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
        "&>div>div>fieldset": {
            border: "2px solid #53284f !important"
        }
    },
    open: {
        "&>div>div>fieldset": {
            borderRadius: "4px 4px 0px 0px"
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
    },
    popper: {
        margin: "-2px 0px 0px 0px",
        border: "2px solid #53284f",
        borderTop: "none",
        borderRadius: "0px 0px 4px 4px"
    },
    listbox: {
        "&::-webkit-scrollbar": {
            width: "12px"
        },
        "&::-webkit-scrollbar-track": {
            backgroundColor: "rgba(0,0,0,0.1)"
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "darkgrey",
            borderRadius: "6px"
        }
    },
    paper: {
        marginBottom: "0px"
    },
    option: {
        fontFamily: "Montserrat, sans-serif",
        fontSize: "16px",
        fontWeight: 600,
        color: "#333",
        lineHeight: 1.5
    }
}));

const Autocomplete: FC<Props<any>> = <T extends unknown>(props: Props<T>) => {
    const classes = useStyles();

    const {onChange} = props;
    const onChangeCallback = useCallback((_, value: T | null) => {
        onChange(value === null ? undefined : value);
    }, [onChange]);

    const [focussed, setFocussed] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const onFocus = useCallback(() => setFocussed(true), []);
    const onBlur = useCallback(() => setFocussed(false), []);
    const onOpen = useCallback(() => setOpen(true), []);
    const onClose = useCallback(() => setOpen(false), []);

    return (
        <div className={props.className}>
            <Typography className={clsx(classes.label, props.dense && classes.denseLabel)}>{props.label}</Typography>
            <MUIAutocomplete
                onOpen={onOpen}
                onClose={onClose}
                onFocus={onFocus}
                onBlur={onBlur}
                className={clsx(classes.root, focussed && classes.focussed, open && classes.open)}
                size="small"
                disabled={props.disabled}
                getOptionLabel={props.getOptionLabel}
                onChange={onChangeCallback}
                options={props.options}
                classes={{
                    popper: classes.popper,
                    option: classes.option,
                    paper: classes.paper,
                    listbox: classes.listbox
                }}
                value={props.value || null}
                renderInput={params => (
                    <TextField {...params}
                               color="secondary"
                               placeholder={props.label}
                               variant="outlined"/>)}/>
        </div>
    );
};

export default Autocomplete;