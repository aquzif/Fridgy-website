import {IconButton, Tooltip} from "@mui/material";
import {Refresh} from "@mui/icons-material";

const TooltipIconButton = (
    {
        title = 'Wykonaj',
        arrow = true,
        disabled = false,
        onClick = () => {},
        icon = <Refresh />
    }
) => {
    return (
        <Tooltip title={title} arrow={arrow}>
            <IconButton disabled={disabled} onClick={onClick} >
                {icon}
            </IconButton>
        </Tooltip>
    )
}

export default TooltipIconButton;