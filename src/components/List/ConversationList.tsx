import { makeStyles, Theme } from "@material-ui/core/styles";
import { ArrowForwardIos } from "@material-ui/icons";
import { Pagination } from "@material-ui/lab";
import { format, isThisYear, isToday, isYesterday } from "date-fns";
import { de } from "date-fns/locale";
import React, { useState } from "react";
import { GestellteAngebotAnfrage } from "../../domain/angebot/GestellteAngebotAnfrage";
import { GestellteBedarfAnfrage } from "../../domain/bedarf/GestellteBedarfAnfrage";
import { Konversation } from "../../domain/nachricht/Konversation";
import { Person } from "../../domain/person/Person";
import { IdMap, mapConversations } from "../../util/mappers/ConversationMapper";
import RequestStatusBadge from "../Badge/RequestStatusBadge";

const useStyles = makeStyles((theme: Theme) => ({
  list: {
    border: "2px solid #aabec6",
    display: "flex",
    flexDirection: "column",
    borderRadius: "8px",
    "&>div:first-child": {
      borderTop: "none",
    },
  },
  resultItem: {
    borderTop: "2px solid #aabec6",
    display: "flex",
    flexDirection: "row",
    padding: "16px 8px 16px 16px",
    cursor: "pointer",
  },
  left: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    overflow: "hidden",
  },
  right: {
    display: "flex",
    flexDirection: "row",
    flexShrink: 0,
    flexGrow: 0,
    marginLeft: "auto",
    alignItems: "center",
  },
  title: {
    fontFamily: "Montserrat, sans-serif",
    fontSize: "16px",
    fontWeight: 600,
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    marginBottom: "4px",
  },
  message: {
    fontFamily: "Montserrat, sans-serif",
    fontSize: "14px",
    whiteSpace: "nowrap",
    color: "rgba(0, 0, 0, 0.87)",
    textOverflow: "ellipsis",
    marginRight: "16px",
    overflow: "hidden",
  },
  time: {
    fontFamily: "Montserrat, sans-serif",
    fontSize: "14px",
    fontWeight: 600,
    color: "rgba(0, 0, 0, 0.54)",
    marginRight: "16px",
  },
  iconRight: {
    color: "rgba(0, 0, 0, 0.38)",
  },
  pagination: {
    justifyContent: "center",
    display: "flex",
    margin: "2em",
  },
}));

interface Props {
  className?: string;
  conversations: Konversation[];
  offerDetails: IdMap<GestellteAngebotAnfrage>;
  demandDetails: IdMap<GestellteBedarfAnfrage>;
  person?: Person;
  onOpenConversationClicked: (conversationId: string) => void;
}

const PAGE_SIZE = 10;

const formatDate = (dateString?: string) => {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);

  if (isToday(date)) {
    return format(date, "HH:mm", { locale: de });
  }

  if (isYesterday(date)) {
    return "Gestern, " + format(date, "HH:mm", { locale: de });
  }

  if (isThisYear(date)) {
    return format(date, "dd. MMMM, HH:mm", { locale: de });
  }

  return format(date, "dd. MMMM YYYY, HH:mm", { locale: de });
};

const ConversationList: React.FC<Props> = (props) => {
  const classes = useStyles();

  const [pageIndex, setPageIndex] = useState(0);

  if (props.conversations.length === 0) {
    return <div className={props.className} />;
  }

  const items = mapConversations(
    props.conversations,
    props.offerDetails,
    props.demandDetails,
    props.person
  ).slice(pageIndex * PAGE_SIZE, pageIndex * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className={props.className}>
      <div className={classes.list}>
        {items.map((item) => (
          <div
            className={classes.resultItem}
            onClick={() => props.onOpenConversationClicked(item.id)}
          >
            <div className={classes.left}>
              <span className={classes.title}>
                <RequestStatusBadge status={item.status} />
                {item.title}
              </span>
              <span className={classes.message}>
                {!item.message
                  ? undefined
                  : item.message.erstellerName + ": " + item.message.nachricht}
              </span>
            </div>
            <div className={classes.right}>
              <span className={classes.time}>
                {formatDate(item.message?.erstelltAm)}
              </span>
              <ArrowForwardIos fontSize="small" className={classes.iconRight} />
            </div>
          </div>
        ))}
      </div>
      <Pagination
        color="secondary"
        variant="outlined"
        className={classes.pagination}
        count={Math.ceil(props.conversations.length / PAGE_SIZE)}
        page={pageIndex + 1}
        onChange={(e, page) => setPageIndex(page - 1)}
      />
    </div>
  );
};

export default ConversationList;
