import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {Angebot} from "../Model/Angebot";
import {IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";

const useStyles = makeStyles({
    table: {
        minWidth: "650px",
    },
    columnSmall: {
        width: "5%"
    },
    columnMedium: {
        width: "15%"
    },
    columnLarge: {
        width: "45%"
    },
    iconButton: {
        margin: "-16px -8px -16px -24px"
    },
    tableContainer: {
        marginTop: "16px",
        backgroundColor: "white",
        border: "1px solid #CCC",
        borderRadius: "4px"
    }
});

interface Props {
    rows: Angebot[];
    onDelete: (id: string) => void;
    ownInstitutionId: string;
}

const OfferTable: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <TableContainer className={classes.tableContainer}>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.columnMedium}>Kategorie</TableCell>
                        <TableCell className={classes.columnLarge}>Artikel</TableCell>
                        <TableCell className={classes.columnSmall}>Anzahl</TableCell>
                        <TableCell className={classes.columnMedium}>Anbieter</TableCell>
                        <TableCell className={classes.columnMedium}>Standort</TableCell>
                        <TableCell className={classes.columnSmall}/>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.rows.map(row => (
                        <TableRow key={row.id}>
                            <TableCell component="th" scope="row">{row.artikel.artikelKategorie.name}</TableCell>
                            <TableCell>{row.artikel.name}</TableCell>
                            <TableCell>{row.anzahl}</TableCell>
                            <TableCell>{row.institution.name}</TableCell>
                            <TableCell>{row.standort}</TableCell>
                            <TableCell>
                                {row.institution.id === props.ownInstitutionId && (
                                    <IconButton
                                        className={classes.iconButton}
                                        onClick={() => props.onDelete(row.id)}>
                                        <Delete/>
                                    </IconButton>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default (OfferTable);
