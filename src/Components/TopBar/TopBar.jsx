import styled from "styled-components";
import {Icon} from "@iconify/react/offline";
import {useMediaQuery} from "@/Hooks/useMediaQuery";
import menuIcon from '@iconify/icons-mdi/menu';
import barcodeScan from '@iconify/icons-mdi/barcode-scan';
import {useNavigate} from "react-router-dom";


const Container = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 50px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid #bcbaba;

    @media (max-width: 768px) {
        height: 70px;
    }
`;

const OpenIcon = styled(Icon)`
    margin: 10px;
    width: 50px;
    height: 50px;
    color: #545454;
`;

const Logo = styled.p`
    width: calc(100vw - 140px);
    padding-top: 16px;
    text-align: center;
    color: #FACC2C;
    font-weight: bold;
    font-size: 30px;
    letter-spacing: 2px;
`;

const TopBar = ({
    onOpen
}) => {

    const isMobile = useMediaQuery('(max-width: 768px)');
    const navigate = useNavigate();



    return (
        <Container>
            {isMobile && <>
                <OpenIcon icon={menuIcon} onClick={onOpen} />
                <Logo>Fridgy</Logo>
                <OpenIcon icon={barcodeScan} onClick={() => navigate('/skaner')} />
            </>}


        </Container>
    )

}

export default TopBar;
