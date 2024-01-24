import styled from "styled-components";


const Container = styled.div`
  width: calc(100% - 100px);
  background-color: white;
  min-height: calc(100% - 100px);
  margin: 20px auto;
  padding: 30px;
  border-radius: 10px;
`;

const RecipesView = () => {
    return <Container>
        <h2>Przepisy</h2>
    </Container>
}

export default RecipesView;
