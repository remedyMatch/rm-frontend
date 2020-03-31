import React from "react";
import {Checkbox, FormControlLabel} from "@material-ui/core";

interface Props {
    disabled?: boolean;
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    className?: string;
    checkboxClassName?: string;
}

export const FormCheckbox: React.FC<Props> = props => {
    const {onChange} = props;
    const onChangeCallback = React.useCallback(
        (event: any, checked: boolean) => onChange(checked),
        [onChange]
    );

    return (
        <FormControlLabel
            className={props.className}
            control={(
                <Checkbox
                    className={props.checkboxClassName}
                    disabled={props.disabled}
                    checked={props.checked}
                    onChange={onChangeCallback}
                />
            )}
            label={props.label}
        />
    );
};

