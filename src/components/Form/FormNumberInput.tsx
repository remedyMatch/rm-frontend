import TextField from "@material-ui/core/TextField";
import React, {ChangeEvent, useCallback} from "react";

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

    const setValueSafe = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const amount = parseFloat(e.target.value);
        if(!isNaN(amount) || e.target.value.length === 0) {
            onChange(amount);
        }
    }, [onChange]);

    return (
        <TextField
            size="small"
            variant="outlined"
            type="number"
            label={props.label}
            value={props.value || 0}
            className={props.className}
            onChange={setValueSafe}
            disabled={props.disabled || false}
            InputProps={{
                inputProps: {
                    min: props.min
                }
            }}
        />
    );
};