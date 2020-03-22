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
        minWidth: 650,
    },
});

interface Props {
    rows: any[];
}

const BasicTable: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Kategorie</TableCell>
                        <TableCell align="right">Produkt</TableCell>
                        <TableCell align="right">Menge</TableCell>
                        <TableCell align="right">Anbieter</TableCell>
                        <TableCell align="right">Standort</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.rows.map(row => (
                        <TableRow key={row.kategorie}>
                            <TableCell component="th" scope="row">{row.kategorie}</TableCell>
                            <TableCell align="right">{row.produkt}</TableCell>
                            <TableCell align="right">{row.menge}</TableCell>
                            <TableCell align="right">{row.anbieter}</TableCell>
                            <TableCell align="right">{row.standort}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
export default (BasicTable);
