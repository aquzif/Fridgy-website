import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import NavItem from "@/Components/NavItem/NavItem";

import basketOutline from '@iconify/icons-mdi/basket-outline';
import receiptText from '@iconify/icons-mdi/receipt-text';
import fruitWatermelon from '@iconify/icons-mdi/fruit-watermelon';
import MiniNavItem from "@/Components/MiniNavItem/MiniNavItem";
import accountIcon from '@iconify/icons-mdi/account';
import cogIcon from '@iconify/icons-mdi/cog';
import baselineMeetingRoom from '@iconify/icons-ic/baseline-meeting-room';
import chevronLeft from '@iconify/icons-mdi/chevron-left';
import categoryIcon from '@iconify/icons-mdi/category';
import gearIcon from '@iconify/icons-mdi/gear';
import AuthAPI from "@/API/AuthAPI";
import store from "@/Store/store";
import {logout} from "@/Store/Reducers/AuthReducer";
import toast from "react-hot-toast";
import {useMediaQuery} from "@/Hooks/useMediaQuery";
import {Icon} from "@iconify/react/offline";


const Container = styled.div`
    background-color: #2B2B2B;
    width: 250px;
    height: 100vh;
    transition: left 0.2s ease-in;
    z-index: 1000; 


    @media (max-width: 768px) {
        width: 100vw;
    }

`;

const Title = styled.h2`
    color: #FACC2C;
    font-weight: bold;
    font-size: 32px;
    padding-top: 5px;
    text-align: center;
    letter-spacing: 4px;
    height: 45px;

    @media (max-width: 768px) {
    padding: 30px 0px;
    }
`;

const MiniNav = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: row;
    width: 100%;
    height: 32px;
    background-color: #494949;
    margin-bottom: 10px;


    @media (max-width: 768px) {
        height: 50px;
    }
`;

const ExitIcon = styled(Icon)`
    position: absolute;
    top: 25px;
    left: 25px;
    width: 50px;
    height: 50px;
    color: #FACC2C;
`;





const Navigation = ({
    open,
    onClose
}) => {

    const navigate = useNavigate();

    const onAvatarCLick = () => navigate('/profil');
    const onSettingsClick = () => navigate('/ustawienia');
    const onLogoutClick = () => {
        toast.promise(AuthAPI.logout(),{
            loading: 'Wylogowywanie...',
            success: 'Wylogowano pomyślnie',
            error: 'Wylogowano z błędami'
        }).finally(() => {
            store.dispatch(logout());
        });
    }

    const isNavMobile = useMediaQuery('(max-width: 768px)');

    return (
        <Container
            style={isNavMobile ? {
                left: open ? '0' : '-100vw',
                position: 'absolute',

            } : {}}
        >
            {isNavMobile && <ExitIcon icon={chevronLeft} onClick={onClose} />}
            <Title>Fridgy</Title>

            <MiniNav>
                <MiniNavItem icon={accountIcon} onClick={onAvatarCLick} />
                <MiniNavItem icon={cogIcon} onClick={onSettingsClick} />
                <MiniNavItem icon={baselineMeetingRoom} onClick={onLogoutClick} />
            </MiniNav>
            <nav>
                <NavItem name={'Lista zakupów'} icon={basketOutline} url={'/lista-zakupow'} />
                <NavItem name={'Przepisy'} icon={receiptText} url={'/przepisy'} />
                <NavItem name={'Produkty'} icon={fruitWatermelon} url={'/produkty'} />
                {/*<NavItem name={'Kategorie'} icon={categoryIcon} url={'/kategorie'} />*/}
                <NavItem name={'Ustawienia aplikacji'} icon={gearIcon} url={'/admin/ustawienia'} />

            </nav>
        </Container>
    )

}

export default Navigation;
