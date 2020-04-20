import DateFnsUtils from '@date-io/date-fns';
import {TextareaAutosize, TextField, Typography} from "@material-ui/core";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {Autocomplete} from "@material-ui/lab";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import {de} from "date-fns/locale";
import React, {ChangeEvent, PureComponent} from "react";
import PopupDialog from "../../../components/Dialog/PopupDialog";
import {FormCheckbox} from "../../../components/Form/FormCheckbox";
import {FormLocationPicker} from "../../../components/Form/FormLocationPicker";
import {Artikel} from "../../../Domain/Artikel";
import {ArtikelKategorie} from "../../../Domain/ArtikelKategorie";
import {ArtikelVariante} from "../../../Domain/ArtikelVariante";
import {Institution} from "../../../Domain/Institution";
import {InstitutionStandort} from "../../../Domain/InstitutionStandort";
import {apiPost} from "../../../util/ApiUtils";
import {handleDialogButton} from "../../../util/DialogUtils";
import {defined, numberSize, stringLength, validate} from "../../../util/ValidationUtils";
import {WithStylesPublic} from "../../../util/WithStylesPublic";

interface Props extends WithStylesPublic<typeof styles> {
    open: boolean;
    onCancelled: () => void;
    onSaved: () => void;
    artikel: Artikel[];
    artikelKategorien: ArtikelKategorie[];
    institution?: Institution;
}

interface State {
    category?: string;
    article?: string;
    articleVariant?: string;
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
    articleVariant: undefined,
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
        },
        checkbox: {
            marginRight: "auto"
        }
    });

class AddOfferDialog extends PureComponent<Props, State> {
    state: State = {...initialState};

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
                    <Autocomplete
                        size="small"
                        onChange={this.setArticleVariant}
                        options={this.getArticleVariantOptions()}
                        value={this.getArticleVariantOptions().find(n => n.id === this.state.articleVariant) || null}
                        disabled={this.state.disabled || !this.state.category || !this.state.article}
                        disableClearable
                        getOptionLabel={a => a.variante}
                        classes={{listbox: classes.popup}}
                        className={classes.formRow}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label="Variante"
                                variant="outlined"/>
                        )}
                    />
                    <Typography variant="caption" className={classes.caption}>
                        <a href="https://remedymatch.io/#contact-anchor" target="_blank">
                            Kategorie oder Artikel nicht gefunden? Kontaktiere uns!
                        </a>
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
                    <KeyboardDatePicker
                        variant="inline"
                        minDate={new Date()}
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
                        className={classes.checkbox}
                        disabled={this.state.disabled}
                        checked={this.state.sterile}
                        onChange={this.setSterile}
                        label="Produkt ist steril"
                    />
                    <FormCheckbox
                        className={classes.checkbox}
                        disabled={this.state.disabled}
                        checked={this.state.sealed}
                        onChange={this.setSealed}
                        label="Produkt ist originalverpackt"
                    />
                    <FormCheckbox
                        className={classes.checkbox}
                        disabled={this.state.disabled || !this.getArticleVariantOptions().find(n => n.id === this.state.articleVariant)?.medizinischAuswaehlbar}
                        checked={(this.state.medical && this.getArticleVariantOptions().find(n => n.id === this.state.articleVariant)?.medizinischAuswaehlbar) || false}
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

    private onSave = async () => {
        handleDialogButton(
            this.setState.bind(this),
            this.props.onSaved,
            () => validate(
                defined(this.state.category, "Es muss eine Kategorie gewählt werden!"),
                defined(this.state.article, "Es muss ein Artikel gewählt werden!"),
                defined(this.state.articleVariant, "Es muss eine Variante gewählt werden!"),
                defined(this.state.location, "Es muss ein Standort gewählt werden!"),
                stringLength(this.state.comment, "Der Kommentar", 1),
                numberSize(this.state.amount, "Die Anzahl", 1)
            ),
            () => apiPost("/remedy/angebot", {
                artikelVarianteId: this.state.articleVariant,
                anzahl: this.state.amount,
                standortId: this.state.location,
                haltbarkeit: this.state.useBefore,
                steril: this.state.sterile,
                originalverpackt: this.state.sealed,
                medizinisch: (this.getArticleVariantOptions().find(n => n.id === this.state.articleVariant)?.medizinischAuswaehlbar && this.state.medical) || false,
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

    private setArticleVariant = (event: any, articleVariant: ArtikelVariante | null) => {
        this.setState({articleVariant: articleVariant === null ? undefined : articleVariant.id});
    };

    private setAmount = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const amount = parseFloat(event.target.value);

        if (event.target.value.length > 0 && isNaN(amount)) {
            return;
        }

        this.setState({amount: amount});
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
        return this.props.artikelKategorien;
    };

    private getArticleOptions = () => {
        return this.props.artikel.filter(artikel => artikel.artikelKategorieId === this.state.category);
    };

    private getArticleVariantOptions = () => {
        return this.props.artikel.find(artikel => artikel.id === this.state.article)?.varianten || [];
    };

    private getLocationOptions = () => {
        return ([] as InstitutionStandort[])
            .concat(this.props.institution?.hauptstandort || [])
            .concat(this.props.institution?.standorte || []);
    };
}

export default withStyles(styles)(AddOfferDialog);