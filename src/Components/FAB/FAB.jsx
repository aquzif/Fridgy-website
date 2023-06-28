import {Add} from "@mui/icons-material";
import {Fab as F} from "@mui/material";
import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
`;

const FAB = (
    {
        icon = <Add />,
        onClick = () => {}
    }
) => {

    return <Container>
        <F color={'primary'} onClick={onClick} >
            {icon}
        </F>
    </Container>
}

export default FAB;