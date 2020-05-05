import {TextField} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Autocomplete} from "@material-ui/lab";
import React, {FC, useCallback} from "react";

interface Props<T> {
    disabled?: boolean;
    options: T[];
    onChange: (value?: T) => void;
    getOptionLabel?: (value: T) => string;
    label: string;
    value?: T;
    className?: string;
}

const useStyles = makeStyles(() => ({
    statusPopup: {
        border: "1px solid #CCC",
        borderRadius: "4px",
        backgroundColor: "#FCFCFC"
    }
}));

const FormAutocomplete: FC<Props<any>> = <T extends unknown>(props: Props<T>) => {
    const classes = useStyles();

    const {onChange} = props;
    const onChangeCallback = useCallback((_, value: T | null) => {
        onChange(value === null ? undefined : value);
    }, [onChange]);

    return (
        <Autocomplete
            className={props.className}
            size="small"
            disabled={props.disabled}
            getOptionLabel={props.getOptionLabel}
            onChange={onChangeCallback}
            options={props.options}
            classes={{listbox: classes.statusPopup}}
            value={props.value || null}
            renderInput={params => (
                <TextField {...params}
                           color="secondary"
                           label={props.label}
                           variant="outlined"/>)}/>
    );
};

export default FormAutocomplete;