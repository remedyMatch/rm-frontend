import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import MUITable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {Angebot} from "../../Domain/Angebot";
import {CallMade, CallReceived} from "@material-ui/icons";
import {Match} from "../../Domain/Match";
import {Artikel} from "../../Domain/Artikel";

const useStyles = makeStyles({
    table: {
        minWidth: "650px",
    },
    tableContainer: {
        marginTop: "16px",
        backgroundColor: "white",
        border: "1px solid #CCC",
        borderRadius: "4px"
    },
    empty: {
        textAlign: "center",
        backgroundColor: "rgba(0,0,0,0.1)",
        padding: "8px"
    },
    typeCell: {
        display: "flex",
        alignItems: "center"
    },
    typeIcon: {
        fontSize: "0.8rem",
        marginRight: "8px"
    },
    typeColumn: {
        width: "99%"
    },
    statusColumn: {
        whiteSpace: "nowrap"
    }
});

interface Props {
    matches: Match[];
    articles: Artikel[];
}

const MatchTable: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <TableContainer className={classes.tableContainer}>
            <MUITable className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.typeColumn}>Betreff</TableCell>
                        <TableCell className={classes.statusColumn}>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.matches.map(match => {
                        const article = props.articles.find(article => article.id === match.artikelId);
                        return (
                            <TableRow key={match.id}>
                                <TableCell className={classes.typeCell}>
                                    {match.anfrageTyp === "Angebot" ? <CallReceived className={classes.typeIcon}/> :
                                        <CallMade className={classes.typeIcon}/>}
                                    Anfrage zu Lieferung
                                    von {match.anzahl} {article?.name} {match.anfrageTyp === "Angebot" ? "durch " + match.institutionVon.name : "an " + match.institutionAn.name}
                                </TableCell>
                                <TableCell className={classes.statusColumn}>
                                    {match.status}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                    {props.matches.length === 0 && (
                        <TableRow>
                            <TableCell className={classes.empty} colSpan={99}>Keine Matches vorhanden</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </MUITable>
        </TableContainer>
    );
};

export default MatchTable;
