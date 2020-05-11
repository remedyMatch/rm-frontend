import {Button, capitalize} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {ArrowForward} from "@material-ui/icons";
import React, {useEffect, useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import ContentCard from "../../components/Content/ContentCard";
import LinkCard from "../../components/Content/LinkCard";
import {loadInstitutionAntraege} from "../../state/institution/InstitutionAntraegeState";
import {RootState} from "../../state/Store";

const useStyles = makeStyles((theme: Theme) => ({
    contentCards: {
        display: "flex",
        justifyContent: "space-between"
    },
    contentCard: {
        width: "calc((100% - 1em) / 2)"
    },
    linkCards: {
        marginTop: "1em",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between"
    },
    linkCard: {
        width: "calc((100% - 1em) / 2)"
    },
    contentCardContent: {
        display: "flex",
        flexDirection: "column"
    },
    contentCardListButton: {
        fontFamily: "Montserrat, sans-serif",
        fontSize: "16px",
        letterSpacing: "-0.02em",
        textTransform: "none",
        borderRadius: "0px",
        padding: "8px 24px",
        flexGrow: 1,
        justifyContent: "left",
        display: "flex"
    },
    requestName: {
        flexGrow: 1
    }
}));

const InstitutionDetails: React.FC = () => {
    const classes = useStyles();

    const requests = useSelector((state: RootState) => state.institutionAntraege.value);
    // Loaded in Menu component
    const person = useSelector((state: RootState) => state.person.value);

    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        dispatch(loadInstitutionAntraege());
    }, [dispatch]);

    // Filter institutions
    const institutions = useMemo(
        () => person?.standorte
            .map(s => s.institution)
            .filter((s, i, a) => a.find(x => x.id === s.id) === s),
        [person]);

    return (
        <>
            <div className={classes.contentCards}>

                <ContentCard
                    className={classes.contentCard}
                    title="Meine Institutionen"
                    showPlaceholder={!person}
                    placeholder={(
                        <span>
                            Ihre Daten werden geladen...
                        </span>
                    )}>
                    <div className={classes.contentCardContent}>
                        {institutions?.map(institution => (
                            <Button
                                variant="text"
                                onClick={() => history.push("/konto/institutionen/" + institution.id)}
                                className={classes.contentCardListButton}
                                startIcon={<ArrowForward/>}>
                                {institution.name}
                            </Button>
                        ))}
                    </div>
                </ContentCard>

                <ContentCard
                    className={classes.contentCard}
                    title="Meine Anträge"
                    showPlaceholder={requests?.length === 0}
                    placeholder={(
                        <span>
                            {requests === undefined ? "Ihre Daten werden geladen..." : "Sie haben noch keine Institutionen beantragt."}
                        </span>
                    )}>
                    <div className={classes.contentCardContent}>
                        {requests?.map(request => (
                            <Button
                                variant="text"
                                onClick={() => history.push("/konto/institutionen/" + request.id) /* TODO */}
                                className={classes.contentCardListButton}
                                startIcon={<ArrowForward/>}>
                                <span className={classes.requestName}>{request.name}</span>
                                {capitalize(request.status)}
                            </Button>
                        ))}
                    </div>
                </ContentCard>

            </div>

            <div className={classes.linkCards}>
                <LinkCard
                    className={classes.linkCard}
                    title="Institution beantragen"
                    onClick={() => console.log("Institution beantragen")}/>

            </div>

        </>
    )
};

export default InstitutionDetails;