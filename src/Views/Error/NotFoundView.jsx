import styled from "styled-components";


const Title = styled.h1`
    width: 100%;
    text-align: center;
    font-size: 100px;
    margin-top: 100px;
`;

const SubTitle = styled.h2`
    width: 100%;
    text-align: center;
    font-size: 50px;
`;

const NotFoundView = () => {

    return (
        <div className="container">
            <Title>404</Title>
            <SubTitle>Nie odnaleziono strony</SubTitle>
        </div>
    );

}

export default NotFoundView;
