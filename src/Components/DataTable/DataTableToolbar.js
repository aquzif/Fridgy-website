import {alpha, CircularProgress, Toolbar, Tooltip, Typography} from "@mui/material";
import IconButton from "@mui/material/IconButton";

import {useState} from "react";
import Input from "@mui/material/Input";

const TableTool = ({label = '',onClick=()=>{},icon}) => {

    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        await onClick();
        setIsLoading(false);
    }

    return (
        <Tooltip title={label}>
            <IconButton onClick={handleClick} disabled={isLoading}>
                {
                    isLoading ? <CircularProgress size={24} /> : icon
                }

            </IconButton>
        </Tooltip>
    )

}

const DataTableToolbar = (
    {
        numSelected,
        title,
        titleMinWidth,
        tools = [],
        searchBar= false,
        onSearch = () => {}
    }
) => {

    let toolsToDisplay = [];

    if(tools.filter(tool => tool.showAlways).length > 0)
        toolsToDisplay = [...toolsToDisplay,...tools.filter(tool => tool.showAlways)]

    if(numSelected === 0 && tools.filter(tool => !tool.showAlways && !tool.forSelect).length > 0)
        toolsToDisplay = [...toolsToDisplay,...tools.filter(tool => !tool.showAlways && !tool.forSelect)]

    if(numSelected === 1 && tools.filter(tool => !tool.showAlways && tool.forSelect && tool.singleSelect).length > 0)
        toolsToDisplay = [...toolsToDisplay,...tools.filter(tool => !tool.showAlways && tool.forSelect && tool.singleSelect)]

    if(numSelected > 0 && tools.filter(tool => !tool.showAlways && tool.forSelect && !tool.singleSelect).length > 0)
        toolsToDisplay = [...toolsToDisplay,...tools.filter(tool => !tool.showAlways && tool.forSelect && !tool.singleSelect)]

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
                borderBottom: '1px solid rgba(224, 224, 224, 1)',
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    color="inherit"
                    variant="subtitle1"
                    minWidth={titleMinWidth}
                    component="div"
                >
                    wybrano: {numSelected}
                </Typography>
            ) : (
                <Typography
                    variant="h5"
                    minWidth={titleMinWidth}
                    id="tableTitle"
                    component="div"
                >
                    {title}
                </Typography>
            )}
            {searchBar && (
                <div style={{flex: '1 1 100%'}}>
                    <Input
                        sx={{width: '70%',marginLeft: '15%'}}
                        placeholder={'Wyszukaj...'}
                        onChange={onSearch}
                    />
                </div>
            )}
            <div style={{minWidth: toolsToDisplay.length*50}}>
                {
                    toolsToDisplay.map((tool, index) => (<TableTool key={`${tool.name} ${index}`} {...tool} />))
                }
            </div>
        </Toolbar>
    );

}

export default DataTableToolbar;
