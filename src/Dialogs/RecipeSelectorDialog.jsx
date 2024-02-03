import {useSelector} from "react-redux";
import {forwardRef, useEffect, useState} from "react";
import useDebounce from "@/Hooks/useDebounce";
import store from "@/Store/store";
import {requestRecipeTags} from "@/Store/Reducers/RecipeTagsReducer";
import RecipesAPI from "@/API/RecipesAPI";
import toast from "react-hot-toast";
import {
    Button,
    Chip, Dialog, DialogActions, DialogContent,
    DialogTitle,
    FormControl,
    Grid, Grow,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    Stack,
    TextField
} from "@mui/material";
import Multiselector from "@/Components/Multiselector/Multiselector";
import RecipeCreateDialog from "@/Dialogs/RecipeCreateDialog";
import FAB from "@/Components/FAB/FAB";
import {Add} from "@mui/icons-material";
import RecipeCard from "@/Components/RecipeCard/RecipeCard";
import styled from "styled-components";


const Container = styled.div`
  width: calc(100% - 100px);
  background-color: white;
  min-height: calc(100% - 100px);
  margin: 20px auto;
  padding: 0px 30px;
  border-radius: 10px;
`;

const SearchContainer = styled.div`
    max-width: 800px;
    margin: 10px auto;
`;

const Transition = forwardRef(function Transition(props, ref) {
    return <Grow /*direction="down"*/ ref={ref} {...props} />;
});

const RecipeSelectorDialog = (
    {
        open,
        onClose,
        onSelect
    }
) => {

    const {recipeTags} = useSelector(state => state.recipeTagsReducer);

    const [recipes,setRecipes] = useState([]);
    const [isLoading,setIsLoading] = useState(true);
    const [currentPage,setCurrentPage] = useState(1);
    const [totalPages,setTotalPages] = useState(1);
    const [searchValue,setSearchValue] = useState('');
    const searchDebounced = useDebounce(searchValue,500);
    const [needAllTags,setNeedAllTags] = useState(0);

    const [newRecipeDialogOpen,setNewRecipeDialogOpen] = useState(false);
    const [selectedTags,setSelectedTags] = useState([]);


    const load = async () => {
        setIsLoading(true);
        store.dispatch(requestRecipeTags());

        let response = '';
        if(searchValue){
            response = await RecipesAPI.search(searchValue,currentPage,selectedTags,needAllTags);
        }else{
            response = await RecipesAPI.getAll(currentPage,selectedTags,needAllTags);
        }


        if(response.code >= 400){
            toast.error('Nie udało się pobrać przepisów');
            return;
        }

        const {data} = response.data;

        setRecipes(data.data);
        setTotalPages(data.last_page);
        if(currentPage > data.last_page)
            setCurrentPage(data.last_page);

        setIsLoading(false);
    }

    const onTagSelect = (val) => {
        let tags = val.map((tag) => tag.id);
        setSelectedTags(tags);
    }

    useEffect(() => {
        load();
    },[currentPage,selectedTags,searchDebounced,needAllTags]);

    const handleSelect = (recipe) => {
        onSelect(recipe);
    }

    return <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        maxWidth={'lg'}
        fullWidth={true}
        onClose={onClose}
    >
        <DialogTitle>Wybierz Posiłek</DialogTitle>
        <DialogContent>
            <Container>
                <SearchContainer>
                    <TextField
                        label={'Szukaj'}
                        id={'recipe-search-input'}
                        name={'recipe-search-input'}
                        variant={'standard'}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        fullWidth={true}
                    />
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginTop: '10px',
                        justifyContent: 'space-between'
                    }} >
                        <div style={{width: 'calc(100% - 210px)'}} >
                            <Multiselector
                                title={'Tagi'}
                                options={recipeTags}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip variant="outlined" label={option.name} {...getTagProps({ index })}
                                              sx={{
                                                  backgroundColor: option.color
                                              }}
                                              size={'small'}
                                        />
                                    ))
                                }
                                onChange={onTagSelect}
                                selected={recipeTags.filter((tag) => {
                                    return selectedTags.includes(tag.id);
                                })}
                            />
                        </div>
                        <div style={{width: '200px'}} >
                            <FormControl variant="standard" fullWidth>
                                <InputLabel >Wymagaj:</InputLabel>
                                <Select
                                    value={needAllTags}
                                    onChange={(val) => setNeedAllTags(val.target.value)}
                                >
                                    <MenuItem value={1}>Wszystkich tagów</MenuItem>
                                    <MenuItem value={0}>Dowolnego tagu</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                </SearchContainer>

                <RecipeCreateDialog
                    open={newRecipeDialogOpen}
                    onClose={(res) => {
                        setNewRecipeDialogOpen(false);
                        if(res){
                            load(true);
                        }
                    }}
                />
                <Grid container spacing={2}>
                    {
                        recipes.map((recipe) => {
                            return <Grid item xs={12} md={6} lg={3} xl={2} key={recipe.id}>
                                <RecipeCard
                                    onReload={() => load(true)}
                                    data={recipe}
                                    selectMode={true}
                                    onSelect={handleSelect}
                                />
                            </Grid>
                        })
                    }
                </Grid>
                <Stack alignItems="center" padding={'20px'}>
                    <Pagination
                        count={Math.ceil(totalPages)}
                        page={currentPage}
                        onChange={(e,page) =>setCurrentPage(page)}
                        color='primary'
                    />
                </Stack>
            </Container>
        </DialogContent>
        <DialogActions>
            <Button color={'warning'} onClick={onClose}>Anuluj</Button>
        </DialogActions>
    </Dialog>


}


export default RecipeSelectorDialog;