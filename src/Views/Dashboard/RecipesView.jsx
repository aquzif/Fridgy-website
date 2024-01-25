import styled from "styled-components";
import {useEffect, useState} from "react";
import RecipesAPI from "@/API/RecipesAPI";
import toast from "react-hot-toast";
import {Grid} from "@mui/material";
import RecipeCard from "@/Components/RecipeCard/RecipeCard";
import {Save} from "@mui/icons-material";
import FAB from "@/Components/FAB/FAB";


const Container = styled.div`
  width: calc(100% - 100px);
  background-color: white;
  min-height: calc(100% - 100px);
  margin: 20px auto;
  padding: 30px;
  border-radius: 10px;
`;

const RecipesView = () => {

    const [recipes,setRecipes] = useState([]);
    const [isLoading,setIsLoading] = useState(true);
    const [currentPage,setCurrentPage] = useState(0);
    const [totalPages,setTotalPages] = useState(0);

    const load = async () => {
        setIsLoading(true);

        if(currentPage === totalPages && currentPage !== 0)
            return;

        const response = await RecipesAPI.getAll(currentPage + 1);

        if(response.code >= 400){
            toast.error('Nie udało się pobrać przepisów');
            return;
        }

        const {data} = response.data;

        console.log(data);
        setRecipes([...recipes,...data.data]);
        setCurrentPage(currentPage + 1);
        setTotalPages(data.last_page);

        setIsLoading(false);
    }


    useEffect(() => {
        load();
    },[]);


    return <Container>
        <h2>Przepisy</h2>
        <Grid container spacing={2}>
            {
                [...recipes,...recipes,...recipes].map((recipe) => {
                    return <Grid item xs={12} md={6} lg={3} xl={2} key={recipe.id}>
                        <RecipeCard
                            data={recipe}
                        />
                    </Grid>
                })
            }
        </Grid>

    </Container>
}

export default RecipesView;
