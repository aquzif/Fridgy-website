import {Container} from "@/Components/Common/Common";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {IconButton, LinearProgress, Tooltip, useMediaQuery} from "@mui/material";
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
import {InsertDriveFile} from "@mui/icons-material";
import ShoppingListSelectDialog from "@/Dialogs/ShoppingListSelectDialog";
import ShoppingListsAPI from "@/API/ShoppingListsAPI";

const DateContainer = styled.div`
  display: inline-block;
  width: 300px;
  background-color: white;
  margin: 10px;
  padding: 20px;
  border-radius: 10px;
  
  
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

const GetMealFromData = ({date,mealNo,meals,title, onClick, onEdit}) => {

    const navigate = useNavigate();

    for(let meal of meals){
        if(date.isSame(meal.date,'day') && meal.meal_order === mealNo){
            switch(meal.entry_type){
                case "from_recipe":
                    return <CalendarMealRecipe
                        meal={meal}
                        mealName={title}
                        onClick={() => navigate(`/przepisy/${meal.recipe.id}`)}
                        onEdit={onEdit} />
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
                        date={date}
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
        <ShoppingListSelectDialog
        open={selsectedListIdOpen}
        onClose={(res) => {
            console.log(res);
            if(res > 0 ) {
                toast.promise(
                    ShoppingListsAPI.generateFromCalendar(res, dateFrom.format('YYYY-MM-DD'), dateTo.format('YYYY-MM-DD')),
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
                <Tooltip title="Wrzuć do listy zakupów">
                    <IconButton onClick={() =>{
                        setSelectedListIdOpen(true);
                    }} disabled={isLoading} >
                        <InsertDriveFile />
                    </IconButton>
                </Tooltip>
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