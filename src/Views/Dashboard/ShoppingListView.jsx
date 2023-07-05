import styled from "styled-components";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {request, selectShoppingList} from "@/Store/Reducers/ShoppingListReducer";
import store from "@/Store/store";
import {FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Tooltip} from "@mui/material";
import SpeedDial from "@/Components/SpeedDial/SpeedDial";
import {Add, Delete, EditNote, Remove} from "@mui/icons-material";
import FAB from "@/Components/FAB/FAB";
import ShoppingListCEDialog from "@/Dialogs/ShoppingListCEDialog";
import ConfirmDialog from "@/Dialogs/ConfirmDialog";
import toast from "react-hot-toast";
import ShoppingListsAPI from "@/API/ShoppingListsAPI";
import ShoppingListEntryCEDialog from "@/Dialogs/ShoppingListEntryCEDialog";

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


    const [shoppingListCUDialogOpen, setShoppingListCUDialogOpen] = useState(false);
    const [shoppingListEntryCUDialogOpen, setShoppingListEntryCUDialogOpen] = useState(false);
    const [editMode,setEditMode] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const {
        shoppingLists,
        selectedShoppingListID
    } = useSelector(state => state.shoppingListReducer);

    const selectedShoppingList = shoppingLists.find((shoppingList) => shoppingList.id === selectedShoppingListID);

    useEffect(() => {
        store.dispatch(request());
    },[]);

    const handleCloseShoppingListCUDialog = () => {
        setShoppingListCUDialogOpen(false);
    }

    const handleOpenShoppingListCreateDialog = () => {
        setEditMode(false);
        setShoppingListCUDialogOpen(true);
    }

    const handleOpenShoppingListEditDialog = () => {
        setEditMode(true);
        setShoppingListCUDialogOpen(true);
    }

    const handleShoppingListDeleteButton = () => {
        setDeleteDialogOpen(true);
    }

    const handleShoppingListChange = (e) => {
        store.dispatch(selectShoppingList(e.target.value));
    }

    const handleOpenShoppingListEntryCreateDialog = () => {
        setEditMode(false);
        setShoppingListEntryCUDialogOpen(true);
    }

    const handleOpenShoppingListEntryEditDialog = () => {
        setEditMode(true);
        setShoppingListEntryCUDialogOpen(true);
    }

    const handleConfirmDialogClose = async (result) => {
        setDeleteDialogOpen(false);
        if(result){
            const result = await toast.promise(ShoppingListsAPI.delete(selectedShoppingListID),{
                loading: 'Usuwanie listy zakupów...',
                success: 'Lista zakupów została usunięta',
                error: 'Nie udało się usunąć listy zakupów'
            });

            store.dispatch(selectShoppingList(0));
            store.dispatch(request());


        }
    }

    const handleCloseShoppingListEntryCUDialog = async (result) => {
        setEditMode(false);
        setShoppingListEntryCUDialogOpen(false);

    }
    console.log(selectedShoppingList)
    return (
        <Container>
            <ConfirmDialog
                open={deleteDialogOpen}
                onClose={handleConfirmDialogClose}
                subtitle={'Czy na pewno chcesz usunąć listę zakupów?'}
            />
            <ShoppingListCEDialog
                open={shoppingListCUDialogOpen}
                editMode={editMode}
                onClose={handleCloseShoppingListCUDialog}
            />
            <ShoppingListEntryCEDialog
                open={shoppingListEntryCUDialogOpen}
                editMode={editMode}
                onClose={handleCloseShoppingListEntryCUDialog}
            />
            <Grid container spacing={2} >
                <Grid item xs={12} md={6} >
                    <h2>Lista zakupów</h2>
                    {selectedShoppingListID == 0 && <h5>Wybierz Listę zakupów bądź utwórz nową</h5> }
                </Grid>
                <Grid item xs={12} md={6} >
                    <FormControl variant="standard" fullWidth>
                        <InputLabel >Lista zakupów</InputLabel>
                        <Select
                            disabled={!Boolean(selectedShoppingListID)}
                            value={selectedShoppingListID}
                            onChange={handleShoppingListChange}
                        >
                            {selectedShoppingListID === 0 && (
                                <MenuItem value={0}>Brak utworzonych list</MenuItem>
                            )}
                            {shoppingLists?.map((shoppingList) => (
                                <MenuItem key={shoppingList.id} value={shoppingList.id}>{shoppingList.name}</MenuItem>
                            ))}

                        </Select>
                    </FormControl>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }} >
                        <Tooltip title={'Utwórz nową listę'} arrow>
                            <IconButton onClick={handleOpenShoppingListCreateDialog} >
                                <Add />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={'Usuń listę'} arrow >
                            <IconButton disabled={shoppingLists.length === 0}
                                onClick={handleShoppingListDeleteButton}
                            >
                                <Delete />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={'Edytuj listę'} arrow>
                            <IconButton disabled={shoppingLists.length === 0} onClick={handleOpenShoppingListEditDialog} >
                                <EditNote />
                            </IconButton>
                        </Tooltip>
                    </div>
                </Grid>
            </Grid>
            <FAB
                onClick={handleOpenShoppingListEntryCreateDialog}
            />
        </Container>
    )
}

export default ShoppingListView;
