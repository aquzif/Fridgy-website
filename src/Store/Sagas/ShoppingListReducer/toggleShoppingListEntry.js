import store from "@/Store/store";
import ShoppingListEntriesAPI from "@/API/ShoppingListEntriesAPI";

function* toggleShoppingListEntry ({payload}){
    const {
        shoppingListID,
        shoppingListEntryID,
        newState
    } = payload;

    const shoppingListEntry = store.getState().shoppingListReducer?.shoppingLists?.
        find(sl => sl.id === shoppingListID)?.entries?.find(sle => sle.id === shoppingListEntryID);


    if(!shoppingListEntry) return;

    const result = yield ShoppingListEntriesAPI.update(shoppingListID, shoppingListEntryID, {
        checked: newState
    });

}

export default toggleShoppingListEntry;

