import {capitalize} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {LocationCity, LocationOn, Person} from "@material-ui/icons";
import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useRouteMatch} from "react-router-dom";
import ContentCard from "../../components/Content/ContentCard";
import LinkCard from "../../components/Content/LinkCard";
import {loadInstitutionAntraege} from "../../state/institution/InstitutionAntraegeState";
import {RootState} from "../../state/Store";
import RequestLocationDialog from "./RequestLocationDialog";

const useStyles = makeStyles((theme: Theme) => ({
    cardColumnContainer: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between"
    },
    cardColumn: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        minWidth: "250px",
        marginBottom: "0.5rem",
        marginRight: "0.5rem",
    },
    contentCard: {
        width: "100%"
    },
    linkCard: {
        marginTop: "1em",
        width: "100%",
        marginRight: "0px"
    },
    contentCardContent: {
        display: "flex",
        flexDirection: "column"
    },
    container: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        padding: "8px 24px"
    },
    type: {
        fontFamily: "Montserrat, sans-serif",
        color: "rgba(0, 0, 0, 0.87)",
        display: "flex",
        fontSize: "16px",
        marginTop: "8px"
    },
    icon: {
        color: "rgba(0, 0, 0, 0.54)",
        marginRight: "16px"
    },
    locationContainer: {
        margin: "12px 0px -12px 0px"
    },
    entry: {
        padding: "2em 1em",
        display: "flex",
        flexDirection: "row",
        borderTop: "1px solid #CCC",
        transition: theme.transitions.create(["border", "background-color"])
    },
    entryTextBlock: {
        display: "flex",
        flexDirection: "column",
        marginLeft: "16px"
    },
    heading: {
        fontFamily: "Montserrat, sans-serif",
        fontWeight: 600,
        color: "rgba(0, 0, 0, 0.87)",
        fontSize: "16px"
    },
    locationDetails: {
        fontFamily: "Montserrat, sans-serif",
        color: "rgba(0, 0, 0, 0.87)",
        fontSize: "14px"
    },
    locationIcon: {
        color: "#53284f",
        marginLeft: "8px"
    }
}));

const InstitutionDetails: React.FC = () => {
    const classes = useStyles();

    // Loaded in Menu component
    const person = useSelector((state: RootState) => state.person.value);

    const dispatch = useDispatch();
    const match = useRouteMatch<{ id: string }>();

    const [requestLocationDialogOpen, setRequestLocationDialogOpen] = useState(false);

    const onRequestLocationClicked = useCallback(() => setRequestLocationDialogOpen(true), []);
    const onRequestLocationDialogCancelled = useCallback(() => setRequestLocationDialogOpen(false), []);
    const onRequestLocationDialogSaved = useCallback(() => setRequestLocationDialogOpen(false), []);

    useEffect(() => {
        dispatch(loadInstitutionAntraege());
    }, [dispatch]);

    const institution = person?.institutionen?.find(i => i.institution.id === match.params.id);

    return (
        <>
            <div className={classes.cardColumnContainer}>
                <div className={classes.cardColumn}>

                    <ContentCard
                        className={classes.contentCard}
                        title="Details der Institution"
                        showPlaceholder={!person || !institution}
                        placeholder={(
                            <span>
                            {person ? "Institution nicht gefunden." : "Institution wird geladen..."}
                        </span>
                        )}>
                        <div className={classes.container}>
                            <span className={classes.heading}>{institution?.institution.name}</span>
                            <span className={classes.type}>
                            {institution?.institution.typ === "PRIVAT" ? <Person className={classes.icon}/> :
                                <LocationCity className={classes.icon}/>}
                                {capitalize(institution?.institution.typ.toLowerCase() || "")}
                        </span>
                        </div>
                    </ContentCard>

                </div>

                <div className={classes.cardColumn}>

                    <ContentCard
                        className={classes.contentCard}
                        title="Zugewiesene Standorte"
                        showPlaceholder={!person || !institution}
                        placeholder={(
                            <span>
                            {person ? "Institution nicht gefunden." : "Institution wird geladen..."}
                        </span>
                        )}>
                        <div className={classes.locationContainer}>
                            {institution?.standorte.map(entry => (
                                <div
                                    className={classes.entry}>
                                    <LocationOn className={classes.locationIcon} fontSize="large"/>
                                    <div className={classes.entryTextBlock}>
                                        <span className={classes.heading}>{entry.name}</span>
                                        <span
                                            className={classes.locationDetails}>{entry.strasse} {entry.hausnummer}</span>
                                        <span className={classes.locationDetails}>{entry.plz} {entry.ort}</span>
                                        <span className={classes.locationDetails}>{entry.land}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ContentCard>

                    <LinkCard
                        className={classes.linkCard}
                        title="Standort beantragen"
                        onClick={onRequestLocationClicked}/>

                </div>
            </div>

            <RequestLocationDialog
                open={requestLocationDialogOpen}
                onCancelled={onRequestLocationDialogCancelled}
                onSaved={onRequestLocationDialogSaved}/>

        </>
    )
};

export default InstitutionDetails;