import styled from "styled-components";
import {useSelector} from "react-redux";
import {useEffect} from "react";
import {request} from "@/Store/Reducers/ShoppingListReducer";
import store from "@/Store/store";
import {FormControl, Grid, IconButton, InputLabel, MenuItem, Select} from "@mui/material";
import SpeedDial from "@/Components/SpeedDial/SpeedDial";
import {Add, Delete, EditNote, Remove} from "@mui/icons-material";
import FAB from "@/Components/FAB/FAB";

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

    const speedDialActions = [
        {icon: <Add />, name: 'Dodaj produkt'},
    ];

    return (
        <Container>
            <Grid container spacing={2} >
                <Grid item xs={12} md={6} >
                    <h2>Lista zakupów</h2>
                    <h5>{ selectedShoppingListID > 0 ? selectedShoppingList.name : 'Wybierz Listę zakupów bądź utwórz nową' }</h5>
                </Grid>
                <Grid item xs={12} md={6} >
                    <FormControl variant="standard" fullWidth>
                        <InputLabel >Lista zakupów</InputLabel>
                        <Select
                            disabled={!Boolean(selectedShoppingListID)}
                            value={selectedShoppingListID}
                        >
                            {selectedShoppingListID === 0 && (
                                <MenuItem value={0}>Brak utworzonych list</MenuItem>
                            )}
                            {shoppingLists.map((shoppingList) => (
                                <MenuItem key={shoppingList.id} value={shoppingList.id}>{shoppingList.name}</MenuItem>
                            ))}

                        </Select>
                    </FormControl>
                    <IconButton>
                        <Add />
                    </IconButton>
                    <IconButton>
                        <Delete />
                    </IconButton>
                    <IconButton>
                        <EditNote />
                    </IconButton>
                </Grid>
            </Grid>
            <FAB />
        </Container>
    )
}

export default ShoppingListView;
