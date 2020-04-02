import React from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import MUITable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TableFooter,
    TableSortLabel,
    TextField
} from "@material-ui/core";
import {Delete, Info} from "@material-ui/icons";
import {Bedarf} from "../../Domain/Bedarf";
import {Angebot} from "../../Domain/Angebot";
import {usePagination, useSortBy, useTable} from "react-table";
import {Pagination} from "@material-ui/lab";

declare type DataRow = {
    type: "offer" | "demand", data: {
        id: string;
        category: string;
        article: string;
        location: string;
        distance: string;
        amount: string;
    }
};

const useStyles = makeStyles((theme: Theme) => ({
    table: {
        minWidth: "650px",
        borderCollapse: "separate"
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
    },
    tableHeaderRow: {
        height: "64px"
    },
    typeColumn: {
        whiteSpace: "nowrap"
    },
    categoryColumn: {
        whiteSpace: "nowrap"
    },
    articleColumn: {
        width: "99%"
    },
    amountColumn: {
        whiteSpace: "nowrap"
    },
    locationColumn: {
        whiteSpace: "nowrap"
    },
    distanceColumn: {
        whiteSpace: "nowrap"
    },
    detailsColumn: {
        whiteSpace: "nowrap"
    },
    deleteColumn: {
        whiteSpace: "nowrap"
    },
    tableBody: {
        "&>tr:last-child": {
            "&>td": {
                borderBottom: "0px"
            }
        }
    },
    footer: {
        borderCollapse: "separate"
    },
    tableFooterContainer: {
        display: "flex",
        justifyContent: "space-around",
        placeItems: "center"
    },
    tableFooter: {
        display: "flex"
    },
    pageSizeControl: {
        width: "100px"
    },
    pageIndexControl: {
        width: "100px"
    },
    tableFooterCell: {
        position: "sticky",
        bottom: "0px",
        height: "64px",
        backgroundColor: "rgb(250,250,250)",
        borderTop: "1px solid rgb(224,224,224)"
    },
    pagination: {
        display: "flex",
        margin: "0px 24px"
    }
}));

interface Props {
    angebote: Angebot[];
    bedarfe: Bedarf[];
    hideType?: boolean;
    hideDistance?: boolean;
    useSimplePagination?: boolean;
    showDetailedAmount?: boolean;
    delete?: {
        eigeneInstitutionId: string;
        onDelete: (id: string) => void;
    };
    details?: {
        eigeneInstitutionId: string;
        onClick: (id: string) => void;
    }
}

const EntryTable: React.FC<Props> = props => {
    const classes = useStyles();

    const columns = React.useMemo(
        () => [
            {
                Header: 'Kategorie',
                accessor: 'data.category'
            },
            {
                Header: 'Artikel',
                accessor: 'data.article'
            },
            {
                Header: 'Anzahl',
                accessor: 'data.amount'
            },
            {
                Header: 'Standort',
                accessor: 'data.location'
            },
            {
                Header: "Entfernung",
                accessor: 'data.distance'
            }
        ],
        [props.hideDistance]
    );

    const data = React.useMemo(
        () => ([] as DataRow[])
            .concat(props.angebote.map(angebot => ({
                type: "offer",
                data: {
                    id: angebot.id,
                    category: angebot.artikel.artikelKategorie.name,
                    article: angebot.artikel.name,
                    amount: angebot.rest + (props.showDetailedAmount ? "/" + angebot.anzahl : ""),
                    location: angebot.standort.name + ", " + angebot.standort.ort,
                    distance: angebot.entfernung.toFixed(1) + " km"
                }
            })))
            .concat(props.bedarfe.map(bedarf => ({
                type: "demand", data: {
                    id: bedarf.id,
                    category: bedarf.artikel.artikelKategorie.name,
                    article: bedarf.artikel.name,
                    amount: bedarf.rest + (props.showDetailedAmount ? "/" + bedarf.anzahl : ""),
                    location: bedarf.standort.name + ", " + bedarf.standort.ort,
                    distance: bedarf.entfernung.toFixed(1) + " km"
                }
            }))),
        [props.angebote, props.bedarfe]
    );

    const hiddenColumns: string[] = [];
    if (props.hideDistance) {
        hiddenColumns.push("data.distance");
    }
    if (props.hideType) {
        hiddenColumns.push("type");
    }
    if (!props.details) {
        hiddenColumns.push("details");
    }
    if (!props.delete) {
        hiddenColumns.push("delete");
    }

    const {
        // Default properties
        getTableProps,
        headerGroups,
        prepareRow,
        // Pagination properties
        page,
        pageCount,
        gotoPage,
        setPageSize,
        state: {pageIndex, pageSize}
    } = useTable(
        {
            columns: columns,
            data: data,
            initialState: {
                hiddenColumns: hiddenColumns
            }
        },
        useSortBy,
        usePagination,
        hooks => {
            hooks.visibleColumns.push(columns => [
                {
                    id: 'type',
                    Header: "Typ",
                    Cell: cell => {
                        return cell.cell.row.original.type === "offer" ? "Angebot" : "Bedarf"
                    }
                },
                ...columns,
                {
                    id: 'details',
                    Cell: cell => (
                        <IconButton
                            size="small"
                            className={classes.iconButton}
                            onClick={() => props.details?.onClick(cell.cell.row.original.data.id)}>
                            <Info/>
                        </IconButton>
                    )
                },
                {
                    id: 'delete',
                    Cell: cell => (
                        <IconButton
                            size="small"
                            className={classes.iconButton}
                            onClick={() => props.delete?.onDelete(cell.cell.row.original.data.id)}>
                            <Delete/>
                        </IconButton>
                    )
                }
            ])
        });

    return (
        <TableContainer className={classes.tableContainer}>
            <MUITable {...getTableProps()} stickyHeader className={classes.table}>
                <TableHead>
                    {headerGroups.map(headerGroup => (
                        <TableRow
                            {...headerGroup.getHeaderGroupProps()}
                            className={classes.tableHeaderRow}>
                            {headerGroup.headers.map(column => (
                                <>
                                    {column.id === "type" && (
                                        <TableCell
                                            className={classes.typeColumn}>
                                            <TableSortLabel
                                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                                active={column.isSorted}
                                                direction={column.isSortedDesc ? "desc" : "asc"}>
                                                {column.render('Header')}
                                            </TableSortLabel>
                                        </TableCell>
                                    )}
                                    {column.id === "data.category" && (
                                        <TableCell
                                            className={classes.categoryColumn}>
                                            <TableSortLabel
                                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                                active={column.isSorted}
                                                direction={column.isSortedDesc ? "desc" : "asc"}>
                                                {column.render('Header')}
                                            </TableSortLabel>
                                        </TableCell>
                                    )}
                                    {column.id === "data.article" && (
                                        <TableCell
                                            className={classes.articleColumn}>
                                            <TableSortLabel
                                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                                active={column.isSorted}
                                                direction={column.isSortedDesc ? "desc" : "asc"}>
                                                {column.render('Header')}
                                            </TableSortLabel>
                                        </TableCell>
                                    )}
                                    {column.id === "data.amount" && (
                                        <TableCell
                                            className={classes.amountColumn}>
                                            <TableSortLabel
                                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                                active={column.isSorted}
                                                direction={column.isSortedDesc ? "desc" : "asc"}>
                                                {column.render('Header')}
                                            </TableSortLabel>
                                        </TableCell>
                                    )}
                                    {column.id === "data.location" && (
                                        <TableCell
                                            className={classes.locationColumn}>
                                            <TableSortLabel
                                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                                active={column.isSorted}
                                                direction={column.isSortedDesc ? "desc" : "asc"}>
                                                {column.render('Header')}
                                            </TableSortLabel>
                                        </TableCell>
                                    )}
                                    {column.id === "data.distance" && (
                                        <TableCell
                                            className={classes.distanceColumn}>
                                            <TableSortLabel
                                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                                active={column.isSorted}
                                                direction={column.isSortedDesc ? "desc" : "asc"}>
                                                {column.render('Header')}
                                            </TableSortLabel>
                                        </TableCell>
                                    )}
                                    {column.id === "details" && (
                                        <TableCell
                                            className={classes.detailsColumn}>
                                            {column.render('Header')}
                                        </TableCell>
                                    )}
                                    {column.id === "delete" && (
                                        <TableCell
                                            className={classes.deleteColumn}>
                                            {column.render('Header')}
                                        </TableCell>
                                    )}
                                </>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody className={classes.tableBody}>
                    {page.length === 0 && (
                        <TableRow>
                            <TableCell className={classes.empty} colSpan={99}>Keine Einträge vorhanden</TableCell>
                        </TableRow>
                    )}
                    {page.map((row, i) => {
                        prepareRow(row);
                        return (
                            <TableRow {...row.getRowProps()}>
                                {row.cells.map(cell => (
                                    <>
                                        {cell.column.id === "type" && (
                                            <TableCell
                                                {...cell.getCellProps()}
                                                className={classes.typeColumn}>
                                                {cell.render('Cell')}
                                            </TableCell>
                                        )}
                                        {cell.column.id === "data.category" && (
                                            <TableCell
                                                {...cell.getCellProps()}
                                                className={classes.categoryColumn}>
                                                {cell.render('Cell')}
                                            </TableCell>
                                        )}
                                        {cell.column.id === "data.article" && (
                                            <TableCell
                                                {...cell.getCellProps()}
                                                className={classes.articleColumn}>
                                                {cell.render('Cell')}
                                            </TableCell>
                                        )}
                                        {cell.column.id === "data.amount" && (
                                            <TableCell
                                                {...cell.getCellProps()}
                                                className={classes.amountColumn}>
                                                {cell.render('Cell')}
                                            </TableCell>
                                        )}
                                        {cell.column.id === "data.location" && (
                                            <TableCell
                                                {...cell.getCellProps()}
                                                className={classes.locationColumn}>
                                                {cell.render('Cell')}
                                            </TableCell>
                                        )}
                                        {cell.column.id === "data.distance" && (
                                            <TableCell
                                                {...cell.getCellProps()}
                                                className={classes.distanceColumn}>
                                                {cell.render('Cell')}
                                            </TableCell>
                                        )}
                                        {cell.column.id === "details" && (
                                            <TableCell
                                                {...cell.getCellProps()}
                                                className={classes.detailsColumn}>
                                                {cell.render('Cell')}
                                            </TableCell>
                                        )}
                                        {cell.column.id === "delete" && (
                                            <TableCell
                                                {...cell.getCellProps()}
                                                className={classes.deleteColumn}>
                                                {cell.render('Cell')}
                                            </TableCell>
                                        )}
                                    </>
                                ))}
                            </TableRow>
                        )
                    })}
                </TableBody>
                <TableFooter className={classes.footer}>
                    <TableRow>
                        <TableCell colSpan={99} className={classes.tableFooterCell}>
                            <div className={classes.tableFooterContainer}>
                                <div className={classes.tableFooter}>
                                    {!props.useSimplePagination && (
                                        <TextField
                                            className={classes.pageIndexControl}
                                            variant="outlined"
                                            size="small"
                                            type="number"
                                            label="Gehe zu Seite"
                                            value={pageIndex + 1}
                                            onChange={event => parseInt(event.target.value) > 0 && gotoPage(parseInt(event.target.value) - 1)}/>
                                    )}
                                    <Pagination
                                        className={classes.pagination}
                                        count={pageCount}
                                        page={pageIndex + 1}
                                        onChange={(e, page) => gotoPage(page - 1)}/>
                                    {!props.useSimplePagination && (
                                        <FormControl
                                            variant="outlined"
                                            className={classes.pageSizeControl}
                                            size="small">
                                            <InputLabel>Seitengröße</InputLabel>
                                            <Select
                                                label="Seitengröße"
                                                value={pageSize}
                                                onChange={(event) => setPageSize(parseInt(event.target.value as string))}
                                            >
                                                <MenuItem value={10}>10</MenuItem>
                                                <MenuItem value={25}>25</MenuItem>
                                                <MenuItem value={50}>50</MenuItem>
                                            </Select>
                                        </FormControl>
                                    )}
                                </div>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </MUITable>
        </TableContainer>
    );
};

export default EntryTable;
