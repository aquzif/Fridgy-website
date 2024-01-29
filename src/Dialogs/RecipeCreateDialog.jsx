import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Grow, TextField} from "@mui/material";
import {useFormik} from "formik";
import ProductCategorySchema from "@/Schemas/ProductCategorySchema";
import toast from "react-hot-toast";
import ProductCategoriesAPI from "@/API/ProductCategoriesAPI";
import store from "@/Store/store";
import {requestProductCategories} from "@/Store/Reducers/ProductCategoryReducer";
import {forwardRef, useEffect} from "react";
import RecipesAPI from "@/API/RecipesAPI";

const Transition = forwardRef(function Transition(props, ref) {
    return <Grow /*direction="down"*/ ref={ref} {...props} />;
});

const RecipeCreateDialog =
(
    {
        open = false,
        onClose = (res) => {},
    }
) => {



    const formik = useFormik({
        initialValues: {
            name: '',
        },
        onSubmit: async (values) => {

            const result = await toast.promise(RecipesAPI.create(values),{
                loading: 'Tworzenie katgorii...',
                success: 'Kategoria została utworzona',
                error: 'Nie udało się utworzyć kategorii'
            });
            onClose(true);

        }
    });

    useEffect(() => {
        formik.resetForm();
    }, [open]);

    const handleClose = () => {
        onClose();
    }

    return  <Dialog
        open={open}
        TransitionComponent={Transition}
        fullWidth
        maxWidth={'xs'}
        onClose={handleClose}
    >
        <DialogTitle>Stwórz nowy przepis </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            variant={'standard'}
                            name={'name'}
                            label={'Nazwa przepisu'}
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
                <Button onClick={formik.handleSubmit} >{'Utwórz'}</Button>
            </DialogActions>
        </form>
    </Dialog>
}

export default RecipeCreateDialog;