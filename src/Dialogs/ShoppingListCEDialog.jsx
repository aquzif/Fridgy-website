import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide,
    TextField
} from "@mui/material";
import {forwardRef, useEffect, useRef, useState} from "react";
import {useFormik} from "formik";
import ShoppingListSchema from "@/Schemas/ShoppingListSchema";
import StringUtils from "@/Utils/StringUtils";
import ShoppingListsAPI from "@/API/ShoppingListsAPI";
import toast from "react-hot-toast";
import ShoppingListReducer, {request, selectShoppingList} from "@/Store/Reducers/ShoppingListReducer";
import store from "@/Store/store";
import {useSelector} from "react-redux";


const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const ShoppingListCEDialog = (
    {
        open = false,
        onClose = () => {},
        editMode=false,
    }
) => {

    const mainInput = useRef(null);

    const {
        shoppingLists,
        selectedShoppingListID
    } = useSelector(state => state.shoppingListReducer);

    const handleClose = () => {
        onClose();
    }

    const selectedShoppingList = shoppingLists.find((shoppingList) => shoppingList.id === selectedShoppingListID);
    const editShoppingListID = selectedShoppingList?.id;

    const formik = useFormik({
        initialValues: {
            name: '',
        },
        validationSchema: ShoppingListSchema,
        validateOnChange: true,
        onSubmit: async (values) => {
            if(editMode){
                await toast.promise(ShoppingListsAPI.update(editShoppingListID, values),{
                    loading: 'Aktualizowanie listy zakupów...',
                    success: 'Lista zakupów została zaktualizowana',
                    error: 'Nie udało się zaktualizować listy zakupów'
                });
            }else{
                // ShoppingListsAPI.create(values)
                const result = await toast.promise(ShoppingListsAPI.create(values),{
                    loading: 'Tworzenie listy zakupów...',
                    success: 'Lista zakupów została utworzona',
                    error: 'Nie udało się utworzyć listy zakupów'
                });
                store.dispatch(selectShoppingList(result.data.id));

            }
            store.dispatch(request());
            handleClose();
        }
    });
    useEffect(() => {
        if(open){
            mainInput?.current?.focus();
            formik.resetForm();
        }

        if(editMode){
            formik.setValues({
                name: selectedShoppingList?.name
            });
        }

    }, [open,editMode]);

    return (
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
            >
                <DialogTitle>{
                    editMode ? "Zmodyfikuj listę zaupów" : "Utwórz nową listę zakupów"
                }</DialogTitle>
                <form onSubmit={formik.handleSubmit}>
                    <DialogContent>
                        <TextField
                            inputRef={mainInput}
                            variant={'standard'}
                            name={'name'}
                            label={'Nazwa listy zakupów'}
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
                </form>
            </Dialog>
    )
}

export default ShoppingListCEDialog;