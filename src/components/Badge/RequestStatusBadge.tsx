import {capitalize} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";
import {AngebotAnfrageStatus} from "../../domain/angebot/AngebotAnfrage";
import {BedarfAnfrageStatus} from "../../domain/bedarf/BedarfAnfrage";

const useStyles = makeStyles(() => ({
    requestItemStatus: {
        fontFamily: "Montserrat, sans-serif",
        fontSize: "12px",
        fontWeight: 600,
        color: "white",
        padding: "2px 8px",
        borderRadius: "16px",
        marginRight: "8px",
        backgroundColor: "#53284F"
    },
    requestItemStatusOpen: {
        backgroundColor: "darkorange"
    },
    requestItemStatusDismissed: {
        backgroundColor: "red"
    },
    requestItemStatusAccepted: {
        backgroundColor: "green"
    },
    requestItemStatusCancelled: {
        backgroundColor: "blue"
    }
}));

interface Props {
    className?: string;
    colored?: boolean;
    status?: AngebotAnfrageStatus | BedarfAnfrageStatus;
}

const RequestStatusBadge: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <span className={clsx(classes.requestItemStatus, {
            [classes.requestItemStatusAccepted]: props.status === "ANGENOMMEN" && props.colored,
            [classes.requestItemStatusCancelled]: props.status === "STORNIERT" && props.colored,
            [classes.requestItemStatusDismissed]: props.status === "ABGELEHNT" && props.colored,
            [classes.requestItemStatusOpen]: props.status === "OFFEN" && props.colored
        }, props.className)}>
            {capitalize(props.status?.toLowerCase() || "Unbekannt")}
        </span>
    );
};

export default RequestStatusBadge;