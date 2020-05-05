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
import {makeStyles, Theme} from '@material-ui/core/styles';
import MUITable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {Delete, Info} from "@material-ui/icons";
import {Pagination} from "@material-ui/lab";
import React from 'react';
import {usePagination, useSortBy, useTable} from "react-table";
import {Angebot} from "../../domain/angebot/Angebot";
import {Artikel} from "../../domain/artikel/Artikel";
import {ArtikelKategorie} from "../../domain/artikel/ArtikelKategorie";
import {Bedarf} from "../../domain/bedarf/Bedarf";
import clsx from "clsx";

declare type DataRow = {
    type: "offer" | "demand", data: {
        id: string;
        category: string;
        article: string;
        location: string;
        distance: string;
        amount: number;
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
    className?: string;
    artikel: Artikel[];
    artikelKategorien: ArtikelKategorie[];
    angebote: Angebot[];
    bedarfe: Bedarf[];
    hideType?: boolean;
    hideDistance?: boolean;
    useSimplePagination?: boolean;
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
        []
    );

    const data = React.useMemo(
        () => ([] as DataRow[])
            .concat(props.angebote.map(angebot => {
                const artikel = props.artikel.find(artikel => artikel.varianten?.map(variante => variante.id).indexOf(angebot.artikelVarianteId) !== -1);
                const kategorie = props.artikelKategorien.find(kategorie => kategorie.id === artikel?.artikelKategorieId);

                return {
                    type: "offer",
                    data: {
                        id: angebot.id,
                        category: kategorie?.name || "",
                        article: artikel?.name || "",
                        amount: angebot.verfuegbareAnzahl,
                        location: angebot.ort,
                        distance: angebot.entfernung.toFixed(1) + " km"
                    }
                };
            }))
            .concat(props.bedarfe.map(bedarf => {
                const artikel = props.artikel.find(artikel => artikel.varianten?.map(variante => variante.id).indexOf(bedarf.artikelVarianteId) !== -1);
                const kategorie = props.artikelKategorien.find(kategorie => kategorie.id === artikel?.artikelKategorieId);

                return {
                    type: "demand", data: {
                        id: bedarf.id,
                        category: kategorie?.name || "",
                        article: artikel?.name || "",
                        amount: bedarf.verfuegbareAnzahl,
                        location: bedarf.ort,
                        distance: bedarf.entfernung.toFixed(1) + " km"
                    }
                };
            })),
        [props.angebote, props.bedarfe, props.artikel, props.artikelKategorien]
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
        <TableContainer className={clsx(classes.tableContainer, props.className)}>
            <MUITable {...getTableProps()} stickyHeader className={classes.table}>
                <TableHead>
                    {headerGroups.map(headerGroup => (
                        <TableRow
                            {...headerGroup.getHeaderGroupProps()}
                            className={classes.tableHeaderRow}>
                            {headerGroup.headers.map(column => {
                                if (column.id === "type") return (
                                    <TableCell
                                        className={classes.typeColumn}
                                        {...column.getHeaderProps()}>
                                        <TableSortLabel
                                            {...column.getSortByToggleProps()}
                                            active={column.isSorted}
                                            direction={column.isSortedDesc ? "desc" : "asc"}>
                                            {column.render('Header')}
                                        </TableSortLabel>
                                    </TableCell>
                                );
                                if (column.id === "data.category") return (
                                    <TableCell
                                        className={classes.categoryColumn}
                                        {...column.getHeaderProps()}>
                                        <TableSortLabel
                                            {...column.getSortByToggleProps()}
                                            active={column.isSorted}
                                            direction={column.isSortedDesc ? "desc" : "asc"}>
                                            {column.render('Header')}
                                        </TableSortLabel>
                                    </TableCell>
                                );

                                if (column.id === "data.article") return (
                                    <TableCell
                                        className={classes.articleColumn}
                                        {...column.getHeaderProps()}>
                                        <TableSortLabel
                                            {...column.getSortByToggleProps()}
                                            active={column.isSorted}
                                            direction={column.isSortedDesc ? "desc" : "asc"}>
                                            {column.render('Header')}
                                        </TableSortLabel>
                                    </TableCell>
                                );

                                if (column.id === "data.amount") return (
                                    <TableCell
                                        className={classes.amountColumn}
                                        {...column.getHeaderProps()}>
                                        <TableSortLabel
                                            {...column.getSortByToggleProps()}
                                            active={column.isSorted}
                                            direction={column.isSortedDesc ? "desc" : "asc"}>
                                            {column.render('Header')}
                                        </TableSortLabel>
                                    </TableCell>
                                );

                                if (column.id === "data.location") return (
                                    <TableCell
                                        className={classes.locationColumn}>
                                        <TableSortLabel
                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                            active={column.isSorted}
                                            direction={column.isSortedDesc ? "desc" : "asc"}>
                                            {column.render('Header')}
                                        </TableSortLabel>
                                    </TableCell>
                                );

                                if (column.id === "data.distance") return (
                                    <TableCell
                                        className={classes.distanceColumn}
                                        {...column.getHeaderProps()}>
                                        <TableSortLabel
                                            {...column.getSortByToggleProps()}
                                            active={column.isSorted}
                                            direction={column.isSortedDesc ? "desc" : "asc"}>
                                            {column.render('Header')}
                                        </TableSortLabel>
                                    </TableCell>
                                );

                                if (column.id === "details") return (
                                    <TableCell
                                        className={classes.detailsColumn}
                                        {...column.getHeaderProps()}>
                                        {column.render('Header')}
                                    </TableCell>
                                );

                                if (column.id === "delete") return (
                                    <TableCell
                                        className={classes.deleteColumn}
                                        {...column.getHeaderProps()}>
                                        {column.render('Header')}
                                    </TableCell>
                                );

                                return null;
                            })}
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
                                {row.cells.map(cell => {
                                    if (cell.column.id === "type") return (
                                        <TableCell
                                            {...cell.getCellProps()}
                                            className={classes.typeColumn}>
                                            {cell.render('Cell')}
                                        </TableCell>
                                    );

                                    if (cell.column.id === "data.category") return (
                                        <TableCell
                                            {...cell.getCellProps()}
                                            className={classes.categoryColumn}>
                                            {cell.render('Cell')}
                                        </TableCell>
                                    );

                                    if (cell.column.id === "data.article") return (
                                        <TableCell
                                            {...cell.getCellProps()}
                                            className={classes.articleColumn}>
                                            {cell.render('Cell')}
                                        </TableCell>
                                    );

                                    if (cell.column.id === "data.amount") return (
                                        <TableCell
                                            {...cell.getCellProps()}
                                            className={classes.amountColumn}>
                                            {cell.render('Cell')}
                                        </TableCell>
                                    );

                                    if (cell.column.id === "data.location") return (
                                        <TableCell
                                            {...cell.getCellProps()}
                                            className={classes.locationColumn}>
                                            {cell.render('Cell')}
                                        </TableCell>
                                    );

                                    if (cell.column.id === "data.distance") return (
                                        <TableCell
                                            {...cell.getCellProps()}
                                            className={classes.distanceColumn}>
                                            {cell.render('Cell')}
                                        </TableCell>
                                    );

                                    if (cell.column.id === "details") return (
                                        <TableCell
                                            {...cell.getCellProps()}
                                            className={classes.detailsColumn}>
                                            {cell.render('Cell')}
                                        </TableCell>
                                    );

                                    if (cell.column.id === "delete") return (
                                        <TableCell
                                            {...cell.getCellProps()}
                                            className={classes.deleteColumn}>
                                            {cell.render('Cell')}
                                        </TableCell>
                                    );

                                    return null;
                                })}
                            </TableRow>
                        )
                    })}
                </TableBody>
                <TableFooter className={classes.footer}>
                    <TableRow>
                        <TableCell colSpan={99} className={classes.tableFooterCell}>
                            <div className={classes.tableFooterContainer}>
                                <div className={classes.tableFooter}>
                                    {!props.useSimplePagination && page.length > 0 && (
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
                                    {!props.useSimplePagination && page.length > 0 && (
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
