import {makeStyles} from "@material-ui/core/styles";
import {fade} from "@material-ui/core/styles/colorManipulator";
import TextField from "@material-ui/core/TextField";
import React from "react";

interface Props {
    label: string;
    value?: string;
    className?: string;
    changeListener: (newValue: string) => void;
    disabled?: boolean;
    type?: string;
}

export const FormTextInput: React.FC<Props> = props => {
    const inputStyles = makeStyles(theme => {
        const colors = theme.palette;
        const black = colors.common.black;

        return {
            root: {
                color: black,
                overflow: "hidden",
                border: "0px",
                borderRadius: theme.spacing(0.5),
                padding: 0,
                backgroundColor: fade(black, 0.05),
                transition: theme.transitions.create("background-color"),
                "&:hover": {
                    backgroundColor: fade(black, 0.1)
                },
                "&$focused": {
                    backgroundColor: fade(black, 0.1)
                }
            },
            focused: {}
        };
    });
    const inputClasses = inputStyles();

    const labelStyles = makeStyles(theme => {
        const colors = theme.palette;
        const black = colors.common.black;

        return {
            root: {
                color: fade(black, 0.7),
                "&:hover": {
                    color: fade(black, 0.7)
                },
                "&$focused": {
                    color: fade(black, 0.7)
                }
            },
            focused: {}
        };
    });
    const labelClasses = labelStyles();

    return (
        <TextField
            size="small"
            variant="filled"
            type={props.type || "text"}
            label={props.label}
            value={props.value || ""}
            className={props.className}
            onChange={e => props.changeListener(e.target.value)}
            InputLabelProps={{classes: labelClasses}}
            disabled={props.disabled || false}
            InputProps={{
                classes: inputClasses,
                disableUnderline: true
            }}
        />
    );
};