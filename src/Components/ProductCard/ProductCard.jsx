import {Box, Card, CardActions, CardContent, CardMedia, IconButton, Typography} from "@mui/material";
import styled from "styled-components";
import {Favorite, Share} from "@mui/icons-material";

import fatImage from '@/Assets/fat.png';
import carbsImage from '@/Assets/carbs.png';
import proteinImage from '@/Assets/protein.png';
import kcalImage from '@/Assets/kcal.png';


const Container = styled(Card)`
  width: 280px;
  height: 430px;
`

const CardIcon = styled.img`
    width: 32px;
    height: 32px;
    margin-right: 5px;
`;

const CardStatsContainer = styled.div`
    width: 50%;
  min-height: 50px;
  display: flex;  
    flex-direction: row;
    align-items: center;

`;

const CardStats = (
    {
        image,
        alt = '',
        val = 0,
        text = ''

    }
) => {
    return  <CardStatsContainer>
        <CardIcon src={image} alt={alt}/>
        <Typography variant="body2">
            {parseInt(Math.ceil(val))}{text}
        </Typography>
    </CardStatsContainer>
}


const ProductCard = (
    {
        data
    }
) => {
    //https://picsum.photos/200/300

    const {
        id,
        name,
        nutrition_carbs,
        nutrition_energy_kcal,
        nutrition_protein,
        nutrition_fat,
    } = data;

    console.log(data);

    return <Container sx={{ display: 'flex',flexDirection: 'column' }}>
        <CardMedia
            component="img"
            height="194"
            image="https://picsum.photos/500/500?random=1"
            alt="Paella dish"
        />
        <CardContent
            sx={{ flexGrow: 1 }}
        >
            <Typography sx={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}} variant={'h6'} gutterBottom>
                {name}
            </Typography>
            <Typography sx={{ fontSize: 14}} color="text.secondary" gutterBottom>
                na 100 gram
            </Typography>
            <div style={{display: 'flex',flexDirection: 'row', justifyContent: 'space-between',flexWrap: 'wrap' }} >
               <CardStats
                   image={fatImage}
                   alt="fat-image"
                   val={nutrition_fat}
                   text="g tłuszczu"
               />
                <CardStats
                    image={carbsImage}
                    alt="carbs-image"
                    val={nutrition_carbs}
                    text="g carbs"
                />
                <CardStats
                    image={proteinImage}
                    alt="protein-image"
                    val={nutrition_protein}
                    text="g białka"
                />
                <CardStats
                    image={kcalImage}
                    alt="kcal-image"
                    val={nutrition_energy_kcal}
                    text=" kalorii"
                />
            </div>
        </CardContent>
        <CardActions disableSpacing sx={{position: 'relative',top: '-15px'}}>
            <IconButton aria-label="add to favorites">
                <Favorite />
            </IconButton>
            <IconButton aria-label="share">
                <Share />
            </IconButton>

        </CardActions>
    </Container>

}

export default ProductCard;