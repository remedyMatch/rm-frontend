import {Checkbox as MUICheckbox, FormControlLabel} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {Check, RadioButtonUnchecked} from "@material-ui/icons";
import clsx from "clsx";
import React from "react";

interface Props {
    disabled?: boolean;
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    className?: string;
    checkboxClassName?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        transition: theme.transitions.create("background-color"),
        height: "48px",
        margin: "0px",
        paddingRight: "42px",
        "&>span:last-child": {
            transition: theme.transitions.create("color"),
            fontFamily: "Montserrat, sans-serif",
            fontSize: "16px",
            fontWeight: 600,
            color: "#333",
            lineHeight: 1.5,
            flexGrow: 1,
            textAlign: "center"
        }
    },
    checked: {
        backgroundColor: "#53284f",
        "&>span:first-child>span:first-child>svg": {
            color: "white"
        },
        "&>span:last-child": {
            color: "white"
        }
    }
}));

const Checkbox: React.FC<Props> = props => {
    const classes = useStyles();

    const {onChange} = props;
    const onChangeCallback = React.useCallback(
        (event: any, checked: boolean) => onChange(checked),
        [onChange]
    );

    return (
        <FormControlLabel
            className={clsx(classes.root, props.checked && classes.checked, props.className)}
            control={(
                <MUICheckbox
                    disableRipple
                    className={props.checkboxClassName}
                    disabled={props.disabled}
                    checked={props.checked}
                    onChange={onChangeCallback}
                    checkedIcon={<Check/>}
                    icon={<RadioButtonUnchecked/>}
                />
            )}
            label={props.label}
        />
    );
};

export default Checkbox;