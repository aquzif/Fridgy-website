import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select,
    Grow,
    TextField, Checkbox
} from "@mui/material";
import {forwardRef, useEffect, useRef, useState} from "react";
import {useFormik} from "formik";
import toast from "react-hot-toast";

import store from "@/Store/store";
import {useSelector} from "react-redux";
import ProductAPI from "@/API/ProductsAPI";
import {requestProductCategories} from "@/Store/Reducers/ProductCategoryReducer";
import ProductSchema from "@/Schemas/ProductSchema";
import {requestProducts} from "@/Store/Reducers/ProductReducer";
import DataTable from "@/Components/DataTable/DataTable";
import ProductUnitsAPI from "@/API/ProductUnitsAPI";
import ProductUnitSchema from "@/Schemas/ProductUnitSchema";



const Transition = forwardRef(function Transition(props, ref) {
    return <Grow /*direction="down"*/ ref={ref} {...props} />;
});


const ProductUnitCEDialog = (
    {
        productId = 0,
        open = false,
        onClose = () => {},
        editMode=false,
        editId = null
    }
) => {

    const mainInput = useRef(null);

    const products = useSelector(state => state.productReducer.products);
    const product = products.find((product) => product.id == productId);
    const unitToEdit = product?.units.find((unit) => unit.id == editId);

    const handleClose = () => {
        onClose();
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            grams_per_unit: '',
            default: 0,
        },
        validationSchema: ProductUnitSchema,
        validateOnChange: true,
        onSubmit: async (values) => {
            if(editMode){
                await toast.promise(ProductUnitsAPI.update(productId,editId, values),{
                    loading: 'Aktualizacja jednostki...',
                    success: 'Jednostka została zaktualizowana',
                    error: 'Nie udało się zaktualizować jednostki'
                });
            }else{
                const result = await toast.promise(ProductUnitsAPI.create(productId,values),{
                    loading: 'Tworzenie jednostki...',
                    success: 'Jednostka została utworzona',
                    error: 'Nie udało się utworzyć jednostki'
                });

            }
            store.dispatch(requestProducts());


            handleClose();
        }
    });
    useEffect(() => {
        if(open){
            mainInput?.current?.focus();
            formik.resetForm();

            if(editMode){
                formik.setValues({
                    name: unitToEdit?.name,
                    grams_per_unit: unitToEdit?.grams_per_unit,
                    default: unitToEdit?.default ? 1 : 0

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
                editMode ? "Edytuj jednostkę" : 'Dodaj jednostkę'
            }</DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                inputRef={mainInput}
                                variant={'standard'}
                                name={'name'}
                                label={'Nazwa produktu'}
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                fullWidth
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                variant={'standard'}
                                name={'grams_per_unit'}
                                label={'Gram na jednostkę'}
                                value={formik.values.grams_per_unit}
                                onChange={formik.handleChange}
                                fullWidth
                                error={formik.touched.grams_per_unit && Boolean(formik.errors.grams_per_unit)}
                                helperText={formik.touched.grams_per_unit && formik.errors.grams_per_unit}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Domyślna</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={formik.values.default}
                                    onChange={formik.handleChange}
                                    label="Domyślna"
                                    name={'default'}
                                    fullWidth
                                >
                                    <MenuItem value={1}>Tak</MenuItem>
                                    <MenuItem value={0}>Nie</MenuItem>
                                </Select>
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

export default ProductUnitCEDialog;

