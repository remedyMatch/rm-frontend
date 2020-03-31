import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import MUITable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {Bedarf} from "../Domain/Bedarf";
import {Angebot} from "../Domain/Angebot";
import {Aufgabe} from "../Domain/Aufgabe";
import {IconButton} from "@material-ui/core";
import {Edit} from "@material-ui/icons";

const useStyles = makeStyles({
    table: {
        minWidth: "650px",
    },
    columnLarge: {
        width: "30%"
    },
    columnSmall: {
        width: "5%"
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
    rows: Aufgabe[];
    demands?: Bedarf[];
    offers?: Angebot[];
    onEditClicked: (task: Aufgabe) => void;
}

const TaskTable: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <TableContainer className={classes.tableContainer}>
            <MUITable className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.columnLarge}>Aufgabe</TableCell>
                        <TableCell>Beschreibung</TableCell>
                        <TableCell className={classes.columnSmall}/>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.rows.map(row => (
                        <TableRow key={row.taskId}>
                            <TableCell component="th" scope="row">{row.taskName}</TableCell>
                            <TableCell>{row.displayName}</TableCell>
                            <TableCell>
                                <IconButton
                                    className={classes.iconButton}
                                    onClick={() => props.onEditClicked(row)}>
                                    <Edit/>
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                    {props.rows.length === 0 && (
                        <TableRow>
                            <TableCell className={classes.empty} colSpan={3}>Keine Aufgaben vorhanden</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </MUITable>
        </TableContainer>
    );
};

export default TaskTable;
