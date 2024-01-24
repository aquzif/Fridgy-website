import {Checkbox, TableBody, TableCell, TableRow, Tooltip, Typography} from "@mui/material";
import IconButton from "@mui/material/IconButton";

const DataTableBody = ({
    columns,
    data,
    selected,
    onSelectClick,
    emptyMessage,
    loaded,
    onRowClick,
    canSelect,
    inlineTools
}) => {



    return  <TableBody>
        {
            data.length === 0 && loaded && <TableRow >
                <TableCell colSpan={columns.length+1} align="center" sx={{
                    fontWeight: 'bold'
                }} >
                        {emptyMessage}
                </TableCell>
            </TableRow>
        }
        {data.map((row, index) => {
                const isItemSelected = selected.indexOf(row.id) !== -1;
                const labelId = `enhanced-table-checkbox-${index}`;

                if(columns[index]?.hidden || false) return '';

                return (
                    <TableRow
                        hover
                        onClick={
                            e => e.target.localName !== 'input'
                                && e.target.localName !== 'button'
                                && e.target.localName !== 'svg'
                                && e.target.localName !== 'path'
                                && onRowClick(row.id)
                        }
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                    >
                        {
                            canSelect && <TableCell padding="checkbox" >
                                <Checkbox
                                    onChange={(event) => onSelectClick(event,row.id)}
                                    color="primary"
                                    checked={isItemSelected}
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </TableCell>
                        }

                        {columns.map((column) => {
                            return <TableCell
                                key={column.name}
                            >{row[column.name]}</TableCell>
                        })}
                        {
                            inlineTools.length > 0 && <TableCell align="right">
                                {
                                    inlineTools.map(({onClick,icon,label}) => (
                                        <Tooltip key={label} title={label}>
                                            <IconButton onClick={() => onClick(row)} >
                                                {icon}
                                            </IconButton>
                                        </Tooltip>
                                    ))
                                }
                            </TableCell>
                        }
                    </TableRow>
                );
            })}

    </TableBody>;

}

export default DataTableBody;
