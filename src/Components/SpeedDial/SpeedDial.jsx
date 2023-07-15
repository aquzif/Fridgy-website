import SD  from '@mui/material/SpeedDial';
import {SpeedDialAction, SpeedDialIcon} from "@mui/material";
import styled from "styled-components";
import {Edit} from "@mui/icons-material";

const Container = styled.div`
    position: absolute;
    bottom: 16px;
    right: 16px;
`;

const SpeedDial = (
    {
        icon = <Edit />,
        openIcon = <Edit />,
        actions = []
    }) => {
    return <Container>
        <SD
            ariaLabel="SpeedDial openIcon example"
            sx={{ position: 'absolute', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon openIcon={openIcon} icon={icon} />}
        >
            {actions.map((action) => (
                <SpeedDialAction
                    onClick={action.onClick}
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                />
            ))}
        </SD>
    </Container>
}

export default SpeedDial;