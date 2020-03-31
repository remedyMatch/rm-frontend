import {makeStyles} from "@material-ui/core/styles";
import React from "react";
import {InstitutionStandort} from "../../Domain/InstitutionStandort";
import {Autocomplete, createFilterOptions} from "@material-ui/lab";
import {Grid, TextField} from "@material-ui/core";
import {LocationOn} from "@material-ui/icons";

interface Props {
    label?: string;
    valueId?: string;
    disabled?: boolean;
    className?: string;
    options: InstitutionStandort[];
    onSelect: (location: InstitutionStandort | null) => void;
}

const useStyles = makeStyles((theme) => {
    return {
        icon: {
            color: theme.palette.text.secondary,
            marginRight: "16px",
        },
        address: {
            "& > p": {
                margin: "0px"
            }
        },
        popup: {
            border: "1px solid #CCC",
            borderRadius: "4px",
            backgroundColor: "#FCFCFC"
        }
    };
});

export const FormLocationPicker: React.FC<Props> = props => {
    const classes = useStyles();
    const filterOptions = createFilterOptions<InstitutionStandort>({
        stringify: (option) => Object.values(option).join(" ")
    });

    return (
        <Autocomplete
            size="small"
            onChange={(event: any, location: InstitutionStandort | null) => props.onSelect(location)}
            options={props.options}
            classes={{listbox: classes.popup}}
            value={props.options.find(l => l.id === props.valueId) || null}
            disabled={props.disabled}
            disableClearable
            getOptionLabel={standort => standort.name}
            filterOptions={filterOptions}
            className={props.className}
            renderOption={(standort) => {
                return (
                    <Grid container alignItems="center">
                        <Grid item>
                            <LocationOn className={classes.icon}/>
                        </Grid>
                        <Grid item xs>
                            <div className={classes.address}>
                                <p>{standort.name}</p>
                                <p>{standort.strasse}</p>
                                <p>{standort.plz} {standort.ort}</p>
                                <p>{standort.land}</p>
                            </div>
                        </Grid>
                    </Grid>
                );
            }}
            renderInput={params => (
                <TextField
                    {...params}
                    label={props.label || "Standort"}
                    variant="outlined"/>
            )}
        />
    );
};

