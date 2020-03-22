import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
        minWidth: "650px",
    }
});

interface Props {
    rows: any[];
}

const ArticleTable: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Kategorie</TableCell>
                        <TableCell>Produkt</TableCell>
                        <TableCell>Menge</TableCell>
                        <TableCell>Anbieter</TableCell>
                        <TableCell>Standort</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.rows.map(row => (
                        <TableRow key={row.kategorie}>
                            <TableCell component="th" scope="row">{row.kategorie}</TableCell>
                            <TableCell>{row.produkt}</TableCell>
                            <TableCell>{row.menge}</TableCell>
                            <TableCell>{row.anbieter}</TableCell>
                            <TableCell>{row.standort}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default (ArticleTable);
