import {useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import FastFoodStoresAPI from "@/API/FastFoodStores/FastFoodStoresAPI";
import {Container} from "@/Components/Common/Common";
import {Box, Chip, Grid, LinearProgress, Tab, Tabs, TextField} from "@mui/material";
import toast from "react-hot-toast";
import RecipesAPI from "@/API/RecipesAPI";
import CustomTabPanel from "@/Components/CustomTabPanel/CustomTabPanel";
import {useFormik} from "formik";
import RecipeSchema from "@/Schemas/RecipeSchema";
import styled from "styled-components";
import placeholderImage from "@/Assets/placeholder.png";
import NetworkUtils from "@/Utils/NetworkUtils";
import * as Yup from "yup";
import FAB from "@/Components/FAB/FAB";
import {Add, Delete, Edit, Save} from "@mui/icons-material";
import DataTable from "@/Components/DataTable/DataTable";
import FastFoodStoreMealsAPI from "@/API/FastFoodStores/FastFoodStoreMealsAPI";
import FastFoodMealCEDialog from "@/Dialogs/FastFoodMealCEDialog";
import FastFoodStoreMealSetsAPI from "@/API/FastFoodStores/FastFoodStoreMealSetsAPI";
import FastFoodMealSetCEDialog from "@/Dialogs/FastFoodMealSetCEDialog";
import FastFoodStoreMealSetMealsAPI from "@/API/FastFoodStores/FastFoodStoreMealSetMealsAPI";
import FastFoodMealSetMealCEDialog from "@/Dialogs/FastFoodMealSetMealCEDialog";

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
    border: 2px solid #e0e0e0;
  
  
    &:hover{
      border: 2px solid #FACC2C;
      cursor: pointer;
    }
`;

const mealsColumns = [
    {
        name: 'name',
        label: 'Nazwa',
    },{
        name: 'image',
        label: 'Zdjęcie',
        searchValue: (val) => '',
    },{
        name: 'calories_per_item',
        label: 'Kalorie (szt)'
    },{
        name: 'calories_per_100g',
        label: 'Kalorie (100g)'
    },{
        name: 'category',
        label: 'Kategoria'
    },{
        name: 'weight_in_grams',
        label: 'Waga (g)'
    }
];

const setsColumns = [
    {
        name: 'name',
        label: 'Nazwa'
    },{
        name: 'image',
        label: 'Zdjęcie',
        searchValue: (val) => '',
    },{
        name: 'calories_per_serving',
        label: 'Kalorie'
    }
];

const FastFoodEditView = () => {

    const inputFileRef = useRef(null);

    const { id } = useParams();
    const [fastFoodStore, setFastFoodStore] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [tab, setTab] = useState(0);
    const [oldImagePath, setOldImagePath] = useState(placeholderImage);
    const [fastFoodMeals, setFastFoodMeals] = useState([]);
    const [fastFoodSets, setFastFoodSets] = useState([]);
    const [fastFoodMealCategories, setFastFoodMealCategories] = useState([]);
    const [fastFoodSetCategories, setFastFoodSetCategories] = useState([]);

    const [mealDialogOpen, setMealDialogOpen] = useState(false);
    const [mealToEditId, setMealToEditId] = useState(null);

    const [setDialogOpen, setSetDialogOpen] = useState(false);
    const [setToEditId, setSetToEditId] = useState(null);

    const [mealInSetDialogOpen, setMealInSetDialogOpen] = useState(false);
    const [mealInSetToEditId, setMealInSetToEditId] = useState(null);
    const [mealInSetSetId, setMealInSetSetId] = useState(null);

    const [newImage, setNewImage] = useState({
        selected: false,
        url: '',
        file: null
    });


    const load = async () => {
        setIsLoading(true);

        const {data} = await FastFoodStoresAPI.get(id);

        setFastFoodStore(data.data);
        formik.setValues({
            name: data.data.name
        });
        setOldImagePath(NetworkUtils.fixBackendUrl(data.data?.image) || placeholderImage);
        setIsLoading(false);
    }

    const loadMeals = async () => {
        const {data,code} = await FastFoodStoreMealsAPI.getAll(id);

        if(code > 300){
            toast.error('Nie udało się załadować produktów');
            return;
        }
        console.log(data.data[0])
        setFastFoodMeals(data.data);

    }

    useEffect(() => {
        let fastFoodCategories = [];

        fastFoodMeals.forEach((meal) => {
            const category = meal?.category || 'Nieskategoryzowane';
            if(!fastFoodCategories.includes(category)){
                fastFoodCategories.push(category);
            }
        });

        setFastFoodMealCategories(fastFoodCategories);


    }, [fastFoodMeals]);



    const loadSets = async () => {
        const {data,code} = await FastFoodStoreMealSetsAPI.getAll(id);

        if(code > 300){
            toast.error('Nie udało się załadować produktów');
            return;
        }

        console.log('ASDASDASD',data.data);

        setFastFoodSets(data.data);

    }

    useEffect(() => {
        let fastFoodCategories = [];

        fastFoodSets.forEach((set) => {
            const category = set?.category || 'Nieskategoryzowane';
            if(!fastFoodCategories.includes(category)){
                fastFoodCategories.push(category);
            }
        });

        setFastFoodSetCategories(fastFoodCategories);
    }, [fastFoodSets]);

    useEffect(() => {
        load();
        loadMeals();
        loadSets();
    }, []);

    const formik = useFormik({
        initialValues: {
            'name': ''
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Nazwa jest wymagana')
        }),
        onSubmit: async (values) => {
            await toast.promise(FastFoodStoresAPI.update(id,values),{
                loading: 'Zapisywanie restauracji...',
                success: 'Restauracja została zapisana',
                error: 'Nie udało się zapisać restauracji'
            })
            load();
        }
    });

    const onFileChangeCapture = (e) => {

        if(e.target.files.length === 0){
            setNewImage({
                selected: false,
                url: '',
                file: null
            })
            //updateImage();
            //onChange(e);
        }else{

            let types = [
                'image/png',
                'image/jpg',
                'image/jpeg'
            ]

            if(types.includes(e.target.files[0].type)) {
                setNewImage({
                    selected: true,
                    url: URL.createObjectURL(e.target.files[0]),
                    file: e.target.files[0]
                });
                //updateImage();
            }
        }


    }

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    const handleImageClick = () => {
        inputFileRef.current.click();
    }

    const updateImage = async () => {
        console.log(newImage.file);
        if(newImage?.file)
            await toast.promise(FastFoodStoresAPI.update(id,{
                image: newImage.file
            }),{
                loading: 'Zapisywanie zdjęcia...',
                success: 'Zdjęcie zostało zapisane',
                error: 'Nie udało się zapisać zdjęcia'
            })

    }

    useEffect(() => {
        updateImage();
    }, [newImage]);

    return <Container>
        {isLoading && <LinearProgress />}
        <FAB icon={<Save />} onClick={formik.submitForm} />
        <FastFoodMealSetMealCEDialog
            open={mealInSetDialogOpen}
            setId={mealInSetSetId}
            editId={mealInSetToEditId}
            onClose={() => {
                setMealInSetDialogOpen(false);
                setMealInSetToEditId(null);
                setMealInSetSetId(null);
                loadSets();
            }}
            storeId={id}
            products={fastFoodMeals}
        />
        <FastFoodMealCEDialog
            categories={fastFoodMealCategories}
            open={mealDialogOpen}
            onClose={(rs) => {
                setMealDialogOpen(false);
                if(rs) loadMeals();
            }}
            storeId={id}
            editId={mealToEditId}
        />
        <FastFoodMealSetCEDialog
            open={setDialogOpen}
            onClose={(rs) => {
                setSetDialogOpen(false);
                if(rs) loadSets();
            }}
            storeId={id}
            editId={setToEditId}
        />
        <h2>{fastFoodStore?.name || 'Ładowanie...'}</h2>
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tab} onChange={handleTabChange} centered={true} >
                    <Tab label="Główne"  />
                    <Tab label="Produkty"  />
                    <Tab label="Zestawy"  />
                </Tabs>
            </Box>
            <CustomTabPanel value={tab} index={0}>
                <input
                    type="file"
                    ref={inputFileRef}
                    onChangeCapture={onFileChangeCapture}
                    name={'image'}
                    hidden={true}
                />
                <Grid container spacing={8}>
                    <Grid item xs={12} md={6}>
                        <Image src={newImage.selected && newImage.url || oldImagePath}
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
            </CustomTabPanel>
            <CustomTabPanel value={tab} index={1}>
                <DataTable
                    searchBar={true}
                    canSelect={false}
                    columns={mealsColumns}
                    data={fastFoodMeals.map((item)=> {
                        return {
                            ...item,
                            image: <img src={NetworkUtils.fixBackendUrl(item.image) || placeholderImage} style={{width: 'auto',height: '80px',borderRadius: '10px'}} />
                        }
                    })}
                    title={'Produkty'}
                    inlineTools={[
                        {
                            label: 'Edytuj',
                            icon: <Edit />,
                            onClick: (row) => {
                                setMealToEditId(row.id);
                                setMealDialogOpen(true);
                            }
                        },{
                            label: 'Usuń',
                            icon: <Delete color={'error'} />,
                            onClick: (row) => {
                                toast.promise(FastFoodStoreMealsAPI.delete(id,row.id),{
                                    loading: 'Usuwanie produktu...',
                                    success: 'Pomyślnie usunięto produkt',
                                    error: 'Nie udało się usunąć produktu'
                                }).then(() => {
                                    loadMeals();
                                })
                            }
                        }
                    ]}
                    tools={[
                        {
                            label: 'Dodaj produkt',
                            icon: <Add />,
                            onClick: () => {
                                setMealToEditId(null);
                                setMealDialogOpen(true);
                            }
                        }
                    ]}
                />
            </CustomTabPanel>
            <CustomTabPanel value={tab} index={2}>
                <DataTable
                    searchBar={true}
                    canSelect={false}
                    collapsible={true}
                    collapsibleContent={(row) => {
                        return <div style={{margin: '20px 4px'}} >
                            <DataTable
                                title={'Produkty'}
                                searchBar={true}
                                tools={[
                                    {
                                        label: 'Dodaj produkt',
                                        icon: <Add />,
                                        onClick: () => {
                                            setMealInSetToEditId(null);
                                            setMealInSetDialogOpen(true);
                                            setMealInSetSetId(row.id);
                                        }
                                    }
                                ]}
                                inlineTools={[
                                    {
                                        label: 'Edytuj',
                                        icon: <Edit />,
                                        onClick: (inRow) => {
                                            setMealInSetToEditId(inRow.id);
                                            setMealInSetDialogOpen(true);
                                            setMealInSetSetId(row.id);
                                        }
                                    },{
                                        label: 'Usuń',
                                        icon: <Delete color={'error'} />,
                                        onClick: (inRow) => {
                                            toast.promise(FastFoodStoreMealSetMealsAPI.delete(id, row.id,inRow.id),{
                                                loading: 'Usuwanie produktu...',
                                                success: 'Pomyślnie usunięto produkt',
                                                error: 'Nie udało się usunąć produktu'
                                            }).then(() => {
                                                loadSets();
                                            })
                                        }
                                    }
                                ]}
                                data={row.meals.map(item => {
                                    return {
                                        ...item,
                                        name: item.meal.name,
                                        calories: item.meal.calories_per_item * item.quantity + ' kcal'
                                    }
                                })}
                                columns={[
                                    {
                                        name: 'name',
                                        label: 'Nazwa'
                                    },{
                                        name: 'quantity',
                                        label: 'Ilość'
                                    },{
                                        name: 'calories',
                                        label: 'Kalorie'
                                    }
                                ]}
                            />
                        </div>
                    }}
                    columns={setsColumns}
                    data={fastFoodSets.map((item)=> {
                        return {
                            ...item,
                            image: <img src={NetworkUtils.fixBackendUrl(item.image) || placeholderImage} style={{width: 'auto',height: '80px',borderRadius: '10px'}} />
                        }
                    })}
                    title={'Zestawy'}
                    inlineTools={[
                        {
                            label: 'Edytuj',
                            icon: <Edit />,
                            onClick: (row) => {
                                setSetToEditId(row.id);
                                setSetDialogOpen(true);
                            }
                        },{
                            label: 'Usuń',
                            icon: <Delete color={'error'} />,
                            onClick: (row) => {
                                toast.promise(FastFoodStoreMealSetsAPI.delete(id,row.id),{
                                    loading: 'Usuwanie zestawu...',
                                    success: 'Pomyślnie usunięto zestaw',
                                    error: 'Nie udało się usunąć zestawu'
                                }).then(() => {
                                    loadSets();
                                })
                            }
                        }
                    ]}
                    tools={[
                        {
                            label: 'Dodaj zestaw',
                            icon: <Add />,
                            onClick: () => {
                                setSetToEditId(null);
                                setSetDialogOpen(true);
                            }
                        }
                    ]}
                />
            </CustomTabPanel>
        </Box>
    </Container>
}

export default FastFoodEditView;