import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, FormControl, FormHelperText,
    InputLabel, MenuItem, Select,
    Slide
} from "@mui/material";
import {forwardRef, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {requestShoppingLists} from "@/Store/Reducers/ShoppingListReducer";
import store from "@/Store/store";
import toast from "react-hot-toast";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const ShoppingListSelectDialog = (
    {
        open = false,
        onClose = (id) => {}
    }
) => {

    const [selectedList, setSelectedList] = useState(0);

    const handleClose = () => onClose(0);
    const handleSubmit = () => {
        if(selectedList === 0){
            toast.error('Wybierz listę zakupów');
            return;
        }
        onClose(selectedList);
    }

    const {shoppingLists,isLoading} = useSelector(state => state.shoppingListReducer);

    useEffect(() => {
        setSelectedList(0);
        store.dispatch(requestShoppingLists());
    },[]);

    console.log(shoppingLists);

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
        >
            <DialogTitle>Wybierz listę zakupów</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <FormControl fullWidth variant={'standard'}
                    >
                        <InputLabel>Typ Wpisu</InputLabel>
                        <Select
                            disabled={isLoading}
                            value={selectedList}
                            variant={'standard'}
                            name={'type'}
                            label="Lista"
                            onChange={(e) => setSelectedList(e.target.value)}
                        >
                            {
                                shoppingLists.map((list) => (
                                    <MenuItem key={list.id} value={list.id}>{list.name}</MenuItem>
                                ))
                            }
                            <MenuItem value={0}>Wybierz listę</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color={'warning'} onClick={handleClose}>Anuluj</Button>
                <Button onClick={handleSubmit} >Potwierdź</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ShoppingListSelectDialog;