import {Container} from "@/Components/Common/Common";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {IconButton, LinearProgress, Select, Tooltip, useMediaQuery} from "@mui/material";
import Box from "@mui/material/Box";
import CalendarEntriesAPI from "@/API/CalendarEntriesAPI";
import toast from "react-hot-toast";
import styled from "styled-components";
import DatesUtils from "@/Utils/DatesUtils";
import DoubleProgress from "@/Components/DoubleProgress/DoubleProgress";
import {useSelector} from "react-redux";
import {refreshUser} from "@/Store/Reducers/AuthReducer";
import store from "@/Store/store";
import CalendarMealPlaceholder from "@/Components/CalendarMealEntry/CalendarMealPlaceholder";
import CalendarMealRecipe from "@/Components/CalendarMealEntry/CalendarMealRecipe";
import RecipeSelectorDialog from "@/Dialogs/RecipeSelectorDialog";
import SourceSelectDialog from "@/Dialogs/SourceSelectDialog";
import {Swiper, SwiperSlide} from "swiper/react";

import "swiper/css";
import {useNavigate} from "react-router-dom";
import {CheckCircle, Description, Edit, InsertDriveFile, Save} from "@mui/icons-material";
import ShoppingListSelectDialog from "@/Dialogs/ShoppingListSelectDialog";
import ShoppingListsAPI from "@/API/ShoppingListsAPI";
import ConfirmDialog from "@/Dialogs/ConfirmDialog";

const DateContainer = styled.div`
  
  width: 300px;
  background-color: white;
  margin: 10px;
  padding: 20px;
  border-radius: 10px;
  position: relative;
  flex: 0 0 auto;
  
  
    @media (max-width: 768px) {
      width: calc(100% - 60px);
    }
`;

const Title = styled.p`
    textalign: center;
    font-weight: bold;
    font-size: 20px;
  
`;

const DatesContainer = styled.div`
  display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
  overflow-y: hidden;
  white-space: nowrap;
  width: calc(100% - 40px);
  background-color: #fdf7ee;
  border-radius: 10px;
  padding: 20px;
  
    @media (max-width: 768px) {
      width: 100%;
      padding: 0px;
    }

`;

const CustDatePicker = (props) => {
    return <DatePicker
        sx={{margin: '0px 10px',maxWidth: '160px'}}
        {...props}
    />
}

const GetMealFromData = ({date,mealNo,meals,title, onClick, onEdit,selectMode, onCheck, onDelete}) => {

    const navigate = useNavigate();

    for(let meal of meals){
        if(date.isSame(meal.date,'day') && meal.meal_order === mealNo){
            switch(meal.entry_type){
                case "from_recipe":
                    return <CalendarMealRecipe
                        meal={meal}
                        onDelete={onDelete}
                        selectMode={selectMode}
                        mealName={title}
                        onClick={() => navigate(`/przepisy/${meal.recipe.id}`)}
                        onEdit={onEdit}
                        onCheck={onCheck}
                    />
                default:
                    return 'ERROR';
            }

        }
    }
    return <CalendarMealPlaceholder mealName={title} onClick={onEdit} onEdit={onEdit} />
}

const mealTitles = (amount) => {
    switch(amount){
        case 1:
            return ['Posiłek'];
        case 2:
            return ['Obiad','Kolacja'];
        case 3:
            return ['Śniadanie','Obiad','Kolacja'];
        case 4:
            return ['Śniadanie','Drugie śniadanie','Obiad','Kolacja'];
        case 5:
            return ['Śniadanie','Drugie śniadanie','Obiad','Podwieczorek','Kolacja'];
    }
}

const getCaloriesPerDate = (date,entries) => {
    let calories = 0;
    for(let entry of entries){
        if(date.isSame(entry.date,'day')){
            calories += Math.round(entry.calories);
        }
    }
    return calories;
}

const CalendarView = () => {

    const [dateFrom, setDateFrom] = useState(dayjs());
    const [dateTo, setDateTo] = useState(dayjs().add(7,'day'));
    const [isLoading,setIsLoading] = useState(false);
    const [entries,setEntries] = useState([]);
    const isMobile = useMediaQuery('(max-width: 768px)');

    const [openSourceSelectDialog,setOpenSourceSelectDialog] = useState(false);
    const [selectedSource,setSelectedSource] = useState(null);
    const [selectedEditData,setSelectedEditData] = useState(null);

    const [selsectedListIdOpen,setSelectedListIdOpen] = useState(false);
    const [selectMode,setSelectMode] = useState(false);

    const [deleteConfirmId,setDeleteConfirmId] = useState(0);


    const handleSelectEntry = (id) => {
        let newEntries = entries;

        for(let entry of newEntries){
            if(entry.id === id){
                entry.selected = !entry.selected;
            }
        }

        setEntries(newEntries);
    }


    const user = useSelector(state => state.authReducer.user);

    const load = async () => {
        setIsLoading(true);
        store.dispatch(refreshUser());
        let res = await CalendarEntriesAPI.getAll(dateFrom.format('YYYY-MM-DD'), dateTo.format('YYYY-MM-DD'))

        const {data,status} = res;

        if(status >300){
            toast.error('Wystąpił błąd podczas pobierania danych');
            return;
        }

        setEntries(data.data);

        setIsLoading(false);
    }

    useEffect(() => {
        load();
    }, [dateFrom,dateTo]);

    const handleCloseSourceInputDialog = () => {
        setSelectedSource(null);
        setSelectedEditData(null);
    }

    const selectRecipe = async (recipe) => {
        console.log('RECIPE',recipe);
        await toast.promise(CalendarEntriesAPI.create({
            "type" :"from_recipe",
            "date": selectedEditData.date,
            "meal_order": selectedEditData.mealNo,
            "recipe_id": recipe.id
        }),{
            loading: 'Dodawanie przepisu...',
            success: 'Pomyślnie dodano przepis',
            error: 'Nie udało się dodać przepisu'
        });

        handleCloseSourceInputDialog();
        load();
    }

    const columns = DatesUtils.getDatesBetween(dateFrom,dateTo).map((date) => {
        return <DateContainer
            style={date.isSame(dayjs(),'day') && {
                backgroundColor: '#f3fff3'
            } || {}}
        >
            <h4 style={{textAlign:'center',paddingBottom:'5px'}} >{DatesUtils.getNameOfWeekDay(date)}</h4>
            <p style={{textAlign: 'center'}} >{date.format('DD-MM-YYYY')}</p>
            <DoubleProgress
                label={'Kalorie:'}
                val={getCaloriesPerDate(date,entries)}
                max={Math.round(user?.calories_per_day || 0)}
            />
            {
                mealTitles(user?.meals_per_day|| 1).map((title,index) =>
                    <GetMealFromData
                        selectMode={selectMode}
                        onDelete={(id) => setDeleteConfirmId(id)}
                        date={date}
                        onCheck={(id) => handleSelectEntry(id)}
                        mealNo={index}
                        meals={entries}
                        title={title}
                        onClick={() => {

                        }}
                        onEdit={ () => {
                            setOpenSourceSelectDialog(true);
                            setSelectedEditData({
                                date: date.format('YYYY-MM-DD'),
                                mealNo: index
                            })
                        }}
                    />

                )
            }
        </DateContainer>
    });

    return <Container>
        <ConfirmDialog
            title="Usuwanie wpisu"
            subtitle={`Czy na pewno chcesz usunąć wpis "${entries.find((entry) => entry.id === deleteConfirmId)?.recipe?.name}"?`}
            open={deleteConfirmId > 0}
            onClose={(res) => {
                if(res){
                    toast.promise(
                        CalendarEntriesAPI.delete(deleteConfirmId),
                        {
                            loading: 'Usuwanie wpisu...',
                            success: 'Pomyślnie usunięto wpis',
                            error: 'Nie udało się usunąć wpisu'
                        }
                    ).then(load)
                }
                setDeleteConfirmId(0);
            }}
        />
        <ShoppingListSelectDialog
        open={selsectedListIdOpen}
        onClose={(res) => {
            console.log(res);
            if(res > 0 ) {

                let entriesIds;
                console.log('ENT',entries);
                if(selectMode)
                    entriesIds = entries.filter((entry) => entry.selected).map((entry) => entry.id);
                else
                    entriesIds = entries.map((entry) => entry.id);

                toast.promise(
                    ShoppingListsAPI.generateFromCalendar(res, dateFrom.format('YYYY-MM-DD'), dateTo.format('YYYY-MM-DD'),entriesIds),
                    {
                        loading: 'Generowanie listy zakupów...',
                        success: 'Pomyślnie wygenerowano listę zakupów',
                        error: 'Nie udało się wygenerować listy zakupów'
                    }
                )
            }
            setSelectedListIdOpen(false);
        }}
        />
        <SourceSelectDialog
            open={openSourceSelectDialog}
            onClose={() => setOpenSourceSelectDialog(false)}
            onSelect={(source) => {
                setOpenSourceSelectDialog(false);
                setSelectedSource(source)
            }}
        />
        <RecipeSelectorDialog
            open={selectedSource === 'recipe'}
            onClose={handleCloseSourceInputDialog}
            onSelect={selectRecipe}
        />
        <div style={!isMobile && {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
        } || {}} >
            <div style={
                isMobile && {
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                } || {}

            } >
                <h2>Kalendarz</h2>
                <div style={{display: 'flex',flexDirection: 'row'}} >
                    <Tooltip title="Przełącz tryb zaznaczania">
                        <IconButton onClick={() =>{
                            setSelectMode(!selectMode);
                        }} disabled={isLoading} >
                            {
                                selectMode ? <Save /> : <CheckCircle />
                            }
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={
                        selectMode ? 'Generuj listę zakupów z wybranych posiłków' : 'Generuj listę zakupów z wybranych dni'
                    }>
                        <IconButton onClick={() =>{
                            setSelectedListIdOpen(true);
                        }} disabled={isLoading} >
                            {
                                selectMode ? <InsertDriveFile /> : <Description />
                            }
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            <div style={isMobile && {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                margin: '20px 0px'
            } || {}}>
                <CustDatePicker
                    disabled={isLoading}
                    value={dateFrom}
                    onChange={(date) => setDateFrom(date)}
                    label="Data od"
                />
                <CustDatePicker
                    disabled={isLoading}
                    value={dateTo}
                    onChange={(date) => setDateTo(date)}
                    label={"Data do"}
                />
            </div>
        </div>
        <Box sx={{ width: '100%',margin: '10px 0px' }}>
            {isLoading && <LinearProgress />}
        </Box>

        <DatesContainer>
            {isMobile ? <Swiper>
                {
                    columns.map((column) =>
                        <SwiperSlide>{column}</SwiperSlide>
                    )
                }
            </Swiper> : columns}
        </DatesContainer>


    </Container>
}

export default CalendarView;