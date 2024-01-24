import {Box, Checkbox, TableCell, TableHead, TableRow, TableSortLabel} from "@mui/material";

const DataTableHeader = ({
    columns,
    numSelected,
    rowCount,
    order,
    orderBy,
    handleRequestSort,
    onSelectAllClick,
    useInlineActions,
    canSelect
    }) => {

    return <TableHead>
        <TableRow>
            {
                canSelect && <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
            }
            {columns.filter(col => !col.hidden).map((column) => (
                <TableCell
                    key={column.name}
                    style={ column.minWidth ? {minWidth: column.minWidth} : {}}

                    sortDirection={orderBy === column.name ? order : false}
                >
                    <TableSortLabel
                        active={orderBy === column.name}
                        direction={orderBy === column.name ? order : 'asc'}
                        onClick={() => handleRequestSort(column.name)}
                    >
                        {column.label}
                        {orderBy === column.id ? (
                            <Box component="span" >
                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </Box>
                        ) : null}
                    </TableSortLabel>
                </TableCell>
            ))}
            {
                useInlineActions && <TableCell align="right">
                    Akcje
                </TableCell>
            }
        </TableRow>
    </TableHead>

}

export default DataTableHeader;
