import {Button} from "@material-ui/core";
import {makeStyles, Theme} from '@material-ui/core/styles';
import {Pagination} from "@material-ui/lab";
import React, {useState} from 'react';
import {Angebot} from "../../domain/angebot/Angebot";
import {Bedarf} from "../../domain/bedarf/Bedarf";
import distance from "../../resources/distance.svg";

export type ResultListDataRow = {
    id: string;
    icon: string;
    articleName: string;
    variantName?: string;
    location: string;
    distance: number;
    amount: number;
    comment: string;
    medical: boolean;
    sterile: boolean;
    sealed?: boolean;
    useBefore?: Date;
    type: "demand" | "offer";
    original: Angebot | Bedarf;
    buttonText?: string;
};

const useStyles = makeStyles((theme: Theme) => ({
    resultItem: {
        borderRadius: "8px",
        boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
        border: "2px solid #aabec6",
        marginTop: "2em",
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
        "&:hover": {
            backgroundColor: "#006374"
        }
    },
    article: {
        width: "200px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        flexShrink: 0
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
    details: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        margin: "0px 4em"
    },
    location: {
        fontFamily: "Montserrat, sans-serif",
        fontSize: "18px",
        fontWeight: 600,
        whiteSpace: "nowrap"
    },
    distance: {
        display: "flex",
        marginTop: "8px",
        fontFamily: "Montserrat, sans-serif",
        fontSize: "12px",
        color: "#333",
        whiteSpace: "nowrap"
    },
    distanceIcon: {
        height: "15px",
        width: "15px",
        color: "#666",
        marginRight: "4px"
    },
    amount: {
        marginTop: "4px",
        fontFamily: "Montserrat, sans-serif",
        fontSize: "12px",
        color: "#007c92",
        whiteSpace: "nowrap"
    },
    amountCount: {
        fontFamily: "Montserrat, sans-serif",
        fontSize: "12px",
        backgroundColor: "#007c92",
        fontWeight: 600,
        borderRadius: "12px",
        padding: "0px 4px",
        color: "white",
        marginRight: "8px"
    },
    commentContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        marginRight: "4em",
        flexGrow: 1
    },
    comment: {
        padding: "1em 0em",
        fontFamily: "Montserrat, sans-serif",
        fontSize: "16px",
        fontStyle: "italic",
        whiteSpace: "pre-line"
    },
    contactContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    },
    pagination: {
        justifyContent: "center",
        display: "flex",
        margin: "2em"
    },
    attributes: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap"
    },
    attribute: {
        color: "white",
        backgroundColor: "#007C92",
        borderRadius: "4px",
        padding: "2px 4px",
        fontFamily: "Montserrat, sans-serif",
        fontSize: "12px",
        fontWeight: 600,
        marginRight: "0.5em",
        marginBottom: "0.5em",
        whiteSpace: "nowrap"
    }
}));

interface Props {
    className?: string;
    results: ResultListDataRow[];
    onButtonClicked: (entry: ResultListDataRow) => void;
}

const PAGE_SIZE = 5;

const ResultList: React.FC<Props> = props => {
    const classes = useStyles();

    const [pageIndex, setPageIndex] = useState(0);

    if (props.results.length === 0) {
        return <div className={props.className}/>;
    }

    const items = props.results.slice(pageIndex * PAGE_SIZE, pageIndex * PAGE_SIZE + PAGE_SIZE);

    return (
        <div className={props.className}>
            {items.map(item => (
                <div className={classes.resultItem}>
                    <div className={classes.article}>
                        <img src={item.icon} alt="Kategorie" className={classes.articleIcon}/>
                        <span className={classes.articleName}>{item.articleName}</span>
                        {item.variantName && (
                            <span className={classes.variantName}>Gr. {item.variantName}</span>
                        )}
                    </div>
                    <div className={classes.details}>
                        <span className={classes.location}>
                            {item.location}
                        </span>
                        <span className={classes.distance}>
                            <img src={distance} alt="Entfernung" className={classes.distanceIcon}/>
                            ca. {item.distance.toFixed()} km entfernt
                        </span>
                        <span className={classes.amount}>
                            <span className={classes.amountCount}>{item.amount}</span>
                            verfügbar
                        </span>
                    </div>
                    <div className={classes.commentContainer}>
                        <span className={classes.comment}>
                            "{item.comment}"
                        </span>
                        <span className={classes.attributes}>
                            {[
                                item.medical && "Medizinisch",
                                item.sterile && "Steril",
                                item.sealed && "Originalverpackt",
                                item.useBefore && "MHD " + item.useBefore.toLocaleDateString('de-DE', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: '2-digit'
                                })
                            ].filter(e => !!e).map(entry => (
                                <span className={classes.attribute}>{entry}</span>
                            ))}
                        </span>
                    </div>
                    {item.buttonText && (
                        <div className={classes.contactContainer}>
                            <Button
                                onClick={() => props.onButtonClicked(item)}
                                disableElevation
                                className={classes.button}
                                variant="contained">
                                {item.buttonText}
                            </Button>
                        </div>
                    )}
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

export default ResultList;
