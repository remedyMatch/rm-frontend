import {Button} from "@material-ui/core";
import {makeStyles, Theme} from '@material-ui/core/styles';
import {Pagination} from "@material-ui/lab";
import clsx from "clsx";
import React, {useState} from 'react';
import {Angebot} from "../../domain/angebot/Angebot";
import {AngebotAnfrageStatus} from "../../domain/angebot/AngebotAnfrage";
import {Bedarf} from "../../domain/bedarf/Bedarf";
import {BedarfAnfrageStatus} from "../../domain/bedarf/BedarfAnfrage";
import RequestStatusBadge from "../Badge/RequestStatusBadge";

export type AdListDataRow = {
    id: string;
    icon: string;
    articleName: string;
    variantName?: string;
    categoryId: string;
    articleId: string;
    variantId: string;
    location: string;
    amount: number;
    comment: string;
    medical: boolean;
    sterile: boolean;
    sealed?: boolean;
    useBefore?: Date;
    type: "demand" | "offer";
    original: Angebot | Bedarf;
    requests: {
        id: string;
        amount: number;
        distance: number;
        institution: string;
        location: string;
        status: BedarfAnfrageStatus | AngebotAnfrageStatus;
    }[];
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
    resultItemWithRequests: {
        borderBottom: "2px solid #aabec6",
        borderBottomLeftRadius: "0px",
        borderBottomRightRadius: "0px"
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
        color: "rgba(0, 0, 0, 0.87)"
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
        marginTop: "4px",
        fontFamily: "Montserrat, sans-serif",
        fontSize: "16px",
        whiteSpace: "nowrap"
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
    buttonContainer: {
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
    },
    requestList: {
        display: "flex",
        flexDirection: "column",
        padding: "8px 0px"
    },
    requestListHeader: {
        padding: "8px 24px"
    },
    requestListHeaderMain: {
        fontFamily: "Montserrat, sans-serif",
        fontSize: "16px",
        fontWeight: 600
    },
    requestListHeaderHint: {
        fontFamily: "Montserrat, sans-serif",
        fontSize: "12px",
        color: "rgba(0, 0, 0, 0.54)",
        marginLeft: "16px"
    },
    requestItem: {
        cursor: "pointer",
        fontFamily: "Montserrat, sans-serif",
        fontSize: "16px",
        display: "flex",
        flexDirection: "row",
        padding: "8px 24px",
        transition: theme.transitions.create("background-color"),
        "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)"
        }
    },
    requestSender: {
        fontWeight: 600
    },
    requestDetails: {
        color: "rgba(0, 0, 0, 0.54)",
        marginLeft: "8px"
    }
}));

interface Props {
    className?: string;
    hidePagination?: boolean;
    results: AdListDataRow[];
    onEditButtonClicked: (entry: AdListDataRow) => void;
    onFindButtonClicked: (entry: AdListDataRow) => void;
}

const PAGE_SIZE = 5;

const AdList: React.FC<Props> = props => {
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
                        className={clsx(classes.resultItem, item.requests.length > 0 && classes.resultItemWithRequests)}>
                        <div className={classes.article}>
                            <img src={item.icon} alt="Kategorie" className={classes.articleIcon}/>
                            <span className={classes.articleName}>{item.articleName}</span>
                            {item.variantName && (
                                <span className={classes.variantName}>Gr. {item.variantName}</span>
                            )}
                        </div>
                        <div className={classes.details}>
                            <span className={classes.adType}>{item.type === "offer" ? "Angebot" : "Bedarf"}</span>
                            <span className={classes.location}>
                            {item.location}
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
                        <div className={classes.buttonContainer}>
                            <Button
                                onClick={() => props.onEditButtonClicked(item)}
                                disableElevation
                                className={classes.button}
                                variant="contained">
                                {item.type === "demand" ? "Bedarf bearbeiten" : "Angebot bearbeiten"}
                            </Button>
                            <Button
                                onClick={() => props.onFindButtonClicked(item)}
                                disableElevation
                                className={classes.button}
                                variant="contained">
                                {item.type === "demand" ? "Passende Angebote suchen" : "Passende Bedarfe suchen"}
                            </Button>
                        </div>
                    </div>
                    {item.requests.length > 0 && (
                        <div className={classes.requestList}>
                            <div className={classes.requestListHeader}>
                                <span className={classes.requestListHeaderMain}>
                                    {item.requests.length} offene Anfrage{item.requests.length > 1 ? "n" : ""}
                                </span>
                                <span className={classes.requestListHeaderHint}>
                                    Auf Anfrage klicken, um zur Konversation zu springen
                                </span>
                            </div>
                            {item.requests.map(request => (
                                <div className={classes.requestItem}>
                                    <RequestStatusBadge status={request.status} />
                                    <span className={classes.requestSender}>
                                        {request.institution}, {request.location}
                                    </span>
                                    <span className={classes.requestDetails}>
                                        ca. {request.distance} km entfernt; {request.amount} Stück
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            {!props.hidePagination && (
                <Pagination
                    color="secondary"
                    variant="outlined"
                    className={classes.pagination}
                    count={Math.ceil(props.results.length / PAGE_SIZE)}
                    page={pageIndex + 1}
                    onChange={(e, page) => setPageIndex(page - 1)}/>
            )}
        </div>
    );
};

export default AdList;
