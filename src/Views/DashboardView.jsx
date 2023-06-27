import {Outlet, useLocation} from "react-router-dom";
import Navigation from "@/Components/Navigation/Navigation";
import {useEffect, useState} from "react";
import styled from "styled-components";
import TopBar from "@/Components/TopBar/TopBar";
import {useMediaQuery} from "@/Hooks/useMediaQuery";


const Container = styled.div`
    width: calc(100vw - 250px);
    height: 100vh;
    background-color: #F3F3F3;

    @media (max-width: 768px) {
        width: 100vw;
    }

`;

const Flex = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
`;

const OutletContainer = styled.div`
  width: 100%;
  overflow: auto;
`;

const DashboardView = () => {

    const [navOpen, setNavOpen] = useState(true);

    const mobile = useMediaQuery('(max-width: 768px)');
    const loc = useLocation();

    useEffect(() => {
        setNavOpen(false);
    }, [ loc ]);

    const onNavClick = () => setNavOpen(!navOpen);


    return (
        <Flex>
            <Navigation open={navOpen} onClose={onNavClick} />
            <Container>
                <TopBar onOpen={onNavClick} />
                <OutletContainer
                    style={{
                        height: mobile ? 'calc(100% - 71px)' : 'calc(100% - 51px)'
                    }}
                >
                    <Outlet />
                </OutletContainer>
            </Container>
        </Flex>
    )


}

export default DashboardView;
