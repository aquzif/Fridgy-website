import {useFormik} from "formik";
import {forwardRef, useEffect} from "react";
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Slide,
    TextField
} from "@mui/material";
import * as Yup from "yup";
import FastFoodStoreMealSetMealsAPI from "@/API/FastFoodStores/FastFoodStoreMealSetMealsAPI";
import toast from "react-hot-toast";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const FastFoodMealSetMealCEDialog = (
    {
        open,
        storeId,
        setId,
        editId,
        products = [],
        onClose
    }
) => {

    const editMode = Boolean(editId);

    useEffect(() => {

        if(editMode && editId && setId && storeId){
            FastFoodStoreMealSetMealsAPI.get(storeId, setId, editId).then((response) => {
                const {data,code} = response.data;

                if(code > 300){
                    toast.error('Nie udało się pobrać produktu');
                    return;
                }

                formik.setFieldValue('meal_id', data.meal);
                formik.setFieldValue('quantity', data.quantity);
            });
        }

    },[open,editId,setId,storeId]);

    const formik = useFormik({
        initialValues: {
            'meal_id': {
                'id': 0,
                'name': 'Nie wybrano'
            },
            'quantity': 1,
        },
        validationSchema: Yup.object({
            meal_id: Yup.object({
                id: Yup.number().min(1,'Produkt jest wymagany').required('Produkt jest wymagany')
            }).required('Produkt jest wymagany'),
            quantity: Yup.number().required('Ilość jest wymagana').min(1, 'Ilość musi być większa od 0')
        }),
        validateOnChange: true,
        onSubmit: (values) => {



            let params = {
                quantity: values.quantity,
                meal_id: values.meal_id.id,
            }

            if(editMode){
                toast.promise(FastFoodStoreMealSetMealsAPI.update(storeId, setId, editId, params),{
                    loading: 'Aktualizacja produktu...',
                    success: 'Produkt został zaktualizowany',
                    error: 'Nie udało się zaktualizować produktu'
                }).then(() => {
                        formik.resetForm();
                        onClose(true);
                    });
            }else{
                toast.promise(FastFoodStoreMealSetMealsAPI.create(storeId, setId, params),{
                    loading: 'Dodawanie produktu...',
                    success: 'Produkt został dodany',
                    error: 'Nie udało się dodać produktu'
                }).then(() => {
                    formik.resetForm();
                    onClose(true);
                });
            }

        }
    });

    const handleClose = () => {
        formik.resetForm();
        onClose();
    }

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            maxwidth={'sm'}
            fullWidth
            onClose={handleClose}
        >
            <DialogTitle>{
                editMode ? 'Edytuj produkt' : 'Nowy produkt'
            }</DialogTitle>
            <DialogContent>
                <Grid container spacing={8}>
                    <Grid item xs={12} md={6}>
                        <Autocomplete
                            disablePortal
                            id="meal_id"
                            name={'meal_id'}
                            isOptionEqualToValue={(option, value) => option?.id === value?.id}
                            label={'Produkt'}
                            value={formik.values.meal_id}
                            filterOptions={(options, params) => {
                                return options.filter((option) => {
                                    if (!params.inputValue) {
                                        return true;
                                    }
                                    return option.name.toLowerCase().includes(params.inputValue.toLowerCase());
                                });
                            }}
                            getOptionLabel={(option) => option?.name || 'Nie wybrano'}
                            onChange={(e,value) => {
                                formik.setFieldValue('meal_id', value);
                            }}
                            fullWidth

                            options={[...products,{
                                'id': 0,
                                'name': 'Nie wybrano'
                            }]}
                            renderInput={(params) =>
                                <TextField {...params} variant={'standard'} fullWidth={true} label="Kategoria"
                                           error={formik.touched.meal_id?.id && Boolean(formik.errors.meal_id?.id)}
                                           helperText={formik.touched.meal_id?.id && formik.errors.meal_id?.id
                                           }/>}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            variant={'standard'}
                            name={'quantity'}
                            label={'Ilość'}
                            value={formik.values.quantity}
                            onChange={formik.handleChange}
                            fullWidth
                            error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                            helperText={formik.touched.quantity && formik.errors.quantity}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button color={'warning'} onClick={handleClose}>Anuluj</Button>
                <Button onClick={formik.handleSubmit} >Zapisz</Button>
            </DialogActions>
        </Dialog>
    )

}

export default FastFoodMealSetMealCEDialog;