import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import OpenFoodFactsAPI from "@/API/OpenFoodFactsAPI";
import styled from "styled-components";
import {Container} from "@/Components/Common/Common";

const Image = styled.img`
    width: auto;
    height: 300px;
    margin: 20px auto;
    display: block;
  object-fit: contain;
`;

const Title = styled.p`
    font-size: 18px;
    text-align: center;
    font-weight: bold;
`;

const BarcodeResultsView =
(

) => {

    const [found,setFound] = useState(false);
    const [product,setProduct] = useState(null);
    const {barcode} = useParams();

    useEffect(() => {
        if(barcode !== null)
        OpenFoodFactsAPI.getProductViaBarcode(barcode)
            .then((res) => {
                setFound(res.status === 1)
                console.log(res);
                setProduct(res.product || null);
            })
    }, [barcode]);


    return (
        <Container>
            <Title>{product?.product_name_pl || product?.product_name }</Title>
            <Image src={
                product?.image_front_url
                // product?.selected_images?.front?.display?.pl
                // || product?.selected_images?.front?.display?.en
                // || product?.selected_images?.front?.display[Object.keys(product?.selected_images?.front?.display)[0]]
            } />
            <p>Kalorii na 100 gram: {product?.nutriments['energy-kcal_100g']} kcal</p>
            {product?.quantity && <p>Waga: {product?.quantity}</p>}
        </Container>

    )

}

export default BarcodeResultsView;