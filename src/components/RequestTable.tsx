import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import MUITable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {Anfrage} from "../Model/Anfrage";
import {Bedarf} from "../Model/Bedarf";
import {Angebot} from "../Model/Angebot";

const useStyles = makeStyles({
    table: {
        minWidth: "650px",
    },
    columnLarge: {
        width: "30%"
    },
    iconButton: {
        margin: "-16px -8px -16px -24px"
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
    }
});

interface Props {
    rows: Anfrage[];
    type: "sent" | "received";
    demands?: Bedarf[];
    offers?: Angebot[];
}

const RequestTable: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <TableContainer className={classes.tableContainer}>
            <MUITable className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.columnLarge}>{props.type === "sent" ? "Empfänger" : "Absender"}</TableCell>
                        <TableCell>Anzeige</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.rows.map(row => {
                        const institution = props.type === "sent" ? row.institutionAn : row.institutionVon;
                        const item = (row.bedarfId ? props.demands : props.offers)?.find(item => item.id === (row.bedarfId || row.angebotId));

                        return (
                            <TableRow key={row.id}>
                                <TableCell component="th" scope="row">{institution.name}</TableCell>
                                <TableCell>{(row.bedarfId ? "Bedarf: " : "Angebot: ") + item?.anzahl + " " + item?.artikel.name}</TableCell>
                            </TableRow>
                        )
                    })}
                    {props.rows.length === 0 && (
                        <TableRow>
                            <TableCell className={classes.empty} colSpan={2}>Keine Anfragen vorhanden</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </MUITable>
        </TableContainer>
    );
};

export default RequestTable;
