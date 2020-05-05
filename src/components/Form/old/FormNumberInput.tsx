import {IconButton} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import {Add, Remove} from "@material-ui/icons";
import React, {ChangeEvent, useCallback, useState} from "react";

interface Props {
    label: string;
    value?: number;
    className?: string;
    onChange: (newValue: number) => void;
    disabled?: boolean;
    min?: number;
}

export const FormNumberInput: React.FC<Props> = props => {
    const {onChange} = props;

    const [focussed, setFocussed] = useState<boolean>(false);
    const setValueSafe = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const amount = parseFloat(e.target.value);
        if(!isNaN(amount) || e.target.value.length === 0) {
            onChange(amount);
        }
    }, [onChange]);

    const onFocus = useCallback(() => setFocussed(true), []);
    const onBlur = useCallback(() => setFocussed(false), []);

    return (
        <TextField
            size="small"
            variant="outlined"
            onFocus={onFocus}
            onBlur={onBlur}
            value={focussed ? props.value || "" : new Intl.NumberFormat('de-DE').format(props.value || 0)}
            className={props.className}
            onChange={setValueSafe}
            disabled={props.disabled || false}
            InputProps={{
                startAdornment: <IconButton onClick={() => onChange((props.value || 0) - 1)} disabled={(props.value || 0) === 0}><Remove /></IconButton>,
                endAdornment: <IconButton onClick={() => onChange((props.value || 0) + 1)}><Add /></IconButton>
            }}
        />
    );
};