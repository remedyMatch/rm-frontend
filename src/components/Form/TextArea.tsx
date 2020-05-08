import {TextareaAutosize, Typography} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import clsx from "clsx";
import React, {ChangeEvent, useCallback, useState} from "react";

interface Props {
    label: string;
    value?: string;
    className?: string;
    onChange: (newValue: string) => void;
    placeholder?: string;
    disabled?: boolean;
    minLines?: number;
    maxLines?: number;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        height: "calc(100% - 40px) !important",
        fontFamily: "Montserrat, sans-serif",
        fontSize: "16px",
        fontWeight: 600,
        lineHeight: 1.5,
        color: "#333",
        resize: "none",
        padding: "16px",
        width: "100%",
        transition: theme.transitions.create("border"),
        border: "2px solid #666",
        borderRadius: "8px",
        "&:hover": {
            border: "2px solid #53284f"
        },
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
    focussed: {
        outline: "none",
        border: "2px solid #53284f"
    },
    label: {
        fontFamily: "Montserrat, sans-serif",
        fontSize: "16px",
        fontWeight: 600,
        color: "#333",
        lineHeight: 1.5,
        marginBottom: "16px",
        display: "flex"
    }
}));

const TextArea: React.FC<Props> = props => {
    const classes = useStyles();
    const {onChange} = props;

    const [focussed, setFocussed] = useState<boolean>(false);

    const onFocus = useCallback(() => setFocussed(true), []);
    const onBlur = useCallback(() => setFocussed(false), []);
    const setValue = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value), [onChange]);

    return (
        <div className={props.className}>
            <Typography className={classes.label}>{props.label}</Typography>
            <TextareaAutosize
                rowsMin={props.minLines}
                rowsMax={props.maxLines}
                placeholder={props.placeholder}
                value={props.value}
                disabled={props.disabled}
                onFocus={onFocus}
                onBlur={onBlur}
                className={clsx(classes.root, focussed && classes.focussed)}
                onChange={setValue}/>
        </div>
    );
};

export default TextArea;