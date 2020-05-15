import {Button, capitalize} from "@material-ui/core";
import {makeStyles, Theme} from '@material-ui/core/styles';
import {Pagination} from "@material-ui/lab";
import React, {useState} from 'react';
import {Match} from "../../domain/match/Match";
import countries from "../../resources/countries.json";

export type MatchListDataRow = {
    icon: string;
    original: Match;
    conversationId?: string;
};

const useStyles = makeStyles((theme: Theme) => ({
    resultItemWrapper: {
        borderRadius: "8px",
        boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
        border: "2px solid #aabec6",
        marginTop: "2em",
        display: "flex",
        flexDirection: "column"
    },
    resultItem: {
        borderRadius: "8px",
        display: "flex",
        flexDirection: "row",
        padding: "16px 24px"
    },
    button: {
        fontFamily: "Montserrat, sans-serif",
        fontWeight: 600,
        textTransform: "none",
        padding: "8px 24px",
        transition: theme.transitions.create(["border", "color", "background-color"]),
        height: "48px",
        minWidth: "144px",
        backgroundColor: "#007C92",
        color: "white",
        whiteSpace: "nowrap",
        margin: "8px 0px",
        "&:hover": {
            backgroundColor: "#006374"
        }
    },
    adType: {
        fontFamily: "Montserrat, sans-serif",
        fontSize: "20px",
        fontWeight: 600,
        color: "rgba(0, 0, 0, 0.87)",
        textAlign: "center",
        marginBottom: "8px"
    },
    article: {
        width: "200px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        flexShrink: 0,
        marginRight: "auto"
    },
    articleIcon: {
        height: "4em",
        color: "#333",
        marginBottom: "1em"
    },
    articleName: {
        textAlign: "center",
        fontFamily: "Montserrat, sans-serif",
        fontSize: "16px",
        fontWeight: 600,
        color: "#666"
    },
    variantName: {
        textAlign: "center",
        fontFamily: "Montserrat, sans-serif",
        fontSize: "16px",
        fontWeight: 600,
        color: "#666"
    },
    locationColumn: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        margin: "0px 4em"
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        marginLeft: "auto"
    },
    pagination: {
        justifyContent: "center",
        display: "flex",
        margin: "2em"
    },
    locationDetails: {
        fontFamily: "Montserrat, sans-serif",
        color: "rgba(0, 0, 0, 0.87)",
        textAlign: "center",
        fontSize: "14px"
    },
    locationHeading: {
        fontFamily: "Montserrat, sans-serif",
        fontSize: "16px",
        fontWeight: 600,
        textAlign: "center"
    }
}));

interface Props {
    className?: string;
    results: MatchListDataRow[];
    onOpenConversationClicked: (entry: MatchListDataRow) => void;
}

const PAGE_SIZE = 5;

const MatchList: React.FC<Props> = props => {
    const classes = useStyles();

    const [pageIndex, setPageIndex] = useState(0);

    if (props.results.length === 0) {
        return <div className={props.className}/>;
    }

    const items = props.results.slice(pageIndex * PAGE_SIZE, pageIndex * PAGE_SIZE + PAGE_SIZE);

    return (
        <div className={props.className}>
            {items.map(item => (
                <div className={classes.resultItemWrapper}>
                    <div
                        className={classes.resultItem}>
                        <div className={classes.article}>
                            <span className={classes.adType}>{capitalize(item.original.inseratTyp.toLowerCase())}</span>
                            <img src={item.icon} alt="Kategorie" className={classes.articleIcon}/>
                            <span className={classes.articleName}>{item.original.artikel.name}</span>
                            {item.original.artikel.varianten.length > 1 && (
                                <span
                                    className={classes.variantName}>Gr. {item.original.artikel.varianten?.find(v => v.id === item.original.artikelVarianteId)?.variante}</span>
                            )}
                        </div>
                        <div className={classes.locationColumn}>
                            <span className={classes.locationHeading}>Von</span>
                            <span className={classes.locationDetails}>
                                    {item.original.standortVon.name}
                                </span>
                            <span className={classes.locationDetails}>
                                    {item.original.standortVon.strasse} {item.original.standortVon.hausnummer}
                                </span>
                            <span className={classes.locationDetails}>
                                    {item.original.standortVon.plz} {item.original.standortVon.ort}
                                </span>
                            <span className={classes.locationDetails}>
                                    {countries.DE[item.original.standortVon.land as keyof typeof countries.DE]}
                                </span>
                        </div>
                        <div className={classes.locationColumn}>
                            <span className={classes.locationHeading}>An</span>
                            <span className={classes.locationDetails}>
                                    {item.original.standortAn.name}
                                </span>
                            <span className={classes.locationDetails}>
                                    {item.original.standortAn.strasse} {item.original.standortAn.hausnummer}
                                </span>
                            <span className={classes.locationDetails}>
                                    {item.original.standortAn.plz} {item.original.standortAn.ort}
                                </span>
                            <span className={classes.locationDetails}>
                                    {countries.DE[item.original.standortAn.land as keyof typeof countries.DE]}
                                </span>
                        </div>
                        <div className={classes.buttonContainer}>
                            <Button
                                onClick={() => props.onOpenConversationClicked(item)}
                                disableElevation
                                className={classes.button}
                                variant="contained">
                                Konversation öffnen
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
            <Pagination
                color="secondary"
                variant="outlined"
                className={classes.pagination}
                count={Math.ceil(props.results.length / PAGE_SIZE)}
                page={pageIndex + 1}
                onChange={(e, page) => setPageIndex(page - 1)}/>
        </div>
    );
};

export default MatchList;
