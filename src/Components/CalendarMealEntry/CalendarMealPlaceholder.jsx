import styled from "styled-components";

const Container = styled.div`
  border: 3px dashed #e1e0e0;
  height: 160px;
  margin-bottom: 20px;
  border-radius: 20px;
  background-color: white;
  transition: 0.2s;
  
  
  &:hover {
    cursor: pointer;
    border: 3px dashed #c1c0c0;
  }
`;

const Title = styled.p`
    text-align: center;
    height: 20px;
  margin: 45px 0px;
    
`;

const MealName = styled.p`
    position: relative;
    padding: 2px 20px 2px 8px;
    color: gray;
    display: block;
    width: fit-content;
    border-bottom-right-radius: 20px;
`;

const CalendarMealPlaceholder = (
    {
        mealName = '',
        onClick
    }
) => {
    return <Container onClick={onClick} >
        <MealName>{mealName}</MealName>
        <Title>Dodaj posiłek</Title>
    </Container>
}

export default CalendarMealPlaceholder;