import { capitalize } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";
import { AngebotAnfrageStatus } from "../../domain/angebot/AngebotAnfrage";
import { BedarfAnfrageStatus } from "../../domain/bedarf/BedarfAnfrage";

const useStyles = makeStyles(() => ({
  requestItemStatus: {
    fontFamily: "Montserrat, sans-serif",
    fontSize: "12px",
    fontWeight: 600,
    color: "white",
    padding: "2px 8px",
    borderRadius: "16px",
    marginRight: "8px",
    height: "fit-content",
    backgroundColor: "#53284F",
  },
}));

interface Props {
  className?: string;
  status?: AngebotAnfrageStatus | BedarfAnfrageStatus;
}

const RequestStatusBadge: React.FC<Props> = (props) => {
  const classes = useStyles();

  return (
    <span className={clsx(classes.requestItemStatus, props.className)}>
      {capitalize(props.status?.toLowerCase() || "Unbekannt")}
    </span>
  );
};

export default RequestStatusBadge;
