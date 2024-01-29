import {Box, Card, CardActions, CardContent, CardMedia, IconButton, Tooltip, Typography} from "@mui/material";
import styled from "styled-components";
import {Delete, Edit, Favorite, FavoriteBorder, Visibility} from "@mui/icons-material";

import fatImage from '@/Assets/fat.png';
import carbsImage from '@/Assets/carbs.png';
import proteinImage from '@/Assets/protein.png';
import kcalImage from '@/Assets/kcal.png';
import placeholderImage from '@/Assets/placeholder.png';
import {useNavigate} from "react-router-dom";
import NetworkUtils from "@/Utils/NetworkUtils";
import ConfirmDialog from "@/Dialogs/ConfirmDialog";
import {useState} from "react";
import RecipesAPI from "@/API/RecipesAPI";
import toast from "react-hot-toast";
import foodRationImage from '@/Assets/food_ration.png';
import timeImage from '@/Assets/time.png';

const Container = styled(Card)`
  width: 100%;
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


const RecipeCard = (
    {
        data,
        onReload
    }
) => {
    //https://picsum.photos/200/300

    const [confirmOpen,setConfirmOpen] = useState(false);


    const {
        id,
        name,
        preapre_time,
        serving_amount,
        calories_per_serving,
        image
    } = data;

    const onDelete = (res) => {
        setConfirmOpen(false);
        if(res){
            toast.promise(RecipesAPI.delete(id),{
                loading: 'Usuwanie przepisu...',
                success: 'Przepis został usunięty',
                error: 'Nie udało się usunąć przepisu'
            }).then(() => {
                onReload();
            })

        }
    }

    const navigate = useNavigate();

    return <Container sx={{ display: 'flex',flexDirection: 'column' }}>
        <ConfirmDialog
            title="Usuwanie przepisu"
            open={confirmOpen}
            onClose={onDelete}
            subtitle={'Czy na pewno chcesz usunąć przepis ' + name + '?'}
            />
        <CardMedia
            component="img"
            height="194"
            image={NetworkUtils.fixBackendUrl(image) || placeholderImage}
            alt="Paella dish"
        />
        <CardContent
            sx={{ flexGrow: 1 }}
        >
            <Typography sx={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}} variant={'h6'} gutterBottom>
                <Tooltip title={name} >
                    {name}
                </Tooltip>
            </Typography>
           {/* <Typography sx={{ fontSize: 14}} color="text.secondary" gutterBottom>
                na 100 gram
            </Typography>*/}
            <div style={{display: 'flex',flexDirection: 'row', justifyContent: 'space-between',flexWrap: 'wrap' }} >
               {/*<CardStats
                   image={fatImage}
                   alt="fat-image"
                   val={nutrition_fat}
                   text="g tłuszczu"
               />*/}
                <CardStats
                    image={timeImage}
                    alt="carbs-image"
                    val={preapre_time}
                    text=" minut"
                />
                <CardStats
                    image={foodRationImage}
                    alt="protein-image"
                    val={serving_amount}
                    text=" porcji"
                />
                <CardStats
                    image={kcalImage}
                    alt="kcal-image"
                    val={calories_per_serving}
                    text=" kalorii"
                />
            </div>
        </CardContent>
        <div style={{display: 'flex',flexDirection: 'row',justifyContent: 'space-between'}} >
            <CardActions disableSpacing sx={{position: 'relative',top: '-15px'}}>
                <IconButton aria-label="add to favorites">
                    <FavoriteBorder />
                </IconButton>
                <IconButton
                    onClick={() => navigate(`/przepisy/${id}`)}
                    aria-label="share">
                    <Visibility />
                </IconButton>
                <IconButton
                    onClick={() => navigate(`/przepisy/${id}/edycja`)}
                    aria-label="share">
                    <Edit />
                </IconButton>
            </CardActions>
            <CardActions disableSpacing sx={{position: 'relative',top: '-15px'}}>
                <IconButton
                    onClick={() => setConfirmOpen(true)}
                    aria-label="share">
                    <Delete color={'error'} />
                </IconButton>
            </CardActions>
        </div>
    </Container>

}

export default RecipeCard;