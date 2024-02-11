import {useParams} from "react-router-dom";
import styled from "styled-components";
import {useEffect, useState} from "react";
import RecipesAPI from "@/API/RecipesAPI";
import toast from "react-hot-toast";
import NetworkUtils from "@/Utils/NetworkUtils";
import kcalImage from '@/Assets/kcal.png';
import foodRationImage from '@/Assets/food_ration.png';
import timeImage from '@/Assets/time.png';
import {Grid} from "@mui/material";
import {EntryRawProductContent} from "@/Components/ShoppingListEntry/ShoppingListEntry";
import NumberInput from "@/Components/NumberInput/NumberInput";
import VerticalLinearStepper from "@/Components/RecipeSteps/RecipeSteps";
import URLUtils from "@/Utils/URLUtils";


const Container = styled.div`
    width: calc(100% - 100px);
    background-color: white;
    min-height: calc(100% - 100px);
    margin: 20px auto;
    padding: 30px;
    border-radius: 10px;
`;

const TopImage = styled.div`
    width: 100%;
    height: 300px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  
    border-radius: 10px;
`;

const Title = styled.h1`
  font-size: 30px;
  padding: 0;
  width: fit-content;
  top: 250px;
  padding: 10px 20px 10px 10px;
  border-top-right-radius: 40px;
  position: relative;
  background-color: white;
  max-width: calc(100% - 100px);
  //@media (max-width: 768px) {
  //  max-width: calc(100% - 200px);
  //}
  
//hide text overflow in ...
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const RecipeView = () => {

    const { id } = useParams();
    const [recipe,setRecipe] = useState(null);
    const [isLoading,setIsLoading] = useState(true);
    const [showPerPortion,setShowPerPortion] = useState(1);

    useEffect(() => {
        load();
    }, [id]);

    const load = async () => {
        setIsLoading(true);

        const response = await RecipesAPI.get(id);

        if(response.code >= 400){
            toast.error('Nie udało się pobrać przepisu');
            return;
        }

        const {data} = response.data;

        setRecipe(data);
        setShowPerPortion(data.serving_amount);

        setIsLoading(false);
    }

    let porMulti = (showPerPortion || 1);

    const topData = [
        {
            image: kcalImage,
            value: <>
                {Math.round(recipe?.calories_per_serving * porMulti) || 0} kalorii <br />
                {Math.round(recipe?.calories_per_serving)} na porcję
            </>
        },
        {
            image: foodRationImage,
            value: (recipe?.serving_amount || '') +
                (recipe?.serving_amount === 1 ? ' porcja' : recipe?.serving_amount > 1 && recipe?.serving_amount < 5 ? ' porcje' : ' porcji')
        },
        {
            image: timeImage,
            value: (recipe?.prepare_time || '') + ' minut przygotowania'
        }
    ]

    return <Container>
        <TopImage style={{backgroundImage: `url(${NetworkUtils.fixBackendUrl(recipe?.image)})` }} >
            <Title>{isLoading ? 'Ładowanie...' : recipe?.name}</Title>
        </TopImage>



        <Grid container spacing={2} sx={{marginTop: '10px'}} >
            {
                topData.map(item => (
                    <Grid item xs={12} md={4}>
                        <div style={{
                            width: '100%',
                            backgroundColor: 'white',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'

                        }} >
                            <img style={{
                                width: '40px',
                                height: '40px',
                                objectFit: 'cover',
                                borderRadius: '10px',
                                marginRight: '10px'
                            }} src={item.image} />
                            <span>{item.value}</span>
                        </div>
                    </Grid>
                ))
            }
        </Grid>
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                padding: '20px',
                alignItems: 'center'
            }}
        >
            <p style={{paddingRight: '20px'}}>Ilość porcji: </p>
            <NumberInput
                value={showPerPortion}
                max={20}
                min={1}
                onChange={(e,val) => setShowPerPortion(val)}
            />
        </div>
        <div style={{textAlign:'center'}} >
            {
                // youtube embed
                recipe?.video_url && <iframe
                    width="560"
                    height="315"
                    src={recipe?.video_url}
                    title="YouTube"
                    frameborder="0"
                    allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen></iframe>

            }
        </div>
        <Grid container spacing={2} sx={{marginTop: '40px'}} >
            <Grid item xs={12} md={4}>
                <p style={{textAlign: 'center',fontSize: '25px',fontWeight: 'bold'}} >Składniki</p>
                <div
                    style={{
                        padding: '10px'
                    }}
                >
                    {
                        recipe?.ingredients.map(ingredient => (
                            //<li>{ingredient.product.name} - {ingredient.amount_in_unit} {ingredient.unit.name}</li>
                            <div style={{
                                padding: '4px'
                            }} >
                                <EntryRawProductContent data={{
                                    product_name: `${ingredient.product.name} `,
                                    amount: Math.fround(ingredient.amount_in_unit * (porMulti / recipe?.serving_amount)),
                                    unit_name: <>
                                        {ingredient.unit.name} ({Math.fround(ingredient.amount_in_grams)*(porMulti / recipe?.serving_amount)}g) <br /> (<b>{Math.round(ingredient.calories * (porMulti / recipe?.serving_amount))}</b> kcal)</>
                                }} />
                            </div>
                        ))
                    }
                </div>
            </Grid>
            <Grid item xs={12} md={8}>
                <p style={{textAlign: 'center',fontSize: '25px',fontWeight:'bold'}} >Przepis</p>
                <VerticalLinearStepper
                    steps={JSON.parse(recipe?.steps || '[]')}
                />
            </Grid>
        </Grid>
    </Container>
}

export default RecipeView;