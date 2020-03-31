import React, {ChangeEvent, PureComponent} from "react";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {TextareaAutosize, TextField, Typography} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";
import {WithStylesPublic} from "../../../util/WithStylesPublic";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import {Artikel} from "../../../Domain/Artikel";
import {ArtikelKategorie} from "../../../Domain/ArtikelKategorie";
import {apiPost} from "../../../util/ApiUtils";
import PopupDialog from "../../../components/Dialog/PopupDialog";
import {handleDialogButton} from "../../../util/DialogUtils";
import {defined, numberSize, validate} from "../../../util/ValidationUtils";
import {Institution} from "../../../Domain/Institution";
import {InstitutionStandort} from "../../../Domain/InstitutionStandort";
import {de} from "date-fns/locale";
import {FormLocationPicker} from "../../../components/Form/FormLocationPicker";
import {FormCheckbox} from "../../../components/Form/FormCheckbox";

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
            marginTop: "16px",
            transitions: theme.transitions.create(["border-color"])
        },
        comment: {
            marginTop: "16px",
            resize: "none",
            fontSize: "14px",
            padding: "16px",
            borderRadius: "4px",
            border: "1px solid rgba(0,0,0,0.23)",
            "&:hover": {
                border: "1px solid black"
            },
            "&:focus": {
                outline: "none",
                border: "2px solid " + theme.palette.primary.main
            }
        },
        caption: {
            textAlign: "right",
            marginTop: "8px"
        },
        popup: {
            border: "1px solid #CCC",
            borderRadius: "4px",
            backgroundColor: "#FCFCFC"
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
                standort: {
                    id: this.state.location
                },
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

    private setLocation = (location: InstitutionStandort | null) => {
        this.setState({location: location === null ? undefined : location.id});
    };

    private setUseBefore = (useBefore: Date | null) => {
        this.setState({useBefore: useBefore === null ? undefined : useBefore});
    };

    private setComment = (event: ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({comment: event.target.value});
    };

    private setSterile = (sterile: boolean) => {
        this.setState({sterile});
    };

    private setSealed = (sealed: boolean) => {
        this.setState({sealed});
    };

    private setMedical = (medical: boolean) => {
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
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={de}>
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
                        Kategorie oder Artikel nicht gefunden? Schreib uns eine E-Mail!
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
                    <FormLocationPicker
                        options={this.getLocationOptions()}
                        onSelect={this.setLocation}
                        className={classes.formRow}
                        disabled={this.state.disabled}
                        valueId={this.state.location}/>
                    <DatePicker
                        variant="inline"
                        format="dd.MM.yyyy"
                        disabled={this.state.disabled}
                        margin="normal"
                        label="Haltbarkeitsdatum"
                        inputVariant="outlined"
                        value={this.state.useBefore}
                        size="small"
                        className={classes.formRow}
                        onChange={this.setUseBefore}
                    />
                    <FormCheckbox
                        disabled={this.state.disabled}
                        checked={this.state.sterile}
                        onChange={this.setSterile}
                        label="Produkt ist steril"
                    />
                    <FormCheckbox
                        disabled={this.state.disabled}
                        checked={this.state.sealed}
                        onChange={this.setSealed}
                        label="Produkt ist originalverpackt"
                    />
                    <FormCheckbox
                        disabled={this.state.disabled}
                        checked={this.state.medical}
                        onChange={this.setMedical}
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
        if (!this.state.location && this.props.institution?.hauptstandort) {
            this.setState({
                location: this.props.institution!.hauptstandort!.id
            })
        }
    }
}

export default withStyles(styles)(AddOfferDialog);