import React, {ChangeEvent, PureComponent} from "react";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {Checkbox, FormControlLabel, Grid, TextareaAutosize, TextField, Typography} from "@material-ui/core";
import {Autocomplete, createFilterOptions} from "@material-ui/lab";
import {WithStylesPublic} from "../../../util/WithStylesPublic";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import {Artikel} from "../../../Domain/Artikel";
import {ArtikelKategorie} from "../../../Domain/ArtikelKategorie";
import {apiPost} from "../../../util/ApiUtils";
import PopupDialog from "../../../components/PopupDialog";
import {handleDialogButton} from "../../../util/DialogUtils";
import {defined, numberSize, validate} from "../../../util/ValidationUtils";
import {LocationOn} from "@material-ui/icons";
import {Institution} from "../../../Domain/Institution";
import {InstitutionStandort} from "../../../Domain/InstitutionStandort";
import InstitutionScreen from "../../InstitutionScreen";

interface Props extends WithStylesPublic<typeof styles> {
    open: boolean;
    onCancelled: () => void;
    onSaved: () => void;
    artikel: Artikel[];
    institution?: Institution;
}

interface State {
    category?: string;
    article?: string;
    amount: number;
    location?: string;
    useBefore?: Date;
    comment: string;
    sterile: boolean;
    sealed: boolean;
    medical: boolean;
    disabled: boolean;
    error?: string;
}

const initialState = {
    category: undefined,
    article: undefined,
    amount: 0,
    location: undefined,
    useBefore: new Date(),
    comment: "",
    sterile: false,
    sealed: false,
    medical: false,
    disabled: false,
    error: undefined
};

const styles = (theme: Theme) =>
    createStyles({
        formRow: {
            marginTop: "16px"
        },
        comment: {
            marginTop: "16px",
            resize: "none",
            fontSize: "14px",
            padding: "16px",
            "&:focus": {
                outline: "none",
                border: "2px solid " + theme.palette.primary.main
            }
        },
        caption: {
            textAlign: "right",
            marginTop: "8px"
        },
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
            backgroundColor: "#EEE"
        }
    });

class AddOfferDialog extends PureComponent<Props, State> {
    state: State = {...initialState};

    private onSave = async () => {
        handleDialogButton(
            this.setState.bind(this),
            this.props.onSaved,
            () => validate(
                defined(this.state.category, "Es muss eine Kategorie gewählt werden!"),
                defined(this.state.article, "Es muss ein Artikel gewählt werden!"),
                defined(this.state.location, "Es muss ein Standort gewählt werden!"),
                numberSize(this.state.amount, "Die Anzahl", 1)
            ),
            () => apiPost("/remedy/angebot", {
                artikel: {
                    id: this.state.article
                },
                anzahl: this.state.amount,
                standort: this.state.location,
                haltbarkeit: this.state.useBefore,
                steril: this.state.sterile,
                originalverpackt: this.state.sealed,
                medizinisch: this.state.medical,
                kommentar: this.state.comment
            }),
            initialState
        );
    };

    private onCancel = () => {
        this.setState({
            error: undefined
        });

        this.props.onCancelled();
    };

    private onCloseError = () => {
        this.setState({error: undefined});
    };

    private setCategory = (event: any, category: ArtikelKategorie | null) => {
        this.setState({category: category === null ? undefined : category.id});
    };

    private setArticle = (event: any, article: Artikel | null) => {
        this.setState({article: article === null ? undefined : article.id});
    };

    private setAmount = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        this.setState({amount: parseInt(event.target.value)});
    };

    private setLocation = (event: any, location: InstitutionStandort | null) => {
        this.setState({location: location === null ? undefined : location.id});
    };

    private setUseBefore = (useBefore: Date | null) => {
        this.setState({useBefore: useBefore === null ? undefined : useBefore});
    };

    private setComment = (event: ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({comment: event.target.value});
    };

    private setSterile = (event: any, sterile: boolean) => {
        this.setState({sterile});
    };

    private setSealed = (event: any, sealed: boolean) => {
        this.setState({sealed});
    };

    private setMedical = (event: any, medical: boolean) => {
        this.setState({medical});
    };

    private getCategoryOptions = () => {
        const result: ArtikelKategorie[] = [];
        this.props.artikel.forEach(artikel => {
            if (!result.find(ak => ak.id === artikel.artikelKategorie.id)) {
                result.push(artikel.artikelKategorie);
            }
        });
        return result;
    };

    private getArticleOptions = () => {
        return this.props.artikel.filter(artikel => artikel.artikelKategorie.id === this.state.category);
    };

    private getLocationOptions = () => {
        return ([] as InstitutionStandort[])
            .concat(this.props.institution?.hauptstandort || [])
            .concat(this.props.institution?.standorte || []);
    };

    public render = () => {
        const classes = this.props.classes!;
        const filterOptions = createFilterOptions<InstitutionStandort>({
            stringify: (option) => Object.values(option).join(" ")
        });

        return (
            <PopupDialog
                width="lg"
                open={this.props.open}
                title="Neues Angebot erstellen"
                firstTitle="Abbrechen"
                onFirst={this.onCancel}
                secondTitle="Speichern"
                onSecond={this.onSave}
                disabled={this.state.disabled}
                error={this.state.error}
                onCloseError={this.onCloseError}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Autocomplete
                        size="small"
                        onChange={this.setCategory}
                        options={this.getCategoryOptions()}
                        value={this.getCategoryOptions().find(c => c.id === this.state.category) || null}
                        disabled={this.state.disabled}
                        getOptionLabel={c => c.name}
                        className={classes.formRow}
                        classes={{listbox: classes.popup}}
                        disableClearable
                        renderInput={params => (
                            <TextField
                                {...params}
                                label="Kategorie"
                                variant="outlined"/>
                        )}
                    />
                    <Autocomplete
                        size="small"
                        onChange={this.setArticle}
                        options={this.getArticleOptions()}
                        value={this.getArticleOptions().find(n => n.id === this.state.article) || null}
                        disabled={this.state.disabled || !this.state.category}
                        disableClearable
                        getOptionLabel={a => a.name}
                        classes={{listbox: classes.popup}}
                        className={classes.formRow}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label="Artikel"
                                variant="outlined"/>
                        )}
                    />
                    <Typography variant="caption" className={classes.caption}>
                        Kategorie oder Name nicht gefunden? <a href="#">Vorschlagen</a>
                    </Typography>
                    <TextField
                        label="Anzahl"
                        type="number"
                        variant="outlined"
                        size="small"
                        disabled={this.state.disabled}
                        onChange={this.setAmount}
                        className={classes.formRow}
                        value={this.state.amount}/>
                    <Autocomplete
                        size="small"
                        onChange={this.setLocation}
                        options={this.getLocationOptions()}
                        classes={{listbox: classes.popup}}
                        value={this.getLocationOptions().find(l => l.id === this.state.location) || null}
                        disabled={this.state.disabled}
                        disableClearable
                        getOptionLabel={standort => standort.name}
                        filterOptions={filterOptions}
                        className={classes.formRow}
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
                                label="Standort"
                                variant="outlined"/>
                        )}
                    />
                    <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="dd.MM.yyyy"
                        disabled={this.state.disabled}
                        margin="normal"
                        label="Haltbarkeitsdatum"
                        value={this.state.useBefore}
                        className={classes.formRow}
                        onChange={this.setUseBefore}
                    />
                    <FormControlLabel
                        className={classes.formRow}
                        control={(
                            <Checkbox
                                disabled={this.state.disabled}
                                checked={this.state.sterile}
                                onChange={this.setSterile}
                            />
                        )}
                        label="Produkt ist steril"
                    />
                    <FormControlLabel
                        control={(
                            <Checkbox
                                disabled={this.state.disabled}
                                checked={this.state.sealed}
                                onChange={this.setSealed}
                            />
                        )}
                        label="Produkt ist originalverpackt"
                    />
                    <FormControlLabel
                        control={(
                            <Checkbox
                                disabled={this.state.disabled}
                                checked={this.state.medical}
                                onChange={this.setMedical}
                            />
                        )}
                        label="Produkt ist medizinisch"
                    />
                    <TextareaAutosize
                        rowsMin={3}
                        rowsMax={8}
                        placeholder="Kommentar"
                        value={this.state.comment}
                        disabled={this.state.disabled}
                        className={classes.comment}
                        onChange={this.setComment}/>
                </MuiPickersUtilsProvider>
            </PopupDialog>
        );
    };

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        if(!this.state.location && this.props.institution?.hauptstandort) {
            this.setState({
                location: this.props.institution!.hauptstandort!.id
            })
        }
    }
}

export default withStyles(styles)(AddOfferDialog);