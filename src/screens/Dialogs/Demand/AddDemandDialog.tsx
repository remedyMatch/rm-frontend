import React, {ChangeEvent, PureComponent} from "react";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    TextareaAutosize,
    TextField,
    Typography
} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";
import {WithStylesPublic} from "../../../util/WithStylesPublic";
import ErrorToast from "../../../components/ErrorToast";
import {Artikel} from "../../../Domain/Artikel";
import {ArtikelKategorie} from "../../../Domain/ArtikelKategorie";
import {apiPost} from "../../../util/ApiUtils";
import {handleDialogButton} from "../../../util/DialogUtils";
import {defined, numberSize, validate} from "../../../util/ValidationUtils";
import PopupDialog from "../../../components/PopupDialog";

interface Props extends WithStylesPublic<typeof styles> {
    open: boolean;
    onCancelled: () => void;
    onSaved: () => void;
    artikel: Artikel[];
}

interface State {
    category?: string;
    article?: string;
    amount: number;
    location: string;
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
    location: "",
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
        }
    });

class AddDemandDialog extends PureComponent<Props, State> {
    state: State = {...initialState};

    private onSave = async () => {
        handleDialogButton(
            this.setState,
            this.props.onSaved,
            () => validate(
                defined(this.state.category, "Es muss eine Kategorie gewählt werden!"),
                defined(this.state.article, "Es muss ein Artikel gewählt werden!"),
                numberSize(this.state.amount, "Die Anzahl", 1)
            ),
            () => apiPost("/remedy/bedarf", {
                artikel: {
                    id: this.state.article
                },
                anzahl: this.state.amount,
                standort: this.state.location,
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

    private setLocation = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        this.setState({location: event.target.value});
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
                    disabled={this.state.disabled || this.state.category === null}
                    disableClearable
                    getOptionLabel={a => a.name}
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
                    disabled={this.state.disabled}
                    onChange={this.setAmount}
                    className={classes.formRow}
                    value={this.state.amount}/>
                <TextField
                    label="Standort"
                    onChange={this.setLocation}
                    disabled={this.state.disabled}
                    className={classes.formRow}
                    value={this.state.location}/>
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
            </PopupDialog>
        );
    };
}

export default withStyles(styles)(AddDemandDialog);