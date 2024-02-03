import {useEffect, useState} from "react";
import {Container} from "@/Components/Common/Common";
import styled from "styled-components";
import FastFoodStoresAPI from "@/API/FastFoodStores/FastFoodStoresAPI";
import placeholder from "@/Assets/placeholder.png";
import {Button, Card, CardActions, CardContent, CardMedia, IconButton, Typography} from "@mui/material";
import {DeleteForever, Edit, EditAttributes, FavoriteBorder, Visibility} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import FAB from "@/Components/FAB/FAB";
import FastFoodCEDialog from "@/Dialogs/FastFoodCEDialog";
import ConfirmDialog from "@/Dialogs/ConfirmDialog";
import toast from "react-hot-toast";
import NetworkUtils from "@/Utils/NetworkUtils";

const FastFoodsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-around;
`;
/*
const FastFoodCard = styled.div`
  background-image: url(${props => props.backgroundImg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 1px solid #d8d8d8;
  position: relative;
  width: 300px;
  border-radius: 5px;
  height: 200px;
`;

const FastFoodCardTitle = styled.h2`
  color: white;
  position: absolute;
  text-align: center;
  bottom: 0;
  width: 100%;
  background-color: rgba(0,0,0,0.5);
  border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
`;*/

const FastFoodsView = () => {

    const [fastFoods, setFastFoods] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [fastFoodToDelete, setFastFoodToDelete] = useState(null);

    const navigate = useNavigate();

    const load = async () => {
        setIsLoading(true);


        const {data} = await FastFoodStoresAPI.getAll(1);
        setFastFoods(data.data);
        setIsLoading(false);
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <Container>
            <ConfirmDialog
                open={fastFoodToDelete !== null}
                onClose={(res) => {
                    if(res) {
                        toast.promise(
                            FastFoodStoresAPI.delete(fastFoodToDelete?.id),
                            {
                                loading: 'Usuwanie restauracji...',
                                success: 'Usunięto restaurację',
                                error: 'Nie udało się usunąć restauracji'
                            }
                        )
                    }
                    setFastFoodToDelete(null);
                    load();

                }}
                title="usuwanie restauracji"
                subtitle={`Czy na pewno chcesz usunąć "${fastFoodToDelete?.name}"?`}
            />
            <FastFoodCEDialog
                open={createDialogOpen}
                onClose={() => {
                    setCreateDialogOpen(false);
                    load();
                }}
            />
            <FAB
                onClick={() => setCreateDialogOpen(true)}
            />
            <h1>Fast Food</h1>
            <FastFoodsContainer>
                {
                    fastFoods.map((fastFood) => {
                        return (
                            <Card sx={{ width: 320,marginBottom: "30px" }}>
                                <CardMedia
                                    sx={{ height: 180 }}
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
                                        <div>
                                            <IconButton aria-label="edit restaurant">
                                                <Edit
                                                    onClick={() => navigate(`/fast-food/${fastFood.id}/edit`)}
                                                />
                                            </IconButton>
                                            <IconButton aria-label="view restaurant"
                                                onClick={() => navigate(`/fast-food/${fastFood.id}`)}
                                            >
                                                <Visibility />
                                            </IconButton>
                                        </div>
                                        <div>
                                            <IconButton aria-label="delete fast food"
                                                onClick={() => setFastFoodToDelete(fastFood)}
                                            >
                                                <DeleteForever color={'error'} />
                                            </IconButton>
                                        </div>
                                    </div>
                                </CardActions>

                            </Card>
                            /*<FastFoodCard backgroundImg={fastFood.image || placeholder} >
                                <FastFoodCardTitle>{fastFood.name}</FastFoodCardTitle>
                            </FastFoodCard>*/
                        )
                    })
                }
            </FastFoodsContainer>
        </Container>
    )
}

export default FastFoodsView;