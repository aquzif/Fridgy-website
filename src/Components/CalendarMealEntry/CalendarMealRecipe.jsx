import styled from "styled-components";
import NetworkUtils from "@/Utils/NetworkUtils";
import {Checkbox, IconButton} from "@mui/material";
import {Edit} from "@mui/icons-material";

const Container = styled.div`
  height: 160px;
  margin-bottom: 20px;
  border-radius: 20px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  background-color: white;
  
  &:hover {
    cursor: pointer;
  }
`;

const MealName = styled.p`
    padding: 2px 20px 2px 8px;
    background-color: white;
    display: block;
    width: fit-content;
    border-bottom-right-radius: 20px;
  color: gray;
`;

const RecipeName = styled.p`
    padding: 2px 10px 2px 8px;
    background-color: white;
    display: block;
    width: fit-content;
    border-top-right-radius: 20px;
    color: gray;
    max-width: 80%;
    text-overflow: ellipsis;
    white-space: nowrap;
  overflow: hidden;
  position: absolute;
  bottom: 0;
`;

const RecipeEditButton = styled.div`
position: absolute;
  top: -6px;
  right: -6px;
  padding: 5px;
  
`;


const CalendarMealRecipe = ({meal,mealName,onClick, onEdit,selectMode, onCheck}) => {

    const handleClick = (e) => {
        if(e.target.tagName !== 'BUTTON'
            && e.target.tagName !== 'svg'
            && e.target.tagName !== 'path'
            && e.target.tagName !== 'INPUT'
        ){
            onClick();
        }
    }

    return <Container
        onClick={handleClick}
        style={{backgroundImage: `url(${NetworkUtils.fixBackendUrl(meal.recipe.image)})`}}
    >
        <MealName>
            {mealName}
        </MealName>
        <RecipeName>
            {meal.recipe.name}
        </RecipeName>
        <RecipeEditButton >
            {
                selectMode ?
                    <Checkbox
                        sx={{color: 'white'}}
                        checked={meal.selected}
                        onChange={(e) => onCheck(meal.id)}

                    /> : <IconButton onClick={onEdit} >
                    <Edit sx={{color: 'white'}} />
                </IconButton>
            }

        </RecipeEditButton>
    </Container>
}

export default CalendarMealRecipe;