import { makeStyles, Theme } from "@material-ui/core/styles";
import { Email, Phone } from "@material-ui/icons";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import ContentCard from "../../components/Content/ContentCard";
import { RootState } from "../../state/Store";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
  },
  contentCard: {
    width: "calc((100% - 1em) / 2)",
  },
  container: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    padding: "8px 24px",
  },
  name: {
    fontFamily: "Montserrat, sans-serif",
    fontSize: "20px",
    fontWeight: 600,
    color: "rgba(0,0,0,0.87)",
    marginBottom: "4px",
  },
  username: {
    fontFamily: "Montserrat, sans-serif",
    fontSize: "16px",
    color: "rgba(0,0,0,0.54)",
    marginBottom: "16px",
  },
  details: {
    fontFamily: "Montserrat, sans-serif",
    color: "rgba(0, 0, 0, 0.87)",
    display: "flex",
    fontSize: "16px",
    marginTop: "8px",
  },
  icon: {
    color: "rgba(0, 0, 0, 0.54)",
    marginRight: "16px",
  },
}));

const AccountDetails: React.FC = (props) => {
  const classes = useStyles();

  // Loaded in Menu component
  const person = useSelector((state: RootState) => state.person.value);

  const mailLink = useMemo(
    () =>
      encodeURI(
        `mailto:info@remedymatch.io?subject=Datenänderung&body=Sehr geehrte Damen und Herren,\r\n\r\n ` +
          `für meinen Account mit dem Usernamen @${person?.username} möchte ich folgende Daten ändern lassen:\r\n\r\n ` +
          `BITTE EINTRAGEN\r\n\r\nMit freundlichen Grüßen\r\n${person?.vorname} ${person?.nachname}`
      ),
    [person]
  );

  return (
    <div className={classes.root}>
      <ContentCard
        className={classes.contentCard}
        title="Meine Daten"
        action="Datenänderung beantragen"
        onActionClicked={() => window.open(mailLink, "_blank")}
        showPlaceholder={!person}
        placeholder={<span>Ihre Daten werden geladen...</span>}
      >
        {
          <div className={classes.container}>
            <span className={classes.name}>
              {person?.vorname} {person?.nachname}
            </span>
            <span className={classes.username}>@{person?.username}</span>
            <span className={classes.details}>
              <Phone className={classes.icon} />
              {person?.telefon}
            </span>
            <span className={classes.details}>
              <Email className={classes.icon} />
              {person?.email}
            </span>
          </div>
        }
      </ContentCard>
    </div>
  );
};

export default AccountDetails;
