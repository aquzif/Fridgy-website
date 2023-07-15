

const toggleShoppingListEntryCheckAction = (state,action) => {

    const {
        shoppingListID,
        shoppingListEntryID,
        newState
    } = action.payload;


    state.shoppingLists =
        state.shoppingLists.map(sl => {
           if(sl.id === shoppingListID){
               sl.entries = sl.entries.map(sle => {
                   if(sle.id === shoppingListEntryID){
                       sle.checked = newState;
                   }
                   return sle;
               });
           }
           return sl;
        });

}

export default toggleShoppingListEntryCheckAction;