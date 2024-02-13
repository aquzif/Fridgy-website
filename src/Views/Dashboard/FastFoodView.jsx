import {useParams} from "react-router-dom";
import {Container} from "@/Components/Common/Common";
import {useEffect, useState} from "react";
import FastFoodStoresAPI from "@/API/FastFoodStores/FastFoodStoresAPI";
import NetworkUtils from "@/Utils/NetworkUtils";
import placeholderImage from "@/Assets/placeholder.png";
import FastFoodStoreMealsAPI from "@/API/FastFoodStores/FastFoodStoreMealsAPI";
import toast from "react-hot-toast";
import FastFoodStoreMealSetsAPI from "@/API/FastFoodStores/FastFoodStoreMealSetsAPI";
import {Box, Card, CardActions, CardMedia, IconButton, LinearProgress, Tab, Tabs} from "@mui/material";
import CustomTabPanel from "@/Components/CustomTabPanel/CustomTabPanel";
import placeholder from "@/Assets/placeholder.png";
import {DeleteForever, Edit, Visibility} from "@mui/icons-material";
import styled from "styled-components";

const ListContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-around;
`;

const FastFoodView = (
    {
        selectable = false,
    }
) => {

    const { id } = useParams();
    const [isLoading,setIsLoading] = useState(true);
    const [categories,setCategories] = useState([]);
    const [fastFoodStore,setFastFoodStore] = useState(null);
    const [fastFoodMeals,setFastFoodMeals] = useState([]);
    const [fastFoodSets,setFastFoodSets] = useState([]);
    const [fastFoodMealCategories,setFastFoodMealCategories] = useState([]);
    const [tab, setTab] = useState(0);



    const load = async () => {
        setIsLoading(true);

        const {data} = await FastFoodStoresAPI.get(id);

        setFastFoodStore(data.data);

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
        load();
        loadMeals();
        loadSets();
    }, []);

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

        fastFoodMeals.forEach((meal) => {
            const category = meal?.category || 'Nieskategoryzowane';
            if(!fastFoodCategories.includes(category)){
                fastFoodCategories.push(category);
            }
        });

        setFastFoodMealCategories(fastFoodCategories);


    }, [fastFoodMeals]);


    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };


    return <Container>
        { isLoading && <LinearProgress />}
        <h1>{isLoading ? 'Ładowanie' : fastFoodStore.name}</h1>
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tab} onChange={handleTabChange} centered={true} >
                    <Tab label="Zestawy" />
                    {
                        fastFoodMealCategories.map((category) => {
                            return <Tab label={category}  />
                        })

                    }
                </Tabs>
            </Box>
            <CustomTabPanel value={tab} index={0}>
                <h2>Zestawy</h2>
                <ListContainer>
                    {
                        fastFoodSets.map((set) =>  <ItemCard fastFood={set} />)
                    }
                </ListContainer>
            </CustomTabPanel>
            {
                fastFoodMealCategories.map((category,index) => {
                    return <CustomTabPanel value={tab} index={index+1}>
                        <h2>{category}</h2>
                        <ListContainer >
                            {
                                fastFoodMeals.filter((meal) => {
                                    return meal.category === category;
                                }).map((meal) => <ItemCard fastFood={meal} /> )
                            }
                        </ListContainer>
                    </CustomTabPanel>
                })
            }
        </Box>

    </Container>
}


const ItemCard = (
    {
        fastFood
    }
) => {
    return <Card sx={{ width: 270,marginBottom: "30px" }}>
        <CardMedia
            sx={{ height: 160 }}
            image={NetworkUtils.fixBackendUrl(fastFood.image) || placeholder}
            title={fastFood.name}
        />
        <div
            style={{
                padding: '10px 20px 0px 20px',
                fontWeight: 'bold',
                fontSize: '1.2rem',
            }}
        >{fastFood.name}</div>
        <CardActions>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'center',
            }}>
                <IconButton aria-label="edit restaurant">
                    <Edit/>
                </IconButton>
            </div>
        </CardActions>

    </Card>;
}

export default FastFoodView;