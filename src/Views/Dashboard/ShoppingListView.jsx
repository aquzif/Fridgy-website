import styled from "styled-components";
import {useSelector} from "react-redux";
import {useEffect} from "react";
import {request} from "@/Store/Reducers/ShoppingListReducer";
import store from "@/Store/store";

const Container = styled.div`
  max-width: 800px;
  background-color: white;
  min-height: calc(100% - 100px);
  margin: 20px auto;
  padding: 30px;
  border-radius: 10px;
  
  @media (max-width: 1050px) {
    width: calc(100% - 100px);
  }

`;


const ShoppingListView = () => {

    const {
        shoppingLists,
        selectedShoppingListID
    } = useSelector(state => state.shoppingListReducer);
    console.log(shoppingLists);
    useEffect(() => {
        store.dispatch(request());
    },[]);

    const selectedShoppingList = shoppingLists.find((shoppingList) => shoppingList.id === selectedShoppingListID);

    return (
        <Container>
            <h2>Lista zakupów</h2>
            <h5>{ selectedShoppingListID > 0 ? selectedShoppingList.name : 'Wybierz Listę zakupów bądź utwórz nową' }</h5>
            <select>
                {shoppingLists.map((shoppingList) => (
                    <option key={shoppingList.id} value={shoppingList.id}>{shoppingList.name}</option>
                ))}
            </select>

        </Container>
    )
}

export default ShoppingListView;
