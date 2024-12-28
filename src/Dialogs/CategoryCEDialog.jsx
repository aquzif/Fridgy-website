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
import AsyncAutocompleter from "@/Components/AsyncAutocomplete/AsyncAutocomplete";
import {ray} from "node-ray/web";
import ProductAPI from "@/API/ProductsAPI";
import ProductCategoriesAPI from "@/API/ProductCategoriesAPI";
import ProductCategorySchema from "@/Schemas/ProductCategorySchema";
import {requestProductCategories} from "@/Store/Reducers/ProductCategoryReducer";


const Transition = forwardRef(function Transition(props, ref) {
    return <Grow /*direction="down"*/ ref={ref} {...props} />;
});

const CategoryCEDialog = (
    {
        open = false,
        onClose = () => {},
        editMode=false,
        editId = null
    }
) => {

    const mainInput = useRef(null);

    const {productCategories,isLoading} = useSelector(state => state.productCategoryReducer);


    const handleClose = () => {
        onClose();
    }

    const categoryToEdit = productCategories.find((category) => category.id === editId);

    const formik = useFormik({
        initialValues: {
            name: '',
        },
        validationSchema: ProductCategorySchema,
        validateOnChange: true,
        onSubmit: async (values) => {
            if(editMode){
                await toast.promise(ProductCategoriesAPI.update(editId, values),{
                    loading: 'Aktualizacja katgorii...',
                    success: 'Kategoria została zaktualizowana',
                    error: 'Nie udało się zaktualizować kategorii'
                });
            }else{
                const result = await toast.promise(ProductCategoriesAPI.create(values),{
                    loading: 'Tworzenie katgorii...',
                    success: 'Kategoria została utworzona',
                    error: 'Nie udało się utworzyć kategorii'
                });

            }
            store.dispatch(requestProductCategories());

            handleClose();
        }
    });
    useEffect(() => {
        if(open){
            mainInput?.current?.focus();
            formik.resetForm();
            console.log(categoryToEdit);

            if(editMode){
                formik.setValues({
                    name: categoryToEdit?.name,
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
                    editMode ? "Zmodyfikuj Kategorię" : "Utwórz nową kategorię"
                }</DialogTitle>
                <form onSubmit={formik.handleSubmit}>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    inputRef={mainInput}
                                    variant={'standard'}
                                    name={'name'}
                                    label={'Nazwa kategorii'}
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    fullWidth
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
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

export default CategoryCEDialog;

