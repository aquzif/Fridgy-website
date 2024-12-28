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
import RecipeTagsAPI from "@/API/RecipeTagsAPI";
import {requestRecipeTags} from "@/Store/Reducers/RecipeTagsReducer";
import RecipeTagCEDIalog from "@/Dialogs/RecipeTagCEDIalog";


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
    }, {
        'name': 'name',
        'label': 'Nazwa',
    },{
        'name': 'color',
        'label': 'Kolor',
    }
];

const RecipeTagsView = () => {

    const {recipeTags,isLoading} = useSelector(state => state.recipeTagsReducer);
    const [recipeTagDialogOpen,setRecipeTagDialogOpen] = useState(false);
    const [editMode,setEditMode] = useState(false);
    const [editId,setEditId] = useState(null);
    const [selectedIds,setSelectedIds] = useState([]);

    const load = async (append = false) => {
        store.dispatch(requestRecipeTags());
    }

    const inlineTools = [
        {
            'name': 'edit',
            'label': 'Edytuj',
            'icon': <Edit />,
            'onClick': async (row) => {
                setEditId(row.id);
                setEditMode(true);
                setRecipeTagDialogOpen(true);
            }
        }
    ]



    const deleteSelected = async () => {
        for(let tag of recipeTags.filter((tag) => selectedIds.includes(tag.id))){
            await RecipeTagsAPI.delete(tag.id);
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
                setRecipeTagDialogOpen(true);
            }
        },{
            'name': 'delete',
            'label': 'Usuń',
            'icon': <Delete />,
            'forSelect': true,
            'onClick': async () => {
                toast.promise(deleteSelected(), {
                    loading: 'Usuwanie Tagów...',
                    success: 'Usunięto Tagi',
                    error: 'Nie udało się usunąć Tagów'
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
        setRecipeTagDialogOpen(false);
        if(success)
            load();
    }


    return <div>
        <RecipeTagCEDIalog
            open={recipeTagDialogOpen}
            onClose={handleDialogClose}
            editMode={editMode}
            editId={editId}
        />

        <DataTable
            title={'Tagi'}
            isLoading={isLoading}
            data={recipeTags.map(tag => {
                return {
                    ...tag,
                    color: <div style={{
                        backgroundColor: tag.color,
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%'
                    }}></div>

                }
            })}
            columns={columns}
            inlineTools={inlineTools}
            tools={tools}
            onSelect={(selected) => setSelectedIds(selected)}
        />

    </div>

}

export default RecipeTagsView;