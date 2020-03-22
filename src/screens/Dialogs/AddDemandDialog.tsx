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
import {WithStylesPublic} from "../../util/WithStylesPublic";
import ErrorToast from "../../components/ErrorToast";
import {Artikel} from "../../Model/Artikel";
import {ArtikelKategorie} from "../../Model/ArtikelKategorie";
import {apiPost} from "../../util/ApiUtils";

interface Props extends WithStylesPublic<typeof styles> {
    open: boolean;
    onCancelled: () => void;
    onSaved: () => void;
    artikel: Artikel[];
}

interface State {
    category: string | null;
    article: string | null;
    amount: number;
    location: string;
    comment: string;
    sterile: boolean;
    sealed: boolean;
    medical: boolean;
    disabled: boolean;
    error?: string;
}

const styles = (theme: Theme) =>
    createStyles({
        content: {
            width: "40vw",
            paddingBottom: "16px",
            display: "flex",
            flexDirection: "column"
        },
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

class StockScreen extends PureComponent<Props, State> {
    state: State = {
        category: null,
        article: null,
        amount: 0,
        location: "",
        comment: "",
        sterile: false,
        sealed: false,
        medical: false,
        disabled: false
    };

    private onSave = async () => {
        if (this.state.category === null) {
            this.setState({error: "Es muss eine Kategorie gewählt werden"});
            return;
        }

        if (this.state.article === null) {
            this.setState({error: "Es muss ein Artikel gewählt werden"});
            return;
        }

        if (this.state.amount <= 0) {
            this.setState({error: "Die benötigte Anzahl muss größer 0 sein"});
            return;
        }

        this.setState({
            disabled: true,
            error: undefined
        });

        const result = await apiPost("/remedy/bedarf", {
            artikel: {
                id: this.state.article
            },
            anzahl: this.state.amount,
            standort: this.state.location,
            steril: this.state.sterile,
            originalverpackt: this.state.sealed,
            medizinisch: this.state.medical,
            kommentar: this.state.comment
        });

        if (result.error) {
            this.setState({
                disabled: false,
                error: "Erstellung des Bedarfs fehlgeschlagen: " + result.error
            });
            return;
        }

        this.setState({
            category: null,
            article: null,
            amount: 0,
            location: "",
            comment: "",
            sterile: false,
            sealed: false,
            medical: false,
            disabled: false
        });

        this.props.onSaved();
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
        this.setState({category: category === null ? null : category.id});
    };

    private setArticle = (event: any, article: Artikel | null) => {
        this.setState({article: article === null ? null : article.id});
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
            <Dialog
                maxWidth="lg"
                open={this.props.open}
                onClose={this.onCancel}>
                <DialogTitle>Neuen Bedarf erstellen</DialogTitle>
                <DialogContent>
                    <div className={classes.content}>
                        <ErrorToast error={this.state.error} onClose={this.onCloseError}/>
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
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.onCancel} color="secondary">
                        Abbrechen
                    </Button>
                    <Button onClick={this.onSave} color="secondary">
                        Speichern
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };
}

export default withStyles(styles)(StockScreen);