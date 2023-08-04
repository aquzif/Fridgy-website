import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select,
    Grow,
    TextField
} from "@mui/material";
import {forwardRef, useEffect, useRef, useState} from "react";
import {useFormik} from "formik";
import ShoppingListSchema from "@/Schemas/ShoppingListSchema";
import StringUtils from "@/Utils/StringUtils";
import ShoppingListsAPI from "@/API/ShoppingListsAPI";
import toast from "react-hot-toast";
import ShoppingListReducer, {requestShoppingLists, selectShoppingList} from "@/Store/Reducers/ShoppingListReducer";

import store from "@/Store/store";
import {useSelector} from "react-redux";


const Transition = forwardRef(function Transition(props, ref) {
    return <Grow /*direction="down"*/ ref={ref} {...props} />;
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
            type: 'default',
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
            store.dispatch(requestShoppingLists());

            handleClose();
        }
    });
    useEffect(() => {
        if(open){
            mainInput?.current?.focus();
            formik.resetForm();
            console.log(selectedShoppingList);

            if(editMode){
                formik.setValues({
                    name: selectedShoppingList?.name,
                    type: selectedShoppingList?.type,
                });
            }

        }


    }, [open,editMode]);

    return (
            <Dialog
                open={open}
                TransitionComponent={Transition}
                fullWidth
                maxWidth={'xs'}
                onClose={handleClose}
            >
                <DialogTitle>{
                    editMode ? "Zmodyfikuj listę zaupów" : "Utwórz nową listę zakupów"
                }</DialogTitle>
                <form onSubmit={formik.handleSubmit}>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
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
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth variant={'standard'}
                                             error={formik.touched.type && Boolean(formik.errors.type)}
                                >
                                    <InputLabel>Typ Wpisu</InputLabel>
                                    <Select
                                        value={formik.values.type}
                                        variant={'standard'}
                                        name={'type'}
                                        label="Jednostka"
                                        onChange={formik.handleChange}
                                        error={formik.touched.type && Boolean(formik.errors.type)}
                                    >
                                        <MenuItem key={'default'} value={'default'}>Domyślna</MenuItem>
                                        <MenuItem key={'grouped'} value={'grouped'}>Zgrupowana</MenuItem>
                                    </Select>
                                    <FormHelperText>{formik.touched.type && formik.errors.type}</FormHelperText>
                                </FormControl>
                            </Grid>
                        </Grid>
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

