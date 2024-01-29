import {useSelector} from "react-redux";
import {useFormik} from "formik";
import toast from "react-hot-toast";
import ProductAPI from "@/API/ProductsAPI";
import store from "@/Store/store";
import {requestRecipeTags} from "@/Store/Reducers/RecipeTagsReducer";
import {forwardRef, useEffect} from "react";
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    Grid, Grow, InputAdornment,
    TextField
} from "@mui/material";
import RecipeTagsAPI from "@/API/RecipeTagsAPI";
import PremadeColors from "@/Config/PremadeColors";

const Transition = forwardRef(function Transition(props, ref) {
    return <Grow /*direction="down"*/ ref={ref} {...props} />;
});


const RecipeTagCEDIalog = (
    {
        open = false,
        onClose = () => {},
        editMode=false,
        editId = null
    }
) => {

    const {recipeTags} = useSelector(state => state.recipeTagsReducer);
    const selectedTag = recipeTags.find((tag) => tag.id === editId);

    const handleClose = () => {
        onClose();
    }

    useEffect(() => {
        if(open){
            formik.resetForm();

            if(editMode){
                formik.setValues({
                    name: selectedTag?.name,
                    color: selectedTag?.color,
                });
            }

        }


    }, [open,editMode,selectedTag]);

    const formik = useFormik({
        initialValues: {
            name: '',
            color: ''
        },
        onSubmit: async (values) => {
            if(editMode){
                await toast.promise(RecipeTagsAPI.update(editId, values),{
                    loading: 'Aktualizacja Tagu...',
                    success: 'Tag został zaktualizowany',
                    error: 'Nie udało się zaktualizować tagu'
                });
            }else{
                const result = await toast.promise(RecipeTagsAPI.create(values),{
                    loading: 'Tworzenie Tagu...',
                    success: 'Tag został utworzony',
                    error: 'Nie udało się utworzyć tagu'
                });

            }
            store.dispatch(requestRecipeTags());


            handleClose();
        }
    });


    return (<Dialog
        open={open}
        TransitionComponent={Transition}
        fullWidth
        maxWidth={'xs'}
        onClose={handleClose}
    >
        <DialogTitle>{
            editMode ? "Zmodyfikuj tag" : 'Dodaj tag'
        }</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            variant={'standard'}
                            name={'name'}
                            label={'Nazwa tagu'}
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            fullWidth
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant={'standard'}
                            name={'color'}
                            label={'Kolor'}
                            value={formik.values.color}
                            onChange={formik.handleChange}
                            fullWidth
                            error={formik.touched.color && Boolean(formik.errors.color)}
                            helperText={formik.touched.color && formik.errors.color}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">
                                    <div
                                        style={{
                                            backgroundColor: formik.values.color,
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%'
                                        }}></div>
                                </InputAdornment>,
                            }}
                        />
                    </Grid>
                </Grid>
                <div style={{display: 'flex',flexDirection: 'row',justifyContent: 'space-around',marginTop: '20px',
                    cursor: 'pointer'
                }} >
                    {
                        PremadeColors.colors.map((color) => (<div
                            onClick={() => formik.setFieldValue('color', color)}
                            style={{
                            backgroundColor: color,
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%'
                        }}></div>))
                    }
                </div>

            </DialogContent>
            <DialogActions>
                <Button color={'warning'} onClick={handleClose}>Anuluj</Button>
                <Button onClick={formik.handleSubmit} >{editMode ? "Zaktualizuj" : 'Stwórz'}</Button>
            </DialogActions>
        </form>
    </Dialog> )
}

export default RecipeTagCEDIalog;