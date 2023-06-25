import styled from "styled-components";
import {useMatch, useNavigate} from "react-router-dom";
import {Icon} from "@iconify/react/offline";


const Container = styled.div`
    background-color: #2B2B2B;
    border-radius: 8px;
    border: 1px solid transparent;
    max-width: 210px;
    margin: 6px auto;
    display: flex;
    flex-direction: row;

    &:hover {
        border: 1px solid #494949;
        cursor: pointer;
    }

    @media (max-width: 768px) {
        max-width: 300px;
        margin: 20px auto;
    }
`;

const Title = styled.p`
    color: #bebebe;
    font-size: 15px;
    padding: 12px 0px;

    @media (max-width: 768px) {
        font-size: 20px;
        padding: 16px 0px;
    }
`;

const StyledIcon = styled(Icon)`
    width: 24px;
    height: 24px;
    padding: 8px 16px;
    color: #494949;

    @media (max-width: 768px) {
        width: 32px;
        height: 32px;
        padding: 10px 16px;
    }

`;

const NavItem = (
    {
        name,
        icon,
        url
    }
) => {

     const match = useMatch(url);
     const navigate = useNavigate();

     const handleClick = () => {
         navigate(url);
     }

     const color = match ? '#FACC2C' : '#494949';

    return (
        <Container onClick={handleClick} >
            <StyledIcon style={{color}} icon={icon} />
            <Title style={{color}} >{name}</Title>
        </Container>
    )

}

export default NavItem;
