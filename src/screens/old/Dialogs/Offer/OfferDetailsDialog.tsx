import {Typography} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {format} from "date-fns";
import {de} from "date-fns/locale";
import React from "react";
import PopupDialog from "../../../../components/Dialog/PopupDialog";
import {FormButton} from "../../../../components/Form/FormButton";
import {Angebot} from "../../../../domain/angebot/Angebot";
import {Artikel} from "../../../../domain/artikel/Artikel";
import {ArtikelKategorie} from "../../../../domain/artikel/ArtikelKategorie";

interface Props {
    open: boolean;
    onContact?: () => void;
    onDone: () => void;

    angebot?: Angebot;
    artikel: Artikel[];
    artikelKategorien: ArtikelKategorie[];
}

const useStyles = makeStyles((theme: Theme) => ({
    row: {
        display: "flex"
    },
    left: {
        width: "180px",
        textAlign: "right",
        fontWeight: 300,
        padding: "4px 16px",
        fontStyle: "italic"
    },
    right: {
        padding: "4px 16px",
        width: "calc(100% - 180px)"
    },
    subtitle: {
        fontWeight: 500,
        marginTop: "16px",
        marginLeft: "196px"
    },
    title: {
        textAlign: "center"
    },
    footer: {
        marginTop: "32px",
        display: "flex",
        justifyContent: "center"
    },
    emptyPlaceholder: {
        fontStyle: "italic"
    }
}));

const formatDate = (date?: string) => {
    if (!date) {
        return "Nicht angegeben";
    }

    const createdAt = new Date(date);
    return format(createdAt, "dd.MM.yy", {locale: de});
};

const OfferDetailsDialog: React.FC<Props> = props => {
    const classes = useStyles();

    const category = props.artikelKategorien.find(kategorie => kategorie.id === props.angebot?.artikel?.artikelKategorieId);
    const variant = props.angebot?.artikel.varianten.find(variant => variant.id === props.angebot?.artikelVarianteId);

    return (
        <PopupDialog
            width="lg"
            open={props.open}
            title="Bedarfsdetails"
            firstTitle="Fertig"
            onFirst={props.onDone}>
            <Typography variant="subtitle1" className={classes.subtitle}>Benötigter Artikel</Typography>
            <div className={classes.row}>
                <span className={classes.left}>Kategorie</span>
                <span className={classes.right}>{category?.name}</span>
            </div>
            <div className={classes.row}>
                <span className={classes.left}>Artikel</span>
                <span className={classes.right}>{props.angebot?.artikel?.name}</span>
            </div>
            <div className={classes.row}>
                <span className={classes.left}>Beschreibung</span>
                <span className={classes.right}>{props.angebot?.artikel?.beschreibung}</span>
            </div>
            <Typography variant="subtitle1" className={classes.subtitle}>Benötigte Variante</Typography>
            <div className={classes.row}>
                <span className={classes.left}>Name</span>
                <span className={classes.right}>{variant?.variante}</span>
            </div>
            <div className={classes.row}>
                <span className={classes.left}>Beschreibung</span>
                <span className={classes.right}>{variant?.beschreibung}</span>
            </div>
            <div className={classes.row}>
                <span className={classes.left}>Norm</span>
                <span className={classes.right}>{variant?.norm}</span>
            </div>
            <Typography variant="subtitle1" className={classes.subtitle}>Weitere Details</Typography>
            <div className={classes.row}>
                <span className={classes.left}>Standort</span>
                <span className={classes.right}>{props.angebot?.ort}</span>
            </div>
            <div className={classes.row}>
                <span className={classes.left}>Anzahl</span>
                <span className={classes.right}>{props.angebot?.verfuegbareAnzahl}</span>
            </div>
            <div className={classes.row}>
                <span className={classes.left}>Haltbar bis</span>
                <span className={classes.right}>{formatDate(props.angebot?.haltbarkeit)}</span>
            </div>
            <div className={classes.row}>
                <span className={classes.left}>Medizinisch</span>
                <span className={classes.right}>{props.angebot?.medizinisch ? "Ja" : "Nein"}</span>
            </div>
            <div className={classes.row}>
                <span className={classes.left}>Steril</span>
                <span className={classes.right}>{props.angebot?.steril ? "Ja" : "Nein"}</span>
            </div>
            <div className={classes.row}>
                <span className={classes.left}>Originalverpackt</span>
                <span className={classes.right}>{props.angebot?.originalverpackt ? "Ja" : "Nein"}</span>
            </div>
            <div className={classes.row}>
                <span className={classes.left}>Kommentar</span>
                <span className={classes.right}>
                    {props.angebot?.kommentar ||
                    <span className={classes.emptyPlaceholder}>Keiner</span>}
                </span>
            </div>
            {props.onContact && (
                <div className={classes.footer}>
                    <FormButton
                        onClick={props.onContact}
                        size="small">
                        Institution kontaktieren
                    </FormButton>
                </div>
            )}
        </PopupDialog>
    );
};

export default OfferDetailsDialog;