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
import FastFoodStoreMealSetsAPI from "@/API/FastFoodStores/FastFoodStoreMealSetsAPI";
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

const FastFoodMealSetCEDialog = (
    {
        open,
        onClose,
        storeId = 0,
        editId = null
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
        const {data} = await FastFoodStoreMealSetsAPI.get(storeId, editId);
        formik.setValues({
            name: data.data.name,
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
            image: {}
        },
        onSubmit: async (values) => {

            let params = {
                name: values.name
            }

            if(values.image?.file) {
                params['image'] = values.image.file;
            }

            if(editMode){
                toast.promise(
                    FastFoodStoreMealSetsAPI.update(storeId, editId, params),
                    {
                        loading: 'Edytowanie zestawu...',
                        success: 'Pomyślnie edytowano zestaw',
                        error: 'Nie udało się edytować zestawu'
                    }
                ).then(() => {
                    formik.resetForm();
                    onClose(true);
                });
            }else{
                toast.promise(
                    FastFoodStoreMealSetsAPI.create(storeId, params),
                    {
                        loading: 'Dodawanie zestawu...',
                        success: 'Pomyślnie dodano zestaw',
                        error: 'Nie udało się dodać zestawu'
                    }
                ).then(() => {
                    formik.resetForm();
                    onClose(true);
                });
            }

        }
    });


    return  <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        maxwidth={'sm'}
        fullWidth
        onClose={handleClose}
    >
        <DialogTitle>{
            editMode ? 'Edytuj zestaw' : 'Dodaj zestaw'
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

export default FastFoodMealSetCEDialog;