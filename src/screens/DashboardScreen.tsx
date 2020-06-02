import { Button, Hidden, Typography, useMediaQuery } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import clsx from "clsx";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import RequestStatusBadge from "../components/Badge/RequestStatusBadge";
import ContentCard from "../components/Content/ContentCard";
import LinkCard from "../components/Content/LinkCard";
import { InstitutionAngebot } from "../domain/angebot/InstitutionAngebot";
import { InstitutionBedarf } from "../domain/bedarf/InstitutionBedarf";
import home from "../resources/home.svg";
import { loadGestellteAngebotAnfragen } from "../state/angebot/GestellteAngebotAnfragenState";
import { loadInstitutionAngebote } from "../state/angebot/InstitutionAngeboteState";
import { loadGestellteBedarfAnfragen } from "../state/bedarf/GestellteBedarfAnfragenState";
import { loadInstitutionBedarfe } from "../state/bedarf/InstitutionBedarfeState";
import { loadKonversationAngebotAnfragen } from "../state/nachricht/KonversationAngebotAnfragenState";
import { loadKonversationBedarfAnfragen } from "../state/nachricht/KonversationBedarfAnfragenState";
import { loadKonversationen } from "../state/nachricht/KonversationenState";
import { RootState } from "../state/Store";
import {
  getDemandRequestIds,
  getOfferRequestIds,
  mapConversations
} from "../util/mappers/ConversationMapper";
import useTheme from "@material-ui/core/styles/useTheme";

const useStyles = makeStyles((theme: Theme) => ({
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
    lineHeight: 1.1,
    wordBreak: "break-word"
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
    marginTop: "3em",
    justifyContent: "space-between"
  },
  welcomeAreaLeft: {
    maxWidth: "700px",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    flex: "1 1 75%"
  },
  welcomeAreaRight: {
    flex: "1 1 25%"
  },
  cards: {
    marginTop: "4em",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around"
  },
  contentCard: {
    flex: "1 1 280px",
    margin: "0.2rem",
    width: "100%"
  },
  cardPlaceholderAction: {
    fontWeight: 600
  },
  linkCards: {
    marginTop: "1.5em",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap"
  },
  linkCard: {
    margin: "0.2rem"
  },
  adEntry: {
    cursor: "pointer",
    padding: "4px 24px",
    transition: theme.transitions.create("background-color"),
    whiteSpace: "break-spaces",
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
}));

const DashboardScreen: React.FC = props => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const person = useSelector((state: RootState) => state.person.value);
  const konversationen = useSelector(
    (state: RootState) => state.konversationen.value
  );
  const konversationAngebotAnfragen = useSelector(
    (state: RootState) => state.konversationAngebotAnfragen.value
  );
  const konversationBedarfAnfragen = useSelector(
    (state: RootState) => state.konversationBedarfAnfragen.value
  );
  const institutionAngebote = useSelector(
    (state: RootState) => state.institutionAngebote.value
  );
  const institutionBedarfe = useSelector(
    (state: RootState) => state.institutionBedarfe.value
  );

  useEffect(() => {
    dispatch(loadGestellteAngebotAnfragen());
    dispatch(loadGestellteBedarfAnfragen());
    dispatch(loadInstitutionAngebote());
    dispatch(loadInstitutionBedarfe());
    dispatch(loadKonversationen());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      loadKonversationAngebotAnfragen(
        ...getOfferRequestIds(konversationen || [])
      )
    );
    dispatch(
      loadKonversationBedarfAnfragen(
        ...getDemandRequestIds(konversationen || [])
      )
    );
  }, [dispatch, konversationen]);

  const ownCount =
    (institutionAngebote?.length || 0) + (institutionBedarfe?.length || 0);
  const conversationCount = konversationen?.length || 0;

  const mapToAd = (
    entry: InstitutionBedarf | InstitutionAngebot,
    bedarf: boolean
  ) => {
    const count = entry.verfuegbareAnzahl;
    const name = entry.artikel.name;

    const variante =
      entry.artikel.varianten.length > 1
        ? entry.artikel.varianten.find(
            variante => variante.id === entry.artikelVarianteId
          )?.variante
        : undefined;

    return {
      id: entry.id,
      message:
        `${bedarf ? "Bedarf: " : "Angebot: "} ${count}x ${name}` +
        (variante ? ` (${variante})` : ""),
      requests: entry.anfragen.length
    };
  };

  const mapAds = () => {
    const bedarfe = institutionBedarfe || [];
    const angebote = institutionAngebote || [];
    return bedarfe
      .map(bedarf => mapToAd(bedarf, true))
      .concat(angebote.map(angebot => mapToAd(angebot, false)));
  };

  return (
    <>
      <div className={classes.welcomeArea}>
        <div className={classes.welcomeAreaLeft}>
          <Typography className={classes.welcome}>
            Hallo,
            <br />
            {`${person?.vorname} ${person?.nachname}`}
          </Typography>

          <Typography className={classes.welcomeSubtitle}>
            Willkommen zurück bei RemedyMatch.
          </Typography>

          <Button
            size="medium"
            color="secondary"
            disableElevation
            onClick={() => history.push("/angebot")}
            className={clsx(classes.button, classes.buttonOffer)}
            variant="contained"
          >
            Material spenden
          </Button>

          <Button
            size="medium"
            color="secondary"
            disableElevation
            onClick={() => history.push("/bedarf")}
            className={clsx(classes.button, classes.buttonDemand)}
            variant="contained"
          >
            Material suchen
          </Button>
        </div>
        <Hidden xsDown>
          <div className={classes.welcomeAreaRight}>
            <img
              alt="RemedyMatch Bild"
              className={classes.mainImage}
              src={home}
            />
          </div>
        </Hidden>
      </div>

      <div className={classes.cards}>
        <ContentCard
          className={classes.contentCard}
          title="Meine Inserate"
          showPlaceholder={ownCount === 0}
          actionDisabled={ownCount === 0}
          onActionClicked={() => history.push("/inserate")}
          action={
            ownCount
              ? `Alle ${ownCount} Inserate anzeigen`
              : "Keine Inserate gefunden"
          }
          placeholder={
            <>
              <span>
                Ihre Institution hat noch keine Inserate erstellt.
                <br />
              </span>
              <span className={classes.cardPlaceholderAction}>
                Klicken Sie oben, ein Inserat zu erstellen!
              </span>
            </>
          }
        >
          {mapAds()
            .slice(0, 5)
            .map(entry => (
              <div
                className={classes.adEntry}
                onClick={() => history.push("/inserate/" + entry.id)}
              >
                {entry.requests > 0 && (
                  <span className={classes.adEntryRequests}>
                    {entry.requests} Anfrage{entry.requests > 1 ? "n" : ""}
                  </span>
                )}
                <span className={classes.adEntryTitle}>{entry.message}</span>
              </div>
            ))}
        </ContentCard>

        <ContentCard
          className={clsx(classes.contentCard)}
          title="Meine Konversationen"
          showPlaceholder={conversationCount === 0}
          actionDisabled={conversationCount === 0}
          onActionClicked={() => history.push("/konversation")}
          action={
            conversationCount
              ? `Alle ${conversationCount} Konversationen anzeigen`
              : "Keine Konversationen gefunden"
          }
          placeholder={
            <>
              <span>
                Ihre Institution hat noch keine Konversationen gestartet.
                <br />
              </span>
              <span className={classes.cardPlaceholderAction}>
                Klicken Sie oben, um ein Inserat anzufragen!
              </span>
            </>
          }
        >
          {mapConversations(
            konversationen || [],
            konversationAngebotAnfragen || [],
            konversationBedarfAnfragen || [],
            person,
            {
              withPrefix: false
            }
          )
            .slice(0, 5)
            .map(entry => (
              <div
                className={classes.adEntry}
                onClick={() => history.push("/konversation/" + entry.id)}
              >
                <div className={classes.adEntryTitle}>
                  <RequestStatusBadge status={entry.status} />
                  {entry.title}
                </div>
              </div>
            ))}
        </ContentCard>
      </div>

      <div className={classes.linkCards}>
        <LinkCard
          title="Meine Matches anzeigen"
          onClick={() => history.push("/matches")}
          className={classes.linkCard}
        />
        <LinkCard
          title="Mein Konto anzeigen"
          onClick={() => history.push("/konto")}
          className={classes.linkCard}
        />
      </div>
    </>
  );
};

export default DashboardScreen;
