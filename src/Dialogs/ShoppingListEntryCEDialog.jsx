import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, TextField} from "@mui/material";
import {forwardRef, useEffect, useRef} from "react";
import {useFormik} from "formik";
import ShoppingListEntrySchema from "@/Schemas/ShoppingListEntrySchema";
import {useSelector} from "react-redux";
import toast from "react-hot-toast";
import store from "@/Store/store";
import {request} from "@/Store/Reducers/ShoppingListReducer";
import ShoppingListEntriesAPI from "@/API/ShoppingListEntriesAPI";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const ShoppingListEntryCEDialog = (
    {
        open = false,
        onClose = (res) => {},
        editMode = false,
        editEntryID = null,
    }
) => {

    const {
        shoppingLists,
        selectedShoppingListID
    } = useSelector(state => state.shoppingListReducer);
    const selectedShoppingList = shoppingLists.find((shoppingList) => shoppingList.id === selectedShoppingListID);

    const mainInput = useRef(null);
    const formik = useFormik({
        initialValues: {
            product_name: '',
            unit_name: '',
            amount: 0,
        },
        validationSchema: ShoppingListEntrySchema,
        validateOnChange: true,
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
        if(open){
            mainInput?.current?.focus();
            formik.resetForm();
        }

        if(editMode){
            const entryForEdit = selectedShoppingList?.entries.find((entry) => entry.id === editEntryID);

            if(!entryForEdit){
                toast.error('Nie znaleziono wpisu');
                return;
            }

            formik.setValues({
                product_name: entryForEdit?.product_name,
                unit_name: entryForEdit?.unit_name,
                amount: entryForEdit?.amount,
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
            <DialogTitle>
                {editMode ? "Zmodyfikuj wpis" : "Utwórz wpis"}
            </DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <TextField
                        inputRef={mainInput}
                        variant={'standard'}
                        name={'product_name'}
                        label={'Nazwa wpisu'}
                        value={formik.values.product_name}
                        onChange={formik.handleChange}
                        fullWidth
                        error={formik.touched.product_name && Boolean(formik.errors.product_name)}
                        helperText={formik.touched.product_name && formik.errors.product_name}
                    />
                    <TextField
                        variant={'standard'}
                        name={'unit_name'}
                        label={'Jednostka'}
                        value={formik.values.unit_name}
                        onChange={formik.handleChange}
                        fullWidth
                        error={formik.touched.unit_name && Boolean(formik.errors.unit_name)}
                        helperText={formik.touched.unit_name && formik.errors.unit_name}
                    />
                    <TextField
                        variant={'standard'}
                        name={'amount'}
                        type="number"
                        label={'Ilość'}
                        value={formik.values.amount}
                        onChange={formik.handleChange}
                        fullWidth
                        error={formik.touched.amount && Boolean(formik.errors.amount)}
                        helperText={formik.touched.amount && formik.errors.amount}
                    />

                </DialogContent>
                <DialogActions>
                    <Button color={'warning'} onClick={handleClose}>Anuluj</Button>
                    <Button type={'submit'} onClick={formik.handleSubmit} >{editMode ? "Zaktualizuj" : 'Stwórz'}</Button>
                </DialogActions>
            </form>
        </Dialog>
    )

}

export default ShoppingListEntryCEDialog;