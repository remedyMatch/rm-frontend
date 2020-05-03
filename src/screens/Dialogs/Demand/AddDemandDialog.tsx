import {TextareaAutosize, Typography} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import React, {useCallback, useMemo, useState} from "react";
import PopupDialog from "../../../components/Dialog/PopupDialog";
import FormAutocomplete from "../../../components/Form/FormAutocomplete";
import {FormNumberInput} from "../../../components/Form/FormNumberInput";
import {Artikel} from "../../../domain/artikel/Artikel";
import {ArtikelKategorie} from "../../../domain/artikel/ArtikelKategorie";
import {ArtikelVariante} from "../../../domain/artikel/ArtikelVariante";
import {apiPost} from "../../../util/ApiUtils";
import {defined, numberSize, stringLength, validate} from "../../../util/ValidationUtils";

interface Props {
    open: boolean;
    onCancelled: () => void;
    onSaved: () => void;

    artikel: Artikel[];
    artikelKategorien: ArtikelKategorie[];
}

const useStyles = makeStyles((theme: Theme) => ({
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
}));

const AddDemandDialog: React.FC<Props> = props => {
    const classes = useStyles();

    const {onSaved, onCancelled} = props;

    const [category, setCategory] = useState<ArtikelKategorie | undefined>(undefined);
    const [article, setArticle] = useState<Artikel | undefined>(undefined);
    const [variant, setVariant] = useState<ArtikelVariante | undefined>(undefined);
    const [amount, setAmount] = useState<number>(0);
    const [comment, setComment] = useState<string>("");

    const [disabled, setDisabled] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const onCloseError = useCallback(() => setError(undefined), []);

    const onSave = useCallback(async () => {
        const error = validate(
            defined(category, "Es muss eine Kategorie gewählt werden!"),
            defined(article, "Es muss ein Artikel gewählt werden!"),
            defined(variant, "Es muss eine Variante gewählt werden!"),
            stringLength(comment, "Der Kommentar", 1, 1024),
            numberSize(amount, "Die Anzahl", 1)
        );

        if (error) {
            setError(error);
            return;
        }

        setError(undefined);
        setDisabled(true);

        const result = await apiPost("/remedy/bedarf", {
            artikelId: article!.id,
            artikelVarianteId: variant!.id,
            anzahl: amount,
            steril: false,
            medizinisch: false,
            kommentar: comment
        });

        setDisabled(false);
        if (result.error) {
            setError(result.error);
        } else {
            setCategory(undefined);
            setArticle(undefined);
            setVariant(undefined);
            setAmount(0);
            setComment("");
            onSaved();
        }
    }, [onSaved, article, variant, amount, comment, category]);

    const onCancel = useCallback(() => {
        setError(undefined);
        onCancelled();
    }, [onCancelled]);

    const articleOptions = useMemo(
        () => props.artikel.filter(artikel => artikel.artikelKategorieId === category?.id),
        [props.artikel, category]
    );

    return (
        <PopupDialog
            width="lg"
            open={props.open}
            title="Neuen Bedarf erstellen"
            firstTitle="Abbrechen"
            onFirst={onCancel}
            secondTitle="Speichern"
            onSecond={onSave}
            disabled={disabled}
            error={error}
            onCloseError={onCloseError}>

            <FormAutocomplete
                onChange={setCategory}
                options={props.artikelKategorien}
                value={category}
                disabled={disabled}
                getOptionLabel={c => c.name}
                className={classes.formRow}
                label="Kategorie"/>

            <FormAutocomplete
                onChange={setArticle}
                options={articleOptions}
                value={category}
                disabled={disabled || !category}
                getOptionLabel={a => a.name}
                className={classes.formRow}
                label="Artikel"/>

            <FormAutocomplete
                onChange={setVariant}
                options={article?.varianten || []}
                value={variant}
                disabled={disabled || !category || !article}
                getOptionLabel={v => v.variante}
                className={classes.formRow}
                label="Variante"/>

            <Typography variant="caption" className={classes.caption}>
                <a href="https://remedymatch.io/#contact-anchor" target="_blank" rel="noopener noreferrer">
                    Kategorie oder Artikel nicht gefunden? Kontaktiere uns!
                </a>
            </Typography>

            <FormNumberInput
                label="Anzahl"
                disabled={disabled}
                onChange={setAmount}
                className={classes.formRow}
                value={amount}
                min={0}/>

            <TextareaAutosize
                rowsMin={3}
                rowsMax={8}
                placeholder="Kommentar"
                value={comment}
                disabled={disabled}
                className={classes.comment}
                onChange={e => setComment(e.target.value)}/>

        </PopupDialog>
    );
};

export default AddDemandDialog;