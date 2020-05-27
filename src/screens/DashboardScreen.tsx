import {Button, Hidden, Typography, WithStyles} from "@material-ui/core";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import React, {Component} from "react";
import {connect, ConnectedProps} from "react-redux";
import {RouteComponentProps, withRouter} from "react-router-dom";
import RequestStatusBadge from "../components/Badge/RequestStatusBadge";
import ContentCard from "../components/Content/ContentCard";
import LinkCard from "../components/Content/LinkCard";
import {InstitutionAngebot} from "../domain/angebot/InstitutionAngebot";
import {InstitutionBedarf} from "../domain/bedarf/InstitutionBedarf";
import home from "../resources/home.svg";
import {loadGestellteAngebotAnfragen} from "../state/angebot/GestellteAngebotAnfragenState";
import {loadInstitutionAngebote} from "../state/angebot/InstitutionAngeboteState";
import {loadGestellteBedarfAnfragen} from "../state/bedarf/GestellteBedarfAnfragenState";
import {loadInstitutionBedarfe} from "../state/bedarf/InstitutionBedarfeState";
import {loadKonversationAngebotAnfragen} from "../state/nachricht/KonversationAngebotAnfragenState";
import {loadKonversationBedarfAnfragen} from "../state/nachricht/KonversationBedarfAnfragenState";
import {loadKonversationen} from "../state/nachricht/KonversationenState";
import {RootDispatch, RootState} from "../state/Store";
import {getDemandRequestIds, getOfferRequestIds, mapConversations} from "../util/mappers/ConversationMapper";
import Map from "../components/Map/Map";

interface Props extends WithStyles<typeof styles>, PropsFromRedux, RouteComponentProps {
}

interface State {
}

const styles = (theme: Theme) =>
    createStyles({
        button: {
            height: "48px",
            fontFamily: "Montserrat, sans-serif",
            maxWidth: "350px",
            width: "100%",
            fontWeight: 600,
            marginTop: "16px",
            textTransform: "none",
            fontSize: "16px",
            borderRadius: "8px",
            color: "white"
        },
        buttonOffer: {
            backgroundColor: "#007c92",
            "&:hover": {
                backgroundColor: "#006374"
            }
        },
        buttonDemand: {
            backgroundColor: "#53284f",
            "&:hover": {
                backgroundColor: "#42203f"
            }
        },
        welcome: {
            fontFamily: "Montserrat, sans-serif",
            fontSize: "60px",
            fontWeight: 600,
            color: "#007c92",
            lineHeight: 1.1
        },
        welcomeSubtitle: {
            fontFamily: "Montserrat, sans-serif",
            fontSize: "16px",
            lineHeight: "24px",
            marginBottom: "4em",
            marginTop: "1em"
        },
        mainImage: {
            height: "auto",
            width: "100%",
            minWidth: "200px"
        },
        welcomeArea: {
            display: "flex",
            marginTop: "5em"
        },
        welcomeAreaLeft: {
            maxWidth: "700px",
            marginTop: "4em",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0
        },
        welcomeAreaRight: {
            marginLeft: "auto"
        },
        cards: {
            marginTop: "4em",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between"
        },
        contentCard: {
            width: "calc((100% - 1em) / 2)"
        },
        cardPlaceholderAction: {
            fontWeight: 600
        },
        linkCards: {
            marginTop: "1.5em",
            display: "flex",
            flexWrap: "wrap"
        },
        linkCard: {
            width: "calc((100% - 3em) / 4)"
        },
        adEntry: {
            cursor: "pointer",
            padding: "4px 24px",
            transition: theme.transitions.create("background-color"),
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.1)"
            }
        },
        adEntryTitle: {
            fontFamily: "Montserrat, sans-serif",
            fontSize: "16px",
            letterSpacing: "-0.02em"
        },
        adEntryRequests: {
            backgroundColor: "#53284f",
            borderRadius: "8px",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            fontSize: "12px",
            marginRight: "8px",
            color: "white",
            padding: "2px 8px"
        }
    });

class DashboardScreen extends Component<Props, State> {
    state: State = {};

    render() {
        const classes = this.props.classes;

        const ownCount = (this.props.institutionAngebote?.length || 0) + (this.props.institutionBedarfe?.length || 0);
        const conversationCount = this.props.konversationen?.length || 0;

        return (
            <>
                <div className={classes.welcomeArea}>

                    <div className={classes.welcomeAreaLeft}>

                        <Typography
                            className={classes.welcome}>
                            Hallo, {this.props.person?.vorname}&nbsp;{this.props.person?.nachname}
                        </Typography>

                        <Typography
                            className={classes.welcomeSubtitle}>
                            Willkommen zurück bei RemedyMatch.
                        </Typography>

                        <Button
                            size="medium"
                            color="secondary"
                            disableElevation
                            onClick={this.onCreateOfferClicked}
                            className={clsx(classes.button, classes.buttonOffer)}
                            variant="contained">
                            Material spenden
                        </Button>

                        <Button
                            size="medium"
                            color="secondary"
                            disableElevation
                            onClick={this.onCreateDemandClicked}
                            className={clsx(classes.button, classes.buttonDemand)}
                            variant="contained">
                            Material suchen
                        </Button>

                        <Button
                            onClick={this.onMapOpenClicked}
                            className={clsx(classes.button, classes.buttonDemand)}
                            variant="contained">
                            Karte ansehen
                        </Button>

                    </div>

                    <Hidden smDown>
                        <div className={classes.welcomeAreaRight}>
                            <img
                                alt="RemedyMatch Bild"
                                className={classes.mainImage}
                                src={home}/>
                        </div>
                    </Hidden>

                </div>

                <div className={classes.cards}>

                    <ContentCard
                        className={classes.contentCard}
                        title="Meine Inserate"
                        showPlaceholder={ownCount === 0}
                        actionDisabled={ownCount === 0}
                        onActionClicked={this.onShowAdsClicked}
                        action={ownCount ? `Alle ${ownCount} Inserate anzeigen` : "Keine Inserate gefunden"}
                        placeholder={(
                            <>
                                <span>
                                    Ihre Institution hat noch keine Inserate erstellt.<br/>
                                </span>
                                <span className={classes.cardPlaceholderAction}>
                                    Klicken Sie oben, ein Inserat zu erstellen!
                                </span>
                            </>
                        )}>
                        {
                            this.mapAds().slice(0, 5).map(entry => (
                                <div className={classes.adEntry}
                                     onClick={() => this.props.history.push("/inserate/" + entry.id)}>
                                    {entry.requests > 0 && (
                                        <span className={classes.adEntryRequests}>
                                            {entry.requests} Anfrage{entry.requests > 1 ? "n" : ""}
                                        </span>
                                    )}
                                    <span className={classes.adEntryTitle}>{entry.message}</span>
                                </div>
                            ))
                        }
                    </ContentCard>

                    <ContentCard
                        className={classes.contentCard}
                        title="Meine Konversationen"
                        showPlaceholder={conversationCount === 0}
                        actionDisabled={conversationCount === 0}
                        onActionClicked={this.onShowConversationsClicked}
                        action={conversationCount ? `Alle ${conversationCount} Konversationen anzeigen` : "Keine Konversationen gefunden"}
                        placeholder={(
                            <>
                                <span>
                                    Ihre Institution hat noch keine Konversationen gestartet.<br/>
                                </span>
                                <span className={classes.cardPlaceholderAction}>
                                    Klicken Sie oben, um ein Inserat anzufragen!
                                </span>
                            </>
                        )}>
                        {
                            mapConversations(
                                this.props.konversationen || [],
                                this.props.konversationAngebotAnfragen || [],
                                this.props.konversationBedarfAnfragen || [],
                                this.props.person,
                                {
                                    withPrefix: false
                                }
                            ).slice(0, 5).map(entry => (
                                <div className={classes.adEntry}
                                     onClick={() => this.props.history.push("/konversation/" + entry.id)}>
                                    <span className={classes.adEntryTitle}>
                                        <RequestStatusBadge status={entry.status}/>
                                        {entry.title}
                                    </span>
                                </div>
                            ))
                        }
                    </ContentCard>

                </div>

                <div className={classes.linkCards}>
                    <LinkCard
                        title="Meine Matches anzeigen"
                        onClick={this.onMyMatchesClicked}
                        className={classes.linkCard}/>
                    <LinkCard
                        title="Mein Konto anzeigen"
                        onClick={this.onMyAccountClicked}
                        className={classes.linkCard}/>
                </div>
            </>
        )
    }

    componentDidMount = async () => {
        this.props.loadGestellteAngebotAnfragen();
        this.props.loadGestellteBedarfAnfragen();
        this.props.loadInstitutionAngebote();
        this.props.loadInstitutionBedarfe();
        this.props.loadKonversationen();
    };

    componentDidUpdate(prevProps: Readonly<Props>) {
        if (prevProps.konversationen !== this.props.konversationen) {
            this.props.loadKonversationAngebotAnfragen(...getOfferRequestIds(this.props.konversationen || []));
            this.props.loadKonversationBedarfAnfragen(...getDemandRequestIds(this.props.konversationen || []));
        }
    }

    private onCreateOfferClicked = () => {
        this.props.history.push("/angebot");
    };

    private onCreateDemandClicked = () => {
        this.props.history.push("/bedarf");
    };

    private onMyAccountClicked = () => {
        this.props.history.push("/konto");
    };

    private onMapOpenClicked = () => {
        this.props.history.push("/map");
    };

    private onShowAdsClicked = () => {
        this.props.history.push("/inserate");
    };

    private onShowConversationsClicked = () => {
        this.props.history.push("/konversation");
    };

    private onMyMatchesClicked = () => {
        this.props.history.push("/matches");
    };

    private mapAds = () => {
        const bedarfe = this.props.institutionBedarfe || [];
        const angebote = this.props.institutionAngebote || [];
        return bedarfe.map(bedarf => this.mapToAd(bedarf, true))
            .concat(angebote.map(angebot => this.mapToAd(angebot, false)));
    };

    private mapToAd = (entry: InstitutionBedarf | InstitutionAngebot, bedarf: boolean) => {
        const count = entry.verfuegbareAnzahl;
        const name = entry.artikel.name;

        const variante = entry.artikel.varianten.length > 1
            ? entry.artikel.varianten.find(variante => variante.id === entry.artikelVarianteId)?.variante
            : undefined;

        return {
            id: entry.id,
            message: `${bedarf ? "Bedarf: " : "Angebot: "} ${count}x ${name}` + (variante ? ` (${variante})` : ""),
            requests: entry.anfragen.length
        };
    };
}

const mapStateToProps = (state: RootState) => ({
    gestellteAngebotAnfragen: state.gestellteAngebotAnfragen.value,
    gestellteBedarfAnfragen: state.gestellteBedarfAnfragen.value,
    institutionAngebote: state.institutionAngebote.value,
    institutionBedarfe: state.institutionBedarfe.value,
    konversationAngebotAnfragen: state.konversationAngebotAnfragen.value,
    konversationBedarfAnfragen: state.konversationBedarfAnfragen.value,
    konversationen: state.konversationen.value,
    person: state.person.value // Wird im Menü geladen
});

const mapDispatchToProps = (dispatch: RootDispatch) => ({
    loadGestellteAngebotAnfragen: () => dispatch(loadGestellteAngebotAnfragen()),
    loadGestellteBedarfAnfragen: () => dispatch(loadGestellteBedarfAnfragen()),
    loadInstitutionAngebote: () => dispatch(loadInstitutionAngebote()),
    loadInstitutionBedarfe: () => dispatch(loadInstitutionBedarfe()),
    loadKonversationAngebotAnfragen: (...ids: string[]) => dispatch(loadKonversationAngebotAnfragen(...ids)),
    loadKonversationBedarfAnfragen: (...ids: string[]) => dispatch(loadKonversationBedarfAnfragen(...ids)),
    loadKonversationen: () => dispatch(loadKonversationen())
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withRouter(withStyles(styles)(DashboardScreen)));
