import { Button, capitalize } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { ArrowForward } from "@material-ui/icons";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ContentCard from "../../components/Content/ContentCard";
import LinkCard from "../../components/Content/LinkCard";
import { loadInstitutionAntraege } from "../../state/institution/InstitutionAntraegeState";
import { RootState } from "../../state/Store";
import RequestInstitutionDialog from "./RequestInstitutionDialog";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme: Theme) => ({
  linkCard: {
    marginTop: "1em",
    width: "100%",
    marginRight: "0px",
  },
  contentCardContent: {
    display: "flex",
    flexDirection: "column",
  },
  locationContainer: {
    margin: "12px 0px -12px 0px",
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
    display: "flex",
  },
  entry: {
    display: "flex",
    flexDirection: "row",
    borderTop: "1px solid #CCC",
    transition: theme.transitions.create(["border", "background-color"]),
  },
  entryTextBlock: {
    display: "flex",
    flexDirection: "column",
  },
  heading: {
    fontFamily: "Montserrat, sans-serif",
    fontWeight: 600,
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: "16px",
  },
  locationDetails: {
    fontFamily: "Montserrat, sans-serif",
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: "14px",
  },
  status: {
    fontFamily: "Montserrat, sans-serif",
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: "16px",
    marginLeft: "auto",
  },
}));

const InstitutionOverview: React.FC = () => {
  const classes = useStyles();

  const requests = useSelector(
    (state: RootState) => state.institutionAntraege.value
  );
  // Loaded in Menu component
  const person = useSelector((state: RootState) => state.person.value);

  const dispatch = useDispatch();
  const history = useHistory();

  const [
    requestInstitutionDialogOpen,
    setRequestInstitutionDialogOpen,
  ] = useState(false);

  const onRequestInstitutionClicked = useCallback(
    () => setRequestInstitutionDialogOpen(true),
    []
  );
  const onRequestInstitutionDialogCancelled = useCallback(
    () => setRequestInstitutionDialogOpen(false),
    []
  );
  const onRequestInstitutionDialogSaved = useCallback(() => {
    setRequestInstitutionDialogOpen(false);
    dispatch(loadInstitutionAntraege());
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadInstitutionAntraege());
  }, [dispatch]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={6}>
        <ContentCard
          title="Meine Institutionen"
          showPlaceholder={!person}
          placeholder={<span>Ihre Daten werden geladen...</span>}
        >
          <div className={classes.contentCardContent}>
            {person?.institutionen.map((institution) => (
              <Button
                variant="text"
                onClick={() =>
                  history.push(
                    "/konto/institutionen/" + institution.institution.id
                  )
                }
                className={classes.contentCardListButton}
                startIcon={<ArrowForward />}
              >
                {institution.institution.name}
              </Button>
            ))}
          </div>
        </ContentCard>
      </Grid>

      <Grid item xs={12} md={6}>
        <ContentCard
          title="Meine Anträge"
          showPlaceholder={requests?.length === 0}
          placeholder={
            <span>
              {requests === undefined
                ? "Ihre Daten werden geladen..."
                : "Sie haben noch keine Institutionen beantragt."}
            </span>
          }
        >
          <div className={classes.locationContainer}>
            {requests?.map((entry) => (
              <div className={classes.entry}>
                <div className={classes.entryTextBlock}>
                  <span className={classes.heading}>{entry.name}</span>
                  <span className={classes.locationDetails}>
                    {entry.strasse} {entry.hausnummer}
                  </span>
                  <span className={classes.locationDetails}>
                    {entry.plz} {entry.ort}
                  </span>
                  <span className={classes.locationDetails}>{entry.land}</span>
                </div>
                <span className={classes.status}>
                  {capitalize(entry.status.toLowerCase())}
                </span>
              </div>
            ))}
          </div>
        </ContentCard>

        <LinkCard
          className={classes.linkCard}
          title="Institution beantragen"
          onClick={onRequestInstitutionClicked}
        />
      </Grid>

      <RequestInstitutionDialog
        open={requestInstitutionDialogOpen}
        onCancelled={onRequestInstitutionDialogCancelled}
        onSaved={onRequestInstitutionDialogSaved}
      />
    </Grid>
  );
};

export default InstitutionOverview;
