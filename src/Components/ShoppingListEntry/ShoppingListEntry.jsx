import styled from 'styled-components';
import {Checkbox, IconButton} from "@mui/material";
import {toggleEntry} from "@/Store/Reducers/ShoppingListReducer";
import store from "@/Store/store";
import {Edit, EditNote} from "@mui/icons-material";
import {useState} from "react";


const Container = styled.div`
  width: 100%;
  height: 50px;
  //border: 1px dashed black;
  //margin: 10px 0;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  
  &:hover {
    background-color: #f5f5f5;
    box-shadow: 0 0 5px 0 rgba(0,0,0,0.2);
  }
`;

const Title = styled.h3`
  font-weight: normal;
  ${props => props.checked && `
    text-decoration: line-through;
    color: gray;
  `}
`;

const Subtitle = styled.h4`
  font-weight: normal;
  color: gray;
  font-size: 12px;
  ${props => props.checked && 'text-decoration: line-through;'}
`;


const ShoppingListEntry = (
    {
        data,
        shoppingList
    }
) => {

    const {checked} = data;

    const [hover,setHover] = useState(false);

    const onToggleCheck = () => {
        store.dispatch(toggleEntry({
            shoppingListID: shoppingList.id,
            shoppingListEntryID: data.id,
            newState: !checked
        }))
    }




    return <Container onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
    >
        <Checkbox checked={data.checked}
                  onChange={onToggleCheck}

                  style={{margin: '4px'}} />
        <div style={{margin: '5px',width: 'calc(100% - 100px)'}}
             onClick={onToggleCheck}
        >
            <Title checked={checked} >{data.product_name}</Title>
            <Subtitle checked={checked} >{data.amount} x {data.unit_name}</Subtitle>

        </div>
        <div style={{padding: '5px'}} >
            { hover &&
                <IconButton>
                <Edit />
            </IconButton>
            }
        </div>
    </Container>
}

export default ShoppingListEntry;