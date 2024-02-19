import {
    Box,
    Button,
    Card, CardActions, CardMedia,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, IconButton,
    LinearProgress,
    Tab,
    Tabs
} from "@mui/material";
import {useEffect, useState} from "react";
import styled from "styled-components";
import FastFoodStoresAPI from "@/API/FastFoodStores/FastFoodStoresAPI";
import NetworkUtils from "@/Utils/NetworkUtils";
import placeholderImage from "@/Assets/placeholder.png";
import CustomTabPanel from "@/Components/CustomTabPanel/CustomTabPanel";
import FastFoodStoreMealsAPI from "@/API/FastFoodStores/FastFoodStoreMealsAPI";
import toast from "react-hot-toast";
import FastFoodStoreMealSetsAPI from "@/API/FastFoodStores/FastFoodStoreMealSetsAPI";
import placeholder from "@/Assets/placeholder.png";
import {Edit} from "@mui/icons-material";
import NumberInput from "@/Components/NumberInput/NumberInput";


const FlexContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
`;

const FastFoodCardSelector = styled.div`
  width: 300px;
  height: 180px;
  border-radius: 10px;
  border: 1px solid #d1d1d1;
  margin: 10px;
  background-size: cover;
  background-position: center;
  background-image: url(${props => props.img});
  position: relative;
`;

const ListContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-around;
`;

const StoreName = styled.p`
    padding: 2px 10px 2px 8px;
    background-color: white;
    display: block;
    width: fit-content;
    border-top-right-radius: 20px;
    color: gray;
    max-width: 80%;
    text-overflow: ellipsis;
    white-space: nowrap;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  border-bottom-left-radius: 20px;
`;

const CalendarEntryFromFastFoodCEDialog = (
    {
        open,
        onClose,
        onSelect,
    }
) => {

    const [stage,setStage] = useState(0);
    const [selectedFastFoodStore,setSelectedFastFoodStore] = useState(null);
    const [fastFoodMeals,setFastFoodMeals] = useState([]);
    const [fastFoodSets,setFastFoodSets] = useState([]);
    const [fastFoodMealCategories,setFastFoodMealCategories] = useState([]);
    const [stores,setStores] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [tab, setTab] = useState(0);

    const loadMeals = async () => {
        const {data,code} = await FastFoodStoreMealsAPI.getAll(selectedFastFoodStore.id);

        if(code > 300){
            toast.error('Nie udało się załadować produktów');
            return;
        }
        console.log(data.data[0])
        setFastFoodMeals(data.data);

    }

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    const loadSets = async () => {
        const {data,code} = await FastFoodStoreMealSetsAPI.getAll(selectedFastFoodStore.id);

        if(code > 300){
            toast.error('Nie udało się załadować produktów');
            return;
        }

        setFastFoodSets(data.data);

    }

    const load = async () => {
        setIsLoading(true);
        setStage(0);
        setTab(0);
        setFastFoodMeals([]);
        setFastFoodSets([]);
        setFastFoodMealCategories([]);
        //setStores([]);

        const {data} = await FastFoodStoresAPI.getAll(1);

        setStores(data.data);
        setIsLoading(false);
    }

    useEffect(() => {
        if(open){
            load();
        }
    }, [open]);

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

    useEffect(() => {
        if(selectedFastFoodStore){
            loadMeals();
            loadSets();
        }
    },[selectedFastFoodStore]);


    const handleSave = () => {
        let selectedSets = fastFoodSets.filter((set) => set?.quantity > 0);
        let selectedMeals = fastFoodMeals.filter((meal) => meal?.quantity > 0);

        for(let set of selectedSets){
            for(let meal of set.meals){
                selectedMeals.push({
                    ...meal,
                    quantity: meal.quantity * set.quantity
                });
            }
        }

        let reducedMeals = [];

        for(let meal of selectedMeals){
            let found = false;
            for(let reducedMeal of reducedMeals){
                if(reducedMeal.id === meal.id){
                    found = true;
                    reducedMeal.quantity += meal.quantity;
                    break;
                }
            }
            if(!found){
                reducedMeals.push({
                    id: meal.id,
                    quantity: meal.quantity
                });
            }
        }

        onSelect({
            id: selectedFastFoodStore.id,
            meals: reducedMeals
        });

    }

    return (
        <Dialog
            open={open}
            maxWidth={stage === 0 ? 'md' : 'lg'}
            fullWidth
            onClose={onClose}
        >
            <DialogTitle>
                {stage === 0 ? 'Wybierz restaurację' : 'Wybierz produkty'}
            </DialogTitle>
            { isLoading && <LinearProgress />}
            <DialogContent>

                {
                    stage === 0 ? (<FlexContainer>
                        {
                            stores.map((store) => (<div key={store.id}  >
                                <FastFoodCardSelector  img={NetworkUtils.fixBackendUrl(store?.image)|| placeholderImage }
                                    onClick={() => {
                                        setSelectedFastFoodStore(store);
                                        setStage(1);
                                    }}
                                >
                                    <StoreName>
                                        {store.name}
                                    </StoreName>
                                </FastFoodCardSelector>
                            </div>))
                        }
                    </FlexContainer>) : (<div>
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
                                        fastFoodSets.map((set) =>
                                            <ItemCard fastFood={set}
                                                      onChange={(val) => {
                                                            const newSets = fastFoodSets.map((m) => {
                                                                if(m.id === set.id){
                                                                    m.quantity = val;
                                                                }
                                                                return m;
                                                            });
                                                            setFastFoodSets(newSets);

                                                      }}

                                            />)
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
                                                }).map((meal) =>
                                                    <ItemCard fastFood={meal}
                                                        onChange={(val) => {
                                                            const newMeals = fastFoodMeals.map((m) => {
                                                                if(m.id === meal.id){
                                                                    m.quantity = val;
                                                                }
                                                                return m;
                                                            });
                                                            setFastFoodMeals(newMeals);
                                                        }}
                                                    />
                                                )
                                            }
                                        </ListContainer>
                                    </CustomTabPanel>
                                })
                            }
                        </Box>
                    </div>)
                }

            </DialogContent>
            <DialogActions>
                <Button color={'warning'} onClick={onClose}>Anuluj</Button>
                <Button onClick={handleSave} >Zapisz</Button>
            </DialogActions>
        </Dialog>
    )


}

const ItemCard = (
    {
        fastFood,
        onChange
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
            >{fastFood.name} {
            fastFood.calories_per_item ? `(${Math.ceil(fastFood.calories_per_item)} kcal)` : `(${
                Math.ceil(fastFood.meals.reduce((a,b) => {
                    return a + b.quantity * b.meal.calories_per_item
                },0))
            } kcal)`

        } </div>
        <CardActions>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'center',
            }}>
                <NumberInput
                    value={fastFood?.quantity || 0}
                    max={20}
                    min={0}
                    onChange={(e,val) => onChange(val)}
                />
            </div>
        </CardActions>

    </Card>;
}

export default CalendarEntryFromFastFoodCEDialog;