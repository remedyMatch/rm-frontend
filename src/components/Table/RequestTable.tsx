import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import MUITable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {Anfrage} from "../../Domain/Anfrage";
import {Bedarf} from "../../Domain/Bedarf";
import {Angebot} from "../../Domain/Angebot";
import {IconButton} from "@material-ui/core";
import {CallMade, CallReceived, Cancel} from "@material-ui/icons";

const useStyles = makeStyles({
    table: {
        minWidth: "650px",
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
    typeCell: {
        display: "flex",
        alignItems: "center"
    },
    typeIcon: {
        fontSize: "0.8rem",
        marginLeft: "8px"
    },
    typeColumn: {
        whiteSpace: "nowrap"
    },
    cancelColumn: {

    },
    contactColumn: {
        whiteSpace: "nowrap"
    },
    articleColumn: {
        width: "99%"
    },
    distanceColumn: {
        whiteSpace: "nowrap"
    },
    statusColumn: {
        whiteSpace: "nowrap"
    }
});

interface Props {
    erhalten: Anfrage[];
    gesendet: Anfrage[];
    showType?: boolean;
    bedarfe?: Bedarf[];
    angebote?: Angebot[];
    onCancel?: (id?: string) => void;
}

const RequestTable: React.FC<Props> = props => {
    const classes = useStyles();
    const data1 = props.erhalten.map(anfrage => ({type: "received", data: anfrage}));
    const data2 = props.gesendet.map(anfrage => ({type: "sent", data: anfrage}));
    const data = data1.concat(data2);

    return (
        <TableContainer className={classes.tableContainer}>
            <MUITable className={classes.table}>
                <TableHead>
                    <TableRow>
                        {props.showType && (<TableCell className={classes.typeColumn}>Typ</TableCell>)}
                        <TableCell className={classes.contactColumn}>Absender / Empfänger</TableCell>
                        <TableCell className={classes.articleColumn}>Anzeige</TableCell>
                        <TableCell className={classes.distanceColumn}>Entfernung</TableCell>
                        <TableCell className={classes.statusColumn}>Status</TableCell>
                        {props.onCancel && (<TableCell className={classes.cancelColumn}/>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map(entry => {
                        const row = entry.data;
                        const institution = entry.type === "sent" ? row.institutionAn : row.institutionVon;
                        const item = (row.bedarfId ? props.bedarfe : props.angebote)?.find(item => item.id === (row.bedarfId || row.angebotId));
                        const onCancel = props.onCancel;

                        return (
                            <TableRow key={row.id}>
                                {props.showType && (
                                    <TableCell className={classes.typeCell}>
                                        {entry.type === "sent" ? "Gestellt" : "Erhalten"}
                                        {entry.type === "sent" ?
                                            <CallMade className={classes.typeIcon}/> :
                                            <CallReceived className={classes.typeIcon}/>}
                                    </TableCell>
                                )}
                                <TableCell className={classes.contactColumn}>
                                    {(entry.type === "sent" ? "An " : "Von ") + institution.name}
                                </TableCell>
                                <TableCell className={classes.articleColumn}>
                                    {(row.bedarfId ? "Bedarf: " : "Angebot: ") + item?.anzahl + " " + item?.artikel.name}
                                </TableCell>
                                <TableCell className={classes.distanceColumn}>
                                    {row.entfernung.toFixed(1) + " km"}
                                </TableCell>
                                <TableCell className={classes.statusColumn}>
                                    {row.status}
                                </TableCell>
                                <TableCell className={classes.cancelColumn}>
                                    {onCancel && entry.type === "sent" && row.status !== "Storniert" && (
                                        <IconButton
                                            className={classes.iconButton}
                                            onClick={() => onCancel(item?.id)}>
                                            <Cancel/>
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                    {data.length === 0 && (
                        <TableRow>
                            <TableCell className={classes.empty} colSpan={99}>Keine Anfragen vorhanden</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </MUITable>
        </TableContainer>
    );
};

export default RequestTable;
