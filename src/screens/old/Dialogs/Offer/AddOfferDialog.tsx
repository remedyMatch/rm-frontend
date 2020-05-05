import {TextareaAutosize, Typography} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {KeyboardDatePicker} from "@material-ui/pickers";
import React, {useCallback, useMemo, useState} from "react";
import PopupDialog from "../../../../components/Dialog/PopupDialog";
import FormAutocomplete from "../../../../components/Form/FormAutocomplete";
import {FormCheckbox} from "../../../../components/Form/FormCheckbox";
import {FormNumberInput} from "../../../../components/Form/FormNumberInput";
import {Artikel} from "../../../../domain/artikel/Artikel";
import {ArtikelKategorie} from "../../../../domain/artikel/ArtikelKategorie";
import {ArtikelVariante} from "../../../../domain/artikel/ArtikelVariante";
import {apiPost} from "../../../../util/ApiUtils";
import {defined, numberSize, stringLength, validate} from "../../../../util/ValidationUtils";

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
    },
    checkbox: {
        marginRight: "auto"
    }
}));

const AddOfferDialog: React.FC<Props> = props => {
    const classes = useStyles();

    const {onCancelled, onSaved} = props;

    const [category, setCategory] = useState<ArtikelKategorie | undefined>(undefined);
    const [article, setArticle] = useState<Artikel | undefined>(undefined);
    const [variant, setVariant] = useState<ArtikelVariante | undefined>(undefined);
    const [amount, setAmount] = useState<number>(0);
    const [useBefore, setUseBefore] = useState<Date | undefined>(undefined);
    const [sterile, setSterile] = useState<boolean>(false);
    const [sealed, setSealed] = useState<boolean>(false);
    const [medical, setMedical] = useState<boolean>(false);
    const [comment, setComment] = useState<string>("");

    const [disabled, setDisabled] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const onCloseError = useCallback(() => setError(undefined), []);

    const onSave = useCallback(async () => {
        const error = validate(
            defined(category, "Es muss eine Kategorie gewählt werden!"),
            defined(article, "Es muss ein Artikel gewählt werden!"),
            defined(variant, "Es muss eine Variante gewählt werden!"),
            numberSize(amount, "Die Anzahl", 1),
            stringLength(comment, "Der Kommentar", 1, 1024)
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
            kommentar: comment,
            haltbarkeit: useBefore,
            steril: sterile,
            medizinisch: medical,
            originalverpackt: sealed
        });

        setDisabled(false);
        if (result.error) {
            setError(result.error);
        } else {
            setCategory(undefined);
            setArticle(undefined);
            setVariant(undefined);
            setAmount(0);
            setUseBefore(undefined);
            setSterile(false);
            setSealed(false);
            setMedical(false);
            setComment("");
            onSaved();
        }
    }, [onSaved, article, variant, amount, comment, useBefore, sterile, medical, sealed, category]);

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

            <KeyboardDatePicker
                variant="inline"
                minDate={new Date()}
                format="dd.MM.yyyy"
                disabled={disabled}
                margin="normal"
                label="Haltbarkeitsdatum"
                inputVariant="outlined"
                value={useBefore}
                size="small"
                className={classes.formRow}
                onChange={setUseBefore}
            />

            <FormCheckbox
                className={classes.checkbox}
                disabled={disabled}
                checked={sterile}
                onChange={setSterile}
                label="Produkt ist steril"
            />

            <FormCheckbox
                className={classes.checkbox}
                disabled={disabled}
                checked={sealed}
                onChange={setSealed}
                label="Produkt ist originalverpackt"
            />

            <FormCheckbox
                className={classes.checkbox}
                disabled={disabled || !variant?.medizinischAuswaehlbar}
                checked={(medical && variant?.medizinischAuswaehlbar) || false}
                onChange={setMedical}
                label="Produkt ist medizinisch"
            />

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

export default AddOfferDialog;