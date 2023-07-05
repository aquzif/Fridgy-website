import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, TextField} from "@mui/material";
import {forwardRef, useEffect, useRef, useState} from "react";
import {useFormik} from "formik";
import ShoppingListEntrySchema from "@/Schemas/ShoppingListEntrySchema";
import {useSelector} from "react-redux";
import toast from "react-hot-toast";
import ShoppingListsAPI from "@/API/ShoppingListsAPI";
import store from "@/Store/store";
import {request, selectShoppingList} from "@/Store/Reducers/ShoppingListReducer";
import ShoppingListEntriesAPI from "@/API/ShoppingListEntriesAPI";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const ShoppingListEntryCEDialog = (
    {
        open = false,
        onClose = (res) => {},
        editEntryID = null,
    }
) => {

    const [editMode, setEditMode] = useState(false);

    const {
        shoppingLists,
        selectedShoppingListID
    } = useSelector(state => state.shoppingListReducer);
    const selectedShoppingList = shoppingLists.find((shoppingList) => shoppingList.id === selectedShoppingListID);

    const mainInput = useRef(null);
    const formik = useFormik({
        initialValues: {
            name: '',
        },
        validationSchema: ShoppingListEntrySchema,
        onSubmit: async (values) => {
            if(!selectedShoppingList){
                toast.error('Nie wybrano listy zakupów');
                return;
            }
            if(editMode){
                await toast.promise(ShoppingListEntriesAPI.update(selectedShoppingListID, editEntryID, values),{
                    loading: 'Aktualizowanie wpisu...',
                    success: 'Wpis został zaktualizowany',
                    error: 'Nie udało się zaktualizować wpisu'
                });
            }else{
                const result = await toast.promise(ShoppingListEntriesAPI.create(selectedShoppingListID, values),{
                    loading: 'Tworzenie wpisu',
                    success:  'Wpis został utworzony',
                    error: 'Nie udało się utworzyć wpisu'
                });
            }
            store.dispatch(request());
            handleClose();
        }
    });

    const handleClose = () =>{
        onClose();
    }

    useEffect(() => {
        if(editEntryID){
            setEditMode(true);
        }
    },[editEntryID])

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
        >
            <DialogTitle>{
                editMode ? "Zmodyfikuj wpis" : "Utwórz wpis"
            }</DialogTitle>
            <DialogContent>
                <TextField
                    inputRef={mainInput}
                    variant={'standard'}
                    name={'name'}
                    label={'Nazwa wpisu'}
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    fullWidth
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                />
            </DialogContent>
            <DialogActions>
                <Button color={'warning'} onClick={handleClose}>Anuluj</Button>
                <Button onClick={formik.handleSubmit} >{editMode ? "Zaktualizuj" : 'Stwórz'}</Button>
            </DialogActions>
        </Dialog>
    )

}

export default ShoppingListEntryCEDialog;