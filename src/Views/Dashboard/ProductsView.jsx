import styled from "styled-components";
import {Box, Card, CardContent, CardMedia, Grid, Typography} from "@mui/material";
import ProductCard from "@/Components/ProductCard/ProductCard";
import {useEffect, useState} from "react";
import ProductsAPI from "@/API/ProductsAPI";


const Container = styled.div`
  //max-width: 800px;
  //background-color: white;
  min-height: calc(100% - 100px);
  margin: 20px auto;
  padding: 30px;
  border-radius: 10px;

  width: calc(100% - 100px);

`;


const ProductsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 10px;
  //center the grid
    justify-items: center;
`;



const ProductsView = () => {
    const [currentPage,setCurrentPage] = useState(1);
    const [totalPages,setTotalPages] = useState(1);
    const [products,setProducts] = useState([]);

    const load = async (append = false) => {
        const result = await ProductsAPI.getAll(currentPage);

        if(result.status === 200){
            const {data} = result.data;
            setTotalPages(data.last_page);

            setProducts([
                    ...(append ? products : [])
                ,...data.data]);
        }
    }

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);

    }


    useEffect(() => {
        load(true).catch(console.error);
    }, [currentPage]);

    console.log(products);

    return <Container>
        <h2>Produkty</h2>
        <ProductsContainer>
            {
                products.map((product) => <ProductCard key={product.id} data={product}/>)
            }
        </ProductsContainer>
    </Container>

}

export default ProductsView;
