import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import store from "@/Store/store";
import {requestProducts} from "@/Store/Reducers/ProductReducer";
import {useFormik} from "formik";
import ProductSchema from "@/Schemas/ProductSchema";
import toast from "react-hot-toast";
import ProductAPI from "@/API/ProductsAPI";
import {requestProductCategories} from "@/Store/Reducers/ProductCategoryReducer";
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    FormControl, FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import DataTable from "@/Components/DataTable/DataTable";
import styled from "styled-components";
import {Add, Delete, Edit} from "@mui/icons-material";
import ProductsAPI from "@/API/ProductsAPI";
import ProductUnitsAPI from "@/API/ProductUnitsAPI";
import ProductUnitCEDialog from "@/Dialogs/ProductUnitCEDialog";


const unitTableColumns = [
    {
        name: 'id',
        label: 'ID',
    },{
        name: 'name',
        label: 'Nazwa',
    },{
        name: 'grams_per_unit',
        label: 'Gramatura',
    },{
        name:'default',
        label: 'Domyślna',
    }
];

const Container = styled.div`
  width: calc(100% - 100px);
  background-color: white;
  min-height: calc(100% - 100px);
  margin: 20px auto;
  padding: 30px;
  border-radius: 10px;
`;

const ProductView = () => {


    const {id: editId} = useParams();

    const {isLoading, products} = useSelector(state => state.productReducer);
    const {productCategories} = useSelector(state => state.productCategoryReducer);

    const [unitDialogOpen,setUnitDialogOpen] = useState(false);
    const [unitEditMode,setUnitEditMode] = useState(false);
    const [unitEditId,setUnitEditId] = useState(null);
    const [selectedIds,setSelectedIds] = useState([]);

    const productToEdit = products.find((product) => product.id == editId);

    useEffect(() => {
        store.dispatch(requestProducts());
    },[]);

    const deleteSelected = async () => {
        for(let unit of productToEdit.units.filter((unit) => selectedIds.includes(unit.id))){
            await ProductUnitsAPI.delete(editId,unit.id);
        }
        store.dispatch(requestProducts());
    }

    const tools = [
        {
            'name': 'add',
            'label': 'Dodaj',
            'icon': <Add />,
            'onClick': async () => {
                setUnitEditId(null);
                setUnitEditMode(false);
                setUnitDialogOpen(true);
            }
        },{
            'name': 'delete',
            'label': 'Usuń',
            'icon': <Delete />,
            'forSelect': true,
            'onClick': async () => {
                toast.promise(deleteSelected(), {
                    loading: 'Usuwanie kategorii...',
                    success: 'Kategoria została usunięta',
                    error: 'Nie udało się usunąć kategorii'
                });
            }
        }
    ];

    const inlineTools = [
        {
            'name': 'edit',
            'label': 'Edytuj',
            'icon': <Edit />,
            'onClick': async (row) => {
                setUnitEditId(row.id);
                setUnitEditMode(true);
                setUnitDialogOpen(true);
            }
        }
    ]


    const mainInput = useRef(null);


    const formik = useFormik({
        initialValues: {
            name: '',
            category_id: 0,
            nutrition_energy_kcal: 0,
            nutrition_energy_kj: 0,
            nutrition_carbs: 0,
            nutrition_fat: 0,
            nutrition_sugar: 0,
            nutrition_protein: 0,
            nutrition_salt: 0,
        },
        validationSchema: ProductSchema,
        validateOnChange: true,
        onSubmit: async (values) => {

            await toast.promise(ProductAPI.update(editId, values),{
                loading: 'Aktualizacja produktu...',
                success: 'Produkt został zaktualizowany',
                error: 'Nie udało się zaktualizować produktu'
            });
            store.dispatch(requestProducts());

        }
    });
    useEffect(() => {
            store.dispatch(requestProductCategories());
            mainInput?.current?.focus();
            formik.resetForm();
            console.log(productToEdit);

            formik.setValues({
                name: productToEdit?.name,
                category_id: productToEdit?.category_id,
                nutrition_energy_kcal: productToEdit?.nutrition_energy_kcal,
                nutrition_energy_kj: productToEdit?.nutrition_energy_kj,
                nutrition_carbs: productToEdit?.nutrition_carbs,
                nutrition_fat: productToEdit?.nutrition_fat,
                nutrition_sugar: productToEdit?.nutrition_sugar,
                nutrition_protein: productToEdit?.nutrition_protein,
                nutrition_salt: productToEdit?.nutrition_salt,
            });


    }, [productToEdit]);



    return (
        <Container>
            <ProductUnitCEDialog
                productId={editId}
                open={unitDialogOpen}
                onClose={() => setUnitDialogOpen(false)}
                editMode={unitEditMode}
                editId={unitEditId}
            />
            <form onSubmit={formik.handleSubmit}>
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
                            <FormControl fullWidth variant={'standard'}
                                         error={formik.touched.category_id && Boolean(formik.errors.category_id)}
                            >
                                <InputLabel>Kategoria</InputLabel>
                                <Select
                                    value={formik.values.category_id}
                                    variant={'standard'}
                                    name={'category_id'}
                                    label="Kategoria"
                                    onChange={formik.handleChange}
                                    error={formik.touched.category_id && Boolean(formik.errors.category_id)}
                                >
                                    <MenuItem key={0} value={0}>Brak</MenuItem>
                                    {
                                        productCategories.map((category) => (
                                            <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                                        ))
                                    }
                                </Select>
                                <FormHelperText>{formik.touched.type && formik.errors.type}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                inputRef={mainInput}
                                variant={'standard'}
                                name={'nutrition_energy_kcal'}
                                label={'Kcal na 100g'}
                                value={formik.values.nutrition_energy_kcal}
                                onChange={formik.handleChange}
                                fullWidth
                                error={formik.touched.nutrition_energy_kcal && Boolean(formik.errors.nutrition_energy_kcal)}
                                helperText={formik.touched.nutrition_energy_kcal && formik.errors.nutrition_energy_kcal}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                inputRef={mainInput}
                                variant={'standard'}
                                name={'nutrition_energy_kj'}
                                label={'Kj na 100g'}
                                value={formik.values.nutrition_energy_kj}
                                onChange={formik.handleChange}
                                fullWidth
                                error={formik.touched.nutrition_energy_kj && Boolean(formik.errors.nutrition_energy_kj)}
                                helperText={formik.touched.nutrition_energy_kj && formik.errors.nutrition_energy_kj}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                inputRef={mainInput}
                                variant={'standard'}
                                name={'nutrition_carbs'}
                                label={'Węglowodany na 100g'}
                                value={formik.values.nutrition_carbs}
                                onChange={formik.handleChange}
                                fullWidth
                                error={formik.touched.nutrition_carbs && Boolean(formik.errors.nutrition_carbs)}
                                helperText={formik.touched.nutrition_carbs && formik.errors.nutrition_carbs}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                inputRef={mainInput}
                                variant={'standard'}
                                name={'nutrition_fat'}
                                label={'Tłuszcze na 100g'}
                                value={formik.values.nutrition_fat}
                                onChange={formik.handleChange}
                                fullWidth
                                error={formik.touched.nutrition_fat && Boolean(formik.errors.nutrition_fat)}
                                helperText={formik.touched.nutrition_fat && formik.errors.nutrition_fat}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                inputRef={mainInput}
                                variant={'standard'}
                                name={'nutrition_sugar'}
                                label={'Cukry na 100g'}
                                value={formik.values.nutrition_sugar}
                                onChange={formik.handleChange}
                                fullWidth
                                error={formik.touched.nutrition_sugar && Boolean(formik.errors.nutrition_sugar)}
                                helperText={formik.touched.nutrition_sugar && formik.errors.nutrition_sugar}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                inputRef={mainInput}
                                variant={'standard'}
                                name={'nutrition_protein'}
                                label={'Białko na 100g'}
                                value={formik.values.nutrition_protein}
                                onChange={formik.handleChange}
                                fullWidth
                                error={formik.touched.nutrition_protein && Boolean(formik.errors.nutrition_protein)}
                                helperText={formik.touched.nutrition_protein && formik.errors.nutrition_protein}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                inputRef={mainInput}
                                variant={'standard'}
                                name={'nutrition_salt'}
                                label={'Sól na 100g'}
                                value={formik.values.nutrition_salt}
                                onChange={formik.handleChange}
                                fullWidth
                                error={formik.touched.nutrition_salt && Boolean(formik.errors.nutrition_salt)}
                                helperText={formik.touched.nutrition_salt && formik.errors.nutrition_salt}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <DataTable
                                canSelect={false}
                                title={'Jednostki'}
                                searchBar={true}
                                columns={unitTableColumns}
                                data={productToEdit?.units}
                                tools={tools}
                                inlineTools={inlineTools}
                            />
                        </Grid>
                    </Grid>
                <Button
                    style={{
                        marginLeft: 'auto',
                        display: 'block'
                    }}
                    type={'submit'}
                    variant={'contained'}
                    onClick={formik.handleSubmit}
                >Zapisz</Button>
            </form>
        </Container>
    )
}
export default ProductView;