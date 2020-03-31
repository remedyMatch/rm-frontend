import React from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import MUITable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {IconButton} from "@material-ui/core";
import {Delete, Info} from "@material-ui/icons";
import {Bedarf} from "../../Domain/Bedarf";
import {Angebot} from "../../Domain/Angebot";

const useStyles = makeStyles((theme: Theme) => ({
    table: {
        minWidth: "650px",
    },
    columnSmall: {
        width: "5%"
    },
    columnMedium: {
        width: "15%"
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
    },
    distance: {
        whiteSpace: "nowrap"
    }
}));

interface Props {
    rows: (Angebot | Bedarf)[];
    delete?: {
        institutionId: string;
        onDelete: (id: string) => void;
    };
    details?: {
        onClick: (id: string) => void;
    }
}

const EntryTable: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <TableContainer className={classes.tableContainer}>
            <MUITable className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.columnMedium}>Kategorie</TableCell>
                        <TableCell>Artikel</TableCell>
                        <TableCell className={classes.columnSmall}>Anzahl</TableCell>
                        <TableCell className={classes.columnMedium}>Standort</TableCell>
                        <TableCell className={classes.columnSmall}>Entfernung</TableCell>
                        {props.delete && <TableCell className={classes.columnSmall}/>}
                        {props.details && <TableCell className={classes.columnSmall}/>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.rows.sort((a, b) => a.entfernung - b.entfernung).map(row => (
                        <TableRow key={row.id}>
                            <TableCell component="th" scope="row">{row.artikel.artikelKategorie.name}</TableCell>
                            <TableCell>{row.artikel.name}</TableCell>
                            <TableCell>{row.rest}</TableCell>
                            <TableCell>{row.standort?.ort}</TableCell>
                            <TableCell className={classes.distance}>{row.entfernung.toFixed(1)} km</TableCell>
                            {props.delete && (
                                <TableCell>
                                    {row.institutionId === props.delete.institutionId && (
                                        <IconButton
                                            className={classes.iconButton}
                                            onClick={() => props.delete!.onDelete(row.id)}>
                                            <Delete/>
                                        </IconButton>
                                    )}
                                </TableCell>
                            )}
                            {props.details && (
                                <TableCell>
                                    <IconButton
                                        className={classes.iconButton}
                                        onClick={() => props.details!.onClick(row.id)}>
                                        <Info/>
                                    </IconButton>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                    {props.rows.length === 0 && (
                        <TableRow>
                            <TableCell className={classes.empty} colSpan={7}>Keine Einträge vorhanden</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </MUITable>
        </TableContainer>
    );
};

export default EntryTable;
