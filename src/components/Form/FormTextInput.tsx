import TextField from "@material-ui/core/TextField";
import React from "react";

interface Props {
    label: string;
    value?: string;
    className?: string;
    changeListener: (newValue: string) => void;
    disabled?: boolean;
    type?: string;
    min?: number;
}

export const FormTextInput: React.FC<Props> = props => {
    return (
        <TextField
            size="small"
            variant="outlined"
            type={props.type || "text"}
            label={props.label}
            value={props.value || ""}
            className={props.className}
            onChange={e => props.changeListener(e.target.value)}
            disabled={props.disabled || false}
            InputProps={{
                inputProps: {
                    min: props.min
                }
            }}
        />
    );
};