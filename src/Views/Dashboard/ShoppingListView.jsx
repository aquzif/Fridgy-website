import styled from "styled-components";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {requestShoppingLists, selectShoppingList} from "@/Store/Reducers/ShoppingListReducer";
import store from "@/Store/store";
import {FormControl, Grid, IconButton, InputLabel, LinearProgress, MenuItem, Select, Tooltip} from "@mui/material";


import {Add, Delete, EditNote, Refresh} from "@mui/icons-material";
import FAB from "@/Components/FAB/FAB";
import ShoppingListCEDialog from "@/Dialogs/ShoppingListCEDialog";
import ConfirmDialog from "@/Dialogs/ConfirmDialog";
import toast from "react-hot-toast";
import ShoppingListsAPI from "@/API/ShoppingListsAPI";
import ShoppingListEntryCEDialog from "@/Dialogs/ShoppingListEntryCEDialog";
import ShoppingListEntry from "@/Components/ShoppingListEntry/ShoppingListEntry";

import ShoppingListEntriesAPI from "@/API/ShoppingListEntriesAPI";
import ArrayUtils from "@/Utils/ArrayUtils";
import {requestProductCategories} from "@/Store/Reducers/ProductCategoryReducer";
import useVisiblityChange from "@/Hooks/useVisiblityChange";
import ShoppingListUtils from "@/Utils/ShoppingListUtils";
import {ray} from "node-ray/web";
import TooltipIconButton from "@/Components/TooltipIconButton/TooltipIconButton";


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

const EntriesContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
`;


const ShoppingListView = () => {


    const [shoppingListCUDialogOpen, setShoppingListCUDialogOpen] = useState(false);
    const [shoppingListEntryCUDialogOpen, setShoppingListEntryCUDialogOpen] = useState(false);
    const [editMode,setEditMode] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const [editEntryID,setEditEntryID] = useState(null);
    const isVisible = useVisiblityChange();

    let {
        shoppingLists,
        selectedShoppingListID,
        isLoading,
    } = useSelector(state => state.shoppingListReducer);
    selectedShoppingListID = selectedShoppingListID || 0;

    const selectedShoppingList = shoppingLists.find((shoppingList) => shoppingList.id === selectedShoppingListID);
    const load = () => {
        store.dispatch(requestShoppingLists());
        store.dispatch(requestProductCategories());
    }

    useEffect(() => {
        if(isVisible) load();
    },[isVisible]);

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

    const handleOpenShoppingListEntryEditDialog = (entryID) => {
        setEditEntryID(entryID);
        setEditMode(true);
        setShoppingListEntryCUDialogOpen(true);
    }


    const handleOpenShoppingListEntryDeleteDialog = async (entryID) => {
        const result = await ShoppingListEntriesAPI.delete(selectedShoppingListID,entryID);

        store.dispatch(requestShoppingLists());
    }

    const handleConfirmDialogClose = async (result) => {
        setDeleteDialogOpen(false);
        if(result){
            await toast.promise(ShoppingListsAPI.delete(selectedShoppingListID),{
                loading: 'Usuwanie listy zakupów...',
                success: 'Lista zakupów została usunięta',
                error: 'Nie udało się usunąć listy zakupów'
            });

            store.dispatch(selectShoppingList(0));
            store.dispatch(requestShoppingLists());


        }
    }

    const handleCloseShoppingListEntryCUDialog = async (result) => {
        setEditMode(false);
        setShoppingListEntryCUDialogOpen(false);

    }

    console.log(selectedShoppingList);

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
                editEntryID={editEntryID}
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
                            {(selectedShoppingListID) === 0 && (
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
                        <TooltipIconButton
                            title={'Utwórz nową listę'}
                            onClick={handleOpenShoppingListCreateDialog}
                            icon={<Add />}
                        />
                        <TooltipIconButton
                            title={'Edytuj listę'}
                            disabled={shoppingLists.length === 0}
                            onClick={handleOpenShoppingListEditDialog}
                            icon={<EditNote />}
                        />
                        <TooltipIconButton
                            title={'Usuń listę'}
                            disabled={shoppingLists.length === 0}
                            onClick={handleShoppingListDeleteButton}
                            icon={<Delete />}
                        />
                       <TooltipIconButton
                           title={'Odśwież'}
                           disabled={isLoading}
                           onClick={load}
                           icon={<Refresh />}
                       />
                    </div>
                </Grid>
            </Grid>
            {isLoading ? <LinearProgress /> : <div style={{height: '4px'}} ></div>}

            <EntriesContainer>
                {
                    ShoppingListUtils.sortAndPrepareShoppingList(selectedShoppingList)
                        .map((entry) => {
                            ray(entry.type).blue();
                            if(entry.type === 'category')
                                return <h3>{entry.category == 'undefined' ? 'Bez kategorii' : entry.category}</h3>
                            else
                                return <ShoppingListEntry
                                    key={entry.id}
                                    shoppingList={selectedShoppingList}
                                    onEdit={handleOpenShoppingListEntryEditDialog}
                                    onDelete={handleOpenShoppingListEntryDeleteDialog}

                                    data={entry} />
                        })
                }
            </EntriesContainer>
            <FAB
                onClick={handleOpenShoppingListEntryCreateDialog}
            />
        </Container>
    )
}


export default ShoppingListView;
