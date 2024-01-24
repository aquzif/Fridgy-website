import {useEffect,useState} from "react";
import {
    Box,
    Checkbox, LinearProgress,
    Paper,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow,
    TableSortLabel
} from "@mui/material";
import DataTableToolbar from "./DataTableToolbar";
import DataTableHeader from "./DataTableHeader";
import DataTableBody from "./DataTableBody";
import SearchUtils from "../../Utils/SearchUtils";
import {useSelector} from "react-redux";

const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}
const getComparator = (order, orderBy) => {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

const  stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const DataTable = ({
    title='',
    emptyMessage='Brak danych',
    isLoading=false,
    titleMinWidth='100px',
    searchBar=false,
    onRowClick=() => {},
    canSelect=true,
    onSelect= () => {},
    columns=[
        {
            'name': 'id',
            'label': 'ID',
            'searchValue': (val) => val,
        }
    ],
    data=[
        {
            'id': 1,
            'name': 'John Doe',
            'email': 'example@example.com',
        }
    ],
    clearSelectedTriggerValue = null,
    tools=[],
    inlineTools=[],
    //{
   //         'name': 'add',
   //         'label': 'Dodaj',
   //         'icon': <Add />,
   //         'forSelect': false,
   //         'singleSelect': false,
   //         'showAlways': false,
   //         'onClick': async () => {
   //             await new Promise(r => setTimeout(r, 2000));
   //         }
   //     }
    }) => {

    const settings = useSelector(state => state.authReducer.user.settings);

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('id');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(settings?.default_row_height || 5);
    const [selected, setSelected] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        setRowsPerPage(settings?.default_row_height || 5);
    },[settings]);


    const numSelected = selected.length;
    const rowCount = data.length;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleSearch = (event) => {
        setSearchValue(event.target.value);
        //search(event.target.value);
    }

    useEffect(() => {
        setSelected([]);
    }, [clearSelectedTriggerValue]);


    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const onSelectAllClick = (event) =>{

        if(event.target.checked)
            setSelected(data.map((item) => item.id));
        else
            setSelected([]);
    }

    const onSelectClick = (event,id) => {
        if(event.target.checked)
            setSelected(selected.concat(id));
        else
            setSelected(selected.filter((item) => item !== id));
    }

    useEffect(() => onSelect(selected), [selected])

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);

    };

    return <>
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <DataTableToolbar
                    numSelected={numSelected}
                    title={title}
                    tools={tools}
                    searchBar={searchBar}
                    onSearch={handleSearch}
                    titleMinWidth={titleMinWidth}
                />
                {isLoading && <LinearProgress />}
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                    >
                        <DataTableHeader
                            columns={columns}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            onSelectAllClick={onSelectAllClick}
                            handleRequestSort={handleRequestSort}
                            numSelected={numSelected}
                            rowCount={rowCount}
                            canSelect={canSelect}
                            useInlineActions={inlineTools.length > 0}
                        />
                       <DataTableBody
                            columns={columns}
                            selected={selected}
                            emptyMessage={emptyMessage}
                            loaded={!isLoading}
                            onRowClick={onRowClick}
                            onSelectClick={onSelectClick}
                            inlineTools={inlineTools}
                            data={stableSort(
                                SearchUtils.filterBySearchTerm(data, searchValue, columns)
                                , getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                            canSelect={canSelect}
                       />
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={data.length}
                    rowsPerPage={parseInt(rowsPerPage)}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage={'Wierszy na stronę'}
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} z ${count}`}
                />
            </Paper>
        </Box>
    </>

}

export default DataTable;
