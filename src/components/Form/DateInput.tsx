import dateFns from '@material-ui/pickers/adapter/date-fns';
import {Typography} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {DatePicker, LocalizationProvider} from "@material-ui/pickers";
import clsx from "clsx";
import {de} from "date-fns/locale";
import React, {useCallback, useState} from "react";

interface Props {
    label: string;
    placeholder: string;
    value?: Date;
    className?: string;
    onChange: (newValue?: Date) => void;
    disabled?: boolean;
    disablePast?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: "flex",
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
            "&>div>button": {
                color: "#CCC"
            },
            "&:hover>div>button": {
                color: "#53284f"
            }
        }
    },
    focussed: {
        "&>div": {
            "&>fieldset": {
                border: "2px solid #53284f"
            },
            "&>div>button": {
                color: "#53284f"
            }
        }
    },
    label: {
        fontFamily: "Montserrat, sans-serif",
        fontSize: "16px",
        fontWeight: 600,
        color: "#333",
        lineHeight: 1.5,
        marginBottom: "8px",
        display: "flex"
    }
}));

const DateInput: React.FC<Props> = props => {
    const classes = useStyles();
    const {onChange, value, disabled, disablePast, placeholder} = props;

    const [focussed, setFocussed] = useState<boolean>(false);

    const onFocus = useCallback(() => setFocussed(true), []);
    const onBlur = useCallback(() => setFocussed(false), []);
    const onChangeListener = useCallback((value: Date | null) => onChange(value === null ? undefined : value), [onChange]);

    return (
        <div className={props.className}>
            <LocalizationProvider dateAdapter={dateFns} locale={de}>
                <Typography className={classes.label}>{props.label}</Typography>
                <DatePicker
                    autoOk
                    className={clsx(classes.root, focussed && classes.focussed)}
                    variant="outlined"
                    disablePast={disablePast}
                    inputFormat="dd.MM.yyyy"
                    onFocus={onFocus}
                    minDate={disablePast ? new Date() : undefined}
                    onBlur={onBlur}
                    invalidDateMessage="Ungültiges Datum"
                    maxDateMessage="Datum zu weit in der Zukunft"
                    minDateMessage="Datum zu weit in der Vergangenheit"
                    disabled={disabled}
                    placeholder={placeholder}
                    value={value || null}
                    size="small"
                    onChange={onChangeListener}
                />
            </LocalizationProvider>
        </div>
    );
};

export default DateInput;