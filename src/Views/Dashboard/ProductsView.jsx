import styled from "styled-components";
import {Box, Card, CardContent, CardMedia, Grid, Typography} from "@mui/material";
import ProductCard from "@/Components/ProductCard/ProductCard";
import {useEffect, useState} from "react";
import ProductsAPI from "@/API/ProductsAPI";
import DataTable from "@/Components/DataTable/DataTable";
import store from "@/Store/store";
import {requestProductCategories} from "@/Store/Reducers/ProductCategoryReducer";
import productReducer, {requestProducts} from "@/Store/Reducers/ProductReducer";
import {useSelector} from "react-redux";
import {Add, Delete, Edit} from "@mui/icons-material";
import toast from "react-hot-toast";
import ProductCategoriesAPI from "@/API/ProductCategoriesAPI";
import ProductCEDialog from "@/Dialogs/ProductCEDialog";
import {useNavigate} from "react-router-dom";


const Container = styled.div`
  //max-width: 800px;
  //background-color: white;
  min-height: calc(100% - 100px);
  margin: 20px auto;
  padding: 30px;
  border-radius: 10px;

  width: calc(100% - 100px);

`;



const columns = [
    {
        'name': 'id',
        'label': 'ID',
        //'searchValue': (val) => val,
    },{
        'name': 'name',
        'label': 'Nazwa',
    },{
        'name': 'nutrition_energy_kcal',
        'label': 'Kalorii na 100 gram',
    },{
        'name': 'category',
        'label': 'Kategoria',
    }
];



const ProductsView = () => {

    const {products,isLoading} = useSelector(state => state.productReducer);
    const [selectedIds,setSelectedIds] = useState([]);
    const [productDialogOpen,setProductDialogOpen] = useState(false);
    const [editMode,setEditMode] = useState(false);
    const [editId,setEditId] = useState(null);

    const navigate = useNavigate();

    const load = async (append = false) => {
        store.dispatch(requestProducts());
    }

    useEffect(() => {
        load();
    },[]);

    const tools = [
        {
            'name': 'add',
            'label': 'Dodaj',
            'icon': <Add />,
            'onClick': async () => {
                setEditId(null);
                setEditMode(false);
                setProductDialogOpen(true);
            }
        },{
            'name': 'delete',
            'label': 'Usuń',
            'icon': <Delete />,
            'forSelect': true,
            'onClick': async () => {
                toast.promise(deleteSelected(), {
                    loading: 'Usuwanie kategorii...',
                    success: 'Kategoria została usunięta',
                    error: 'Nie udało się usunąć kategorii'
                });
            }

        }
    ];

    const inlineTools = [
        {
            'name': 'edit',
            'label': 'Edytuj',
            'icon': <Edit />,
            'onClick': async (row) => {
                setEditId(row.id);
                setEditMode(true);
                setProductDialogOpen(true);
            }
        }
    ]

    const deleteSelected = async () => {
        for(let product of products.filter((product) => selectedIds.includes(product.id))){
            await ProductsAPI.delete(product.id);
        }
        load();
    }

    const handleDialogClose = (success) => {
        setEditId(null);
        setEditMode(false);
        setProductDialogOpen(false);
        if(success)
            load();
    }

    return <Container>
        <ProductCEDialog
            open={productDialogOpen}
            onClose={handleDialogClose}
            editMode={editMode}
            editId={editId}
        />
        <DataTable
            title={'Produkty'}
            isLoading={isLoading}
            searchBar={true}
            data={products}
            columns={columns}
            tools={tools}
            onSelect={(selected) => setSelectedIds(selected)}
            inlineTools={inlineTools}
            onRowClick={(id) => {
                navigate(`/produkty/${id}`);
            }}
        />

    </Container>

}

export default ProductsView;
