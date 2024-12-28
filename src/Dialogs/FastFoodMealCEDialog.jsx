import {
    Autocomplete,
    Button, createFilterOptions,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Slide,
    TextField
} from "@mui/material";
import {forwardRef, useEffect, useRef, useState} from "react";
import FastFoodStoreMealsAPI from "@/API/FastFoodStores/FastFoodStoreMealsAPI";
import {useFormik} from "formik";
import styled from "styled-components";
import placeholderImage from "@/Assets/placeholder.png";
import toast from "react-hot-toast";
import NetworkUtils from "@/Utils/NetworkUtils";
const filter = createFilterOptions();


const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const Image = styled.img`
    width: 280px;
    max-width: 100%;
    height: 160px;
    object-fit: cover;
    border-radius: 10px;
    border: 2px solid #e0e0e0;
    display: block;
    margin-left: auto;
    margin-right: auto;
  
  
    &:hover{
      border: 2px solid #FACC2C;
      cursor: pointer;
    }
`;

const FastFoodMealCEDialog = (
    {
        open,
        onClose,
        storeId = 0,
        editId = null,
        categories = []
    }
) => {
    const editMode = Boolean(editId);

    const inputFileRef = useRef(null);

    const onFileChangeCapture = (e) => {

        if(e.target.files.length === 0){
            formik.setValues({
                image: {
                    selected: true,
                    url: URL.createObjectURL(e.target.files[0]),
                    file: e.target.files[0]
                }
            });
            //updateImage();
            //onChange(e);
        }else{

            let types = [
                'image/png',
                'image/jpg',
                'image/jpeg'
            ]

            if(types.includes(e.target.files[0].type)) {
                formik.setFieldValue('image', {
                    selected: true,
                    url: URL.createObjectURL(e.target.files[0]),
                    file: e.target.files[0]
                });
                //updateImage();
            }
        }


    }

    const loadToEdit = async () => {
        const {data} = await FastFoodStoreMealsAPI.get(storeId, editId);
        formik.setValues({
            name: data.data.name,
            category: data.data.category,
            calories_per_100g: data.data.calories_per_100g,
            calories_per_ration: (data.data.calories_per_100g/100) * data.data.weight_in_grams,
            weight_in_grams: data.data.weight_in_grams,
            image: {
                url: data.data.image || '',
            }
        });
    }

    useEffect(() => {
        if(open && editId){
            loadToEdit();
        }else{
            formik.resetForm()
        }
    }, [editId,open]);


    const handleClose = () => {
          formik.resetForm();
          onClose();
    }

    const handleImageClick = () => {
        inputFileRef.current.click();
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            category: '',
            calories_per_100g: 0,
            calories_per_ration: 0,
            weight_in_grams: 0,
            image: {}
        },
        onSubmit: async (values) => {

            let params = {
                name: values.name,
                category: values.category,
                calories_per_100g: parseInt(values.calories_per_100g),
                weight_in_grams: parseInt(values.weight_in_grams),
            }

            if(values.image?.file) {
                params['image'] = values.image.file;
            }

            console.log('PARAMS',params);
            if(editMode){
                toast.promise(
                    FastFoodStoreMealsAPI.update(storeId, editId, params),
                    {
                        loading: 'Edytowanie produktu...',
                        success: 'Pomyślnie edytowano produkt',
                        error: 'Nie udało się edytować produktu'
                    }
                ).then(() => {
                    formik.resetForm();
                    onClose(true);
                });
            }else{
                toast.promise(
                    FastFoodStoreMealsAPI.create(storeId, params),
                    {
                        loading: 'Dodawanie produktu...',
                        success: 'Pomyślnie dodano produkt',
                        error: 'Nie udało się dodać produktu'
                    }
                ).then(() => {
                    formik.resetForm();
                    onClose(true);
                });
            }

        }
    });

    const handleChangeForFormik = (e) => {
        console.log(e.target.name,e.target.value);
        switch(e.target.name){
            case 'calories_per_100g':{
                formik.setFieldValue('calories_per_100g', e.target.value);
                if(formik.values.weight_in_grams > 0){
                    formik.setFieldValue('calories_per_ration', Math.round((e.target.value/100) * formik.values.weight_in_grams));
                }
                break;
            }
            case 'weight_in_grams':{
                formik.setFieldValue('weight_in_grams', e.target.value);
                if(formik.values.calories_per_100g > 0){
                    formik.setFieldValue('calories_per_ration',
                        Math.round((formik.values.calories_per_100g/100) * e.target.value)
                    );
                }
                break;
            }
            case 'calories_per_ration':{
                formik.setFieldValue('calories_per_ration', e.target.value);
                if(formik.values.calories_per_100g > 0){
                    formik.setFieldValue('weight_in_grams',
                        Math.round((e.target.value/(formik.values.calories_per_100g/100)))
                        );
                }
                break;
            }
        }
    }


    return  <Dialog
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
            <input
                type="file"
                ref={inputFileRef}
                onChangeCapture={onFileChangeCapture}
                name={'image'}
                hidden={true}
            />
            <Grid container spacing={8}>
                <Grid item xs={12} md={6}>
                    <Image src={ NetworkUtils.fixBackendUrl(formik.values?.image?.url)|| placeholderImage}
                           onClick={handleImageClick}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant={'standard'}
                                name={'name'}
                                label={'Nazwa'}
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                fullWidth
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                disablePortal
                                id="category"
                                name={'category'}
                                filterOptions={(options, params) => {
                                    const filtered = filter(options, params);

                                    const { inputValue } = params;
                                    // Suggest the creation of a new value
                                    const isExisting = options.some((option) => inputValue === option);
                                    if (inputValue !== '' && !isExisting) {
                                        filtered.push(inputValue);
                                    }

                                    return filtered;
                                }}
                                label={'Kategoria'}
                                value={formik.values.category}
                                onChange={(e,value) => {
                                    formik.setFieldValue('category', value);
                                }}
                                fullWidth
                                error={formik.touched.category && Boolean(formik.errors.category)}
                                options={categories}
                                renderInput={(params) => <TextField {...params} variant={'standard'} fullWidth={true} label="Kategoria"
                                                                    helperText={formik.touched.category && formik.errors.category
                                }/>}
                            />

                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant={'standard'}
                                name={'calories_per_100g'}
                                label={'Kalorie na 100g'}
                                value={formik.values.calories_per_100g}
                                onChange={handleChangeForFormik}
                                fullWidth
                                error={formik.touched.calories_per_100g && Boolean(formik.errors.calories_per_100g)}
                                helperText={formik.touched.calories_per_100g && formik.errors.calories_per_100g}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant={'standard'}
                                name={'weight_in_grams'}
                                label={'Waga w gramach'}
                                value={formik.values.weight_in_grams}
                                onChange={handleChangeForFormik}
                                fullWidth
                                error={formik.touched.weight_in_grams && Boolean(formik.errors.weight_in_grams)}
                                helperText={formik.touched.weight_in_grams && formik.errors.weight_in_grams}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant={'standard'}
                                name={'calories_per_ration'}
                                label={'Kalorie na porcję'}
                                value={formik.values.calories_per_ration}
                                onChange={handleChangeForFormik}
                                fullWidth
                                error={formik.touched.calories_per_ration && Boolean(formik.errors.calories_per_ration)}
                                helperText={formik.touched.calories_per_ration && formik.errors.calories_per_ration}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button color={'warning'} onClick={handleClose}>Anuluj</Button>
            <Button onClick={formik.handleSubmit} >Zapisz</Button>
        </DialogActions>
    </Dialog>

}

export default FastFoodMealCEDialog;