import {forwardRef, useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {useFormik} from "formik";
import ShoppingListSchema from "@/Schemas/ShoppingListSchema";
import toast from "react-hot-toast";
import ShoppingListsAPI from "@/API/ShoppingListsAPI";
import store from "@/Store/store";
import {requestShoppingLists, selectShoppingList} from "@/Store/Reducers/ShoppingListReducer";
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    FormControl, FormHelperText,
    Grid, Grow,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import AsyncAutocompleter from "@/Components/AsyncAutocomplete/AsyncAutocomplete";
import ProductAPI from "@/API/ProductsAPI";
import {ray} from "node-ray/web";
import RecipeIngredientsAPI from "@/API/RecipeIngredientsAPI";

const Transition = forwardRef(function Transition(props, ref) {
    return <Grow /*direction="down"*/ ref={ref} {...props} />;
});

const IngredientCEDialog =
({
    open = false,
    onClose = () => {},
    editMode=false,
    editRecipeId = 0,
    editId = null
}) => {


    const mainInput = useRef(null);

    const [editIngredient, setEditIngredient] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleClose = (res = false) => {
        onClose(res);
    }

    useEffect(() => {
        if(editMode){
            RecipeIngredientsAPI.get(editRecipeId,editId).then((response) => {
                setEditIngredient(response.data.data);
                setSelectedProduct(response.data.data.product);
            })
        }
    }, [editMode,editId,editRecipeId,open]);

    console.log(selectedProduct);

    const formik = useFormik({
        initialValues: {
            product_id: 0,
            product_unit_id: 0,
            amount_in_unit: 0
        },
        //validationSchema: ShoppingListSchema,
        validateOnChange: true,
        onSubmit: async (values) => {
            if(editMode){
                await toast.promise(RecipeIngredientsAPI.update(editRecipeId,editId, values),{
                    loading: 'Aktualizowanie składnika...',
                    success: 'Składnik został zaktualizowany',
                    error: 'Nie udało się zaktualizować składnika'
                });
            }else{
                // ShoppingListsAPI.create(values)
                await toast.promise(RecipeIngredientsAPI.create(editRecipeId,values),{
                    loading: 'Tworzenie składnika...',
                    success: 'Składnik został utworzony',
                    error: 'Nie udało się utworzyć składnika'
                });

            }

            handleClose(true);
        }
    });
    useEffect(() => {
        if(open){
            mainInput?.current?.focus();
            formik.resetForm();

            if(editMode){
                console.log("edit",editIngredient);

                formik.setValues({
                    product_id: editIngredient?.product_id,
                    product_unit_id: editIngredient?.product_unit_id,
                    amount_in_unit: editIngredient?.amount_in_unit,
                });

            }else{
                formik.setValues({
                    product_id: 0,
                    product_unit_id: 0,
                    amount_in_unit: 0
                });
            }

        }


    }, [open,editMode,editIngredient]);

    const onProductSearch = async (searchValue) => {
        if(!searchValue) return [];

        const result =  await ProductAPI.search(searchValue);
        ray(result).purple();
        return result?.data || [];
    }

    const onProductSelect = (selectedValue) => {
        formik.setFieldValue('product_id', selectedValue?.id || '');
        setSelectedProduct(selectedValue);
        formik.setFieldValue('amount_in_unit', 1);
        formik.setFieldValue('product_unit_id', selectedValue?.units[0]?.id || 0);
    }


    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            fullWidth
            maxWidth={'xs'}
            onClose={handleClose}
        >
            <DialogTitle>{
                editMode ? "Zmodyfikuj Składnik" : "Dodaj Składnik"
            }</DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <AsyncAutocompleter
                                label={'Wyszukaj produkt'}
                                onSearch={onProductSearch}
                                oldValue={selectedProduct?.name || ''}
                                onSelect={onProductSelect}
                                error={formik.touched?.product_name && formik.errors?.product_name || ''}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {/*select product unit*/}
                            <FormControl fullWidth variant={'standard'}
                                         error={formik.touched.product_unit_id && Boolean(formik.errors.product_unit_id)}
                            >
                                <InputLabel>Jednostka</InputLabel>
                                <Select
                                    //disabled={}
                                    value={formik.values.product_unit_id}
                                    variant={'standard'}
                                    name={'product_unit_id'}
                                    label="Jednostka"
                                    onChange={formik.handleChange}
                                    error={formik.touched.product_unit_id && Boolean(formik.errors.product_unit_id)}
                                >
                                    <MenuItem key={'brak'} value={0}>Brak</MenuItem>

                                    {
                                        selectedProduct?.units?.map((unit) => (
                                            <MenuItem key={unit.id} value={unit.id}>{unit.name}</MenuItem>
                                        ))
                                    }
                                </Select>
                                <FormHelperText>{formik.touched.type && formik.errors.type}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant={'standard'}
                                name={'amount_in_unit'}
                                label={'Ilość w jednostce'}
                                value={formik.values.amount_in_unit}
                                onChange={formik.handleChange}
                                fullWidth
                                error={formik.touched.amount_in_unit && Boolean(formik.errors.amount_in_unit)}
                                helperText={formik.touched.amount_in_unit && formik.errors.amount_in_unit}
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

export default IngredientCEDialog;