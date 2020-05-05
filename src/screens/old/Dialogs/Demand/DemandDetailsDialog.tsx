import {Typography} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import React from "react";
import PopupDialog from "../../../../components/Dialog/PopupDialog";
import {FormButton} from "../../../../components/Form/old/FormButton";
import {Artikel} from "../../../../domain/artikel/Artikel";
import {ArtikelKategorie} from "../../../../domain/artikel/ArtikelKategorie";
import {Bedarf} from "../../../../domain/bedarf/Bedarf";

interface Props {
    open: boolean;
    onContact?: () => void;
    onDone: () => void;

    bedarf?: Bedarf;
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

const DemandDetailsDialog: React.FC<Props> = props => {
    const classes = useStyles();

    const category = props.artikelKategorien.find(kategorie => kategorie.id === props.bedarf?.artikelKategorieId);
    const article = props.artikel.find(artikel => artikel.id === props.bedarf?.artikelId);
    const variant = article?.varianten?.find(variant => variant.id === props.bedarf?.artikelVarianteId);

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
                <span className={classes.right}>{article?.name}</span>
            </div>
            <div className={classes.row}>
                <span className={classes.left}>Beschreibung</span>
                <span className={classes.right}>{article?.beschreibung}</span>
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
                <span className={classes.right}>{props.bedarf?.ort}</span>
            </div>
            <div className={classes.row}>
                <span className={classes.left}>Anzahl</span>
                <span className={classes.right}>{props.bedarf?.verfuegbareAnzahl}</span>
            </div>
            <div className={classes.row}>
                <span className={classes.left}>Kommentar</span>
                <span className={classes.right}>
                    {props.bedarf?.kommentar ||
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

export default DemandDetailsDialog;