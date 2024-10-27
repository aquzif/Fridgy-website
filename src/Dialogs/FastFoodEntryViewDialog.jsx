import {useEffect, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography} from "@mui/material";
import FastFoodStoreMealsAPI from "@/API/FastFoodStores/FastFoodStoreMealsAPI";
import CalendarEntryFastFoodAPI from "@/API/CalendarEntryFastFoodAPI";
import CalendarEntriesAPI from "@/API/CalendarEntriesAPI";


const FastFoodEntryViewDialog = (
    {
        open,
        onClose,
        id
    }
) => {

    const [isLoading, setIsLoading] = useState(false);
    const [fastFoodEntry, setFastFoodEntry] = useState(null);

    const load = async () => {
        setIsLoading(true);

        const {data} = await CalendarEntriesAPI.get(id);

        setFastFoodEntry(data.data);

        setIsLoading(false);
    }

    useEffect(() => {
        if(id && open)
            load();
    }, [open,id]);

    console.log(fastFoodEntry);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                Szczegóły
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>

                    <Grid item xs={12}>
                        <Typography variant="h6">
                            Restauracja: {fastFoodEntry?.fast_food_store?.name}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">
                            Podsumowanie: {fastFoodEntry?.calendar_entry_fast_food_meals.reduce((acc,entry) => acc + entry.calories_per_ration * entry.quantity,0)} kcal
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">
                            Pozycje:
                        </Typography>
                        <ul style={{
                            marginLeft: 20
                        }} >
                            {
                                fastFoodEntry?.calendar_entry_fast_food_meals?.map((entry,index) => (

                                    <li key={index} >
                                        {entry.fast_food_meal.name} x{entry.quantity} ({entry.calories_per_ration * entry.quantity} kcal)
                                    </li>

                                ))
                            }
                        </ul>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    color="primary"
                >
                    Zamknij
                </Button>
            </DialogActions>
        </Dialog>
    )


}

export default FastFoodEntryViewDialog;