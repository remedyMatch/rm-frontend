import React, {ChangeEvent, PureComponent} from "react";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {TextareaAutosize, TextField, Typography} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";
import {ArtikelVariante} from "../../../domain/old/ArtikelVariante";
import {WithStylesPublic} from "../../../util/WithStylesPublic";
import {Artikel} from "../../../domain/old/Artikel";
import {ArtikelKategorie} from "../../../domain/old/ArtikelKategorie";
import {apiPost} from "../../../util/ApiUtils";
import {handleDialogButton} from "../../../util/DialogUtils";
import {defined, numberSize, stringLength, validate} from "../../../util/ValidationUtils";
import PopupDialog from "../../../components/Dialog/PopupDialog";
import {FormLocationPicker} from "../../../components/Form/FormLocationPicker";
import {InstitutionStandort} from "../../../domain/old/InstitutionStandort";
import {Institution} from "../../../domain/old/Institution";

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
    comment: string;
    disabled: boolean;
    error?: string;
}

const initialState = {
    category: undefined,
    article: undefined,
    articleVariant: undefined,
    amount: 0,
    location: undefined,
    comment: "",
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
        popup: {
            border: "1px solid #CCC",
            borderRadius: "4px",
            backgroundColor: "#FCFCFC"
        }
    });

class AddDemandDialog extends PureComponent<Props, State> {
    state: State = {...initialState};

    private onSave = async () => {
        handleDialogButton(
            this.setState.bind(this),
            this.props.onSaved,
            () => validate(
                defined(this.state.category, "Es muss eine Kategorie gewählt werden!"),
                defined(this.state.article, "Es muss ein Artikel gewählt werden!"),
                defined(this.state.articleVariant, "Es muss eine Variante gewählt werden!"),
                defined(this.state.location, "Es muss ein Standort gewählt werden!"),
                stringLength(this.state.comment, "Der Kommentar", 1, 1024),
                numberSize(this.state.amount, "Die Anzahl", 1)
            ),
            () => apiPost("/remedy/bedarf", {
                artikelId: this.state.article,
                artikelVarianteId: this.state.articleVariant,
                anzahl: this.state.amount,
                standortId: this.state.location,
                steril: false,
                medizinisch: false,
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
        if(event.target.value.length > 0 && isNaN(amount)) {
            return;
        }

        this.setState({amount: amount});
    };

    private setLocation = (location: InstitutionStandort | null) => {
        this.setState({location: location === null ? undefined : location.id});
    };

    private setComment = (event: ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({comment: event.target.value});
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

    public render = () => {
        const classes = this.props.classes!;

        return (
            <PopupDialog
                width="lg"
                open={this.props.open}
                title="Neuen Bedarf erstellen"
                firstTitle="Abbrechen"
                onFirst={this.onCancel}
                secondTitle="Speichern"
                onSecond={this.onSave}
                disabled={this.state.disabled}
                error={this.state.error}
                onCloseError={this.onCloseError}>
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
                <TextareaAutosize
                    rowsMin={3}
                    rowsMax={8}
                    placeholder="Kommentar"
                    value={this.state.comment}
                    disabled={this.state.disabled}
                    className={classes.comment}
                    onChange={this.setComment}/>
            </PopupDialog>
        );
    };
}

export default withStyles(styles)(AddDemandDialog);