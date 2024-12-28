import {Checkbox, Collapse, TableBody, TableCell, TableRow, Tooltip, Typography} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {useState} from "react";
import {KeyboardArrowDown, KeyboardArrowUp} from "@mui/icons-material";


const DataTableRow = (
    {
        row,
        columns,
        selected,
        onSelectClick,
        onRowClick,
        canSelect,
        inlineTools,
        isItemSelected,
        labelId,
        collapsibleContent,
        collapsible,
    }
) => {


    const [open, setOpen] = useState(false);


    return <>
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
                collapsible && <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
            }
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
                >

                    {
                        (row[column.name] === true ||
                            row[column.name] === false) ? (
                            <Checkbox
                                color="primary"
                                checked={row[column.name]}
                                inputProps={{
                                    'aria-labelledby': labelId,
                                }}
                            />
                        ) : row[column.name]
                    }



                </TableCell>
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
        {
            collapsibleContent && <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        {collapsibleContent(row)}
                    </Collapse>
                </TableCell>
            </TableRow>
        }
    </>
}

const DataTableBody = ({
    columns,
    data,
    selected,
    onSelectClick,
    emptyMessage,
    loaded,
    onRowClick,
    canSelect,
    inlineTools,
    collapsibleContent,
    collapsible
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

                return <DataTableRow

                    key={row.id}
                    row={row}
                    columns={columns}
                    selected={selected}
                    onSelectClick={onSelectClick}
                    onRowClick={onRowClick}
                    canSelect={canSelect}
                    inlineTools={inlineTools}
                    isItemSelected={isItemSelected}
                    labelId={labelId}
                    collapsibleContent={collapsibleContent}
                    collapsible={collapsible}

                />
            })}

    </TableBody>;

}

export default DataTableBody;
