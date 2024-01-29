import {useEffect, useState} from "react";
import ProductsAPI from "@/API/ProductsAPI";
import DataTable from "@/Components/DataTable/DataTable";
import styled from "styled-components";
import ProductCategoriesAPI from "@/API/ProductCategoriesAPI";
import {Add, Delete, Edit} from "@mui/icons-material";
import store from "@/Store/store";
import {requestProductCategories} from "@/Store/Reducers/ProductCategoryReducer";
import {useSelector} from "react-redux";
import CategoryCEDialog from "@/Dialogs/CategoryCEDialog";
import toast from "react-hot-toast";


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
    }, {
        'name': 'name',
        'label': 'Nazwa',
    }
];

const CategoriesView = () => {

    const {productCategories,isLoading} = useSelector(state => state.productCategoryReducer);
    const [categoryDialogOpen,setCategoryDialogOpen] = useState(false);
    const [editMode,setEditMode] = useState(false);
    const [editId,setEditId] = useState(null);
    const [selectedIds,setSelectedIds] = useState([]);

    const load = async (append = false) => {
        store.dispatch(requestProductCategories());
    }

    const inlineTools = [
        {
            'name': 'edit',
            'label': 'Edytuj',
            'icon': <Edit />,
            'onClick': async (row) => {
                setEditId(row.id);
                setEditMode(true);
                setCategoryDialogOpen(true);
            }
        }
    ]

    const deleteSelected = async () => {
        for(let category of productCategories.filter((category) => selectedIds.includes(category.id))){
            await ProductCategoriesAPI.delete(category.id);
        }
        load();
    }

    const tools = [
        {
            'name': 'add',
            'label': 'Dodaj',
            'icon': <Add />,
            'onClick': async () => {
                setEditId(null);
                setEditMode(false);
                setCategoryDialogOpen(true);
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

    useEffect(() => {
        load();
    },[]);

    const handleDialogClose = (success) => {
        setEditId(null);
        setEditMode(false);
        setCategoryDialogOpen(false);
        if(success)
            load();
    }


    return <div>
        <CategoryCEDialog
            open={categoryDialogOpen}
            onClose={handleDialogClose}
            editMode={editMode}
            editId={editId}
        />

        <DataTable
            title={'Kategorie'}
            isLoading={isLoading}
            searchBar={true}
            data={productCategories}
            columns={columns}
            inlineTools={inlineTools}
            tools={tools}
            onSelect={(selected) => setSelectedIds(selected)}
        />

    </div>

}

export default CategoriesView;