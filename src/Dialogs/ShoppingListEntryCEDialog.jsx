import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl, FormHelperText,
    Grid, InputLabel, MenuItem, Select,
    Slide,
    TextField
} from "@mui/material";
import {forwardRef, useEffect, useRef} from "react";
import {useFormik} from "formik";
import ShoppingListEntrySchema from "@/Schemas/ShoppingListEntrySchema";
import {useSelector} from "react-redux";
import toast from "react-hot-toast";
import store from "@/Store/store";
import ShoppingListEntriesAPI from "@/API/ShoppingListEntriesAPI";
import {requestGlobalUnits} from "@/Store/Reducers/GlobalUnitReducer";
import {requestShoppingLists} from "@/Store/Reducers/ShoppingListReducer";


const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const ShoppingListEntryCEDialog = (
    {
        open = false,
        onClose = (res) => {},
        editMode = false,
        editEntryID = null,
    }
) => {

    const {
        shoppingLists,
        selectedShoppingListID
    } = useSelector(state => state.shoppingListReducer);
    const selectedShoppingList = shoppingLists.find((shoppingList) => shoppingList.id === selectedShoppingListID);
    const {
        globalUnits
    } = useSelector(state => state.globalUnitReducer);

    const defaultUnit = globalUnits.find((unit) => unit.default);

    const mainInput = useRef(null);
    const formik = useFormik({
        initialValues: {
            type: 'raw_product',
            product_name: '',
            unit_id: '',
            amount: 0,
        },
        validationSchema: ShoppingListEntrySchema,
        validateOnChange: true,
        onSubmit: async (values) => {
            if(!selectedShoppingList){
                toast.error('Nie wybrano listy zakupów');
                return;
            }
            if(editMode){
                await toast.promise(ShoppingListEntriesAPI.update(selectedShoppingListID, editEntryID, values),{
                    loading: 'Aktualizowanie wpisu...',
                    success: 'Wpis został zaktualizowany',
                    error: 'Nie udało się zaktualizować wpisu'
                });
            }else{
                await toast.promise(ShoppingListEntriesAPI.create(selectedShoppingListID, values),{
                    loading: 'Tworzenie wpisu',
                    success:  'Wpis został utworzony',
                    error: 'Nie udało się utworzyć wpisu'
                });
            }
            store.dispatch(requestShoppingLists());
            handleClose();
        }
    });

    useEffect(() => {
        store.dispatch(requestGlobalUnits());
    }, []);


    const handleClose = () =>{
        onClose();
    }

    useEffect(() => {
        if(open){
            mainInput?.current?.focus();
            formik.resetForm();
            formik.setFieldValue('unit_id', defaultUnit?.id || '');

            if(editMode){
                const entryForEdit = selectedShoppingList?.entries.find((entry) => entry.id === editEntryID);

                if(!entryForEdit){
                    toast.error('Nie znaleziono wpisu');
                    return;
                }

                formik.setValues({
                    type: entryForEdit?.type,
                    product_name: entryForEdit?.product_name,
                    unit_id: entryForEdit?.unit_id,
                    amount: entryForEdit?.amount,
                });
            }
        }
    }, [open,editMode]);


    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            fullWidth
            maxWidth={'sm'}
            onClose={handleClose}
        >
            <DialogTitle>
                {editMode ? "Zmodyfikuj wpis" : "Utwórz wpis"}
            </DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4} >
                            <FormControl fullWidth variant={'standard'}
                                         error={formik.touched.type && Boolean(formik.errors.type)}
                            >
                                <InputLabel>Typ Wpisu</InputLabel>
                                <Select
                                    disabled={editMode}
                                    value={formik.values.type}
                                    variant={'standard'}
                                    name={'type'}
                                    label="Jednostka"
                                    onChange={formik.handleChange}
                                    error={formik.touched.type && Boolean(formik.errors.type)}
                                >
                                    <MenuItem key={'raw'} value={'raw'}>Podstawowy</MenuItem>
                                    <MenuItem key={'raw_product'} value={'raw_product'}>Produkt</MenuItem>
                                </Select>
                                <FormHelperText>{formik.touched.type && formik.errors.type}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={8} />
                        <Grid item xs={12} >
                            <TextField
                                inputRef={mainInput}
                                variant={'standard'}
                                name={'product_name'}
                                label={'Nazwa wpisu'}
                                value={formik.values.product_name}
                                onChange={formik.handleChange}
                                fullWidth
                                error={formik.touched.product_name && Boolean(formik.errors.product_name)}
                                helperText={formik.touched.product_name && formik.errors.product_name}
                            />
                        </Grid>
                        {
                            formik.values.type === 'raw_product' && (
                                <>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth variant={'standard'}
                                                     error={formik.touched.unit_id && Boolean(formik.errors.unit_id)}
                                        >
                                            <InputLabel>Jednostka</InputLabel>
                                            <Select
                                                value={formik.values.unit_id}
                                                variant={'standard'}
                                                name={'unit_id'}
                                                label="Jednostka"
                                                onChange={formik.handleChange}
                                                error={formik.touched.unit_id && Boolean(formik.errors.unit_id)}
                                            >
                                                {globalUnits.map((unit) => <MenuItem key={unit.id} value={unit.id}>{unit.name}</MenuItem>)}
                                            </Select>
                                            <FormHelperText>{formik.touched.unit_id && formik.errors.unit_id}</FormHelperText>
                                        </FormControl>

                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            variant={'standard'}
                                            name={'amount'}
                                            type="number"
                                            label={'Ilość'}
                                            value={formik.values.amount}
                                            onChange={formik.handleChange}
                                            fullWidth
                                            error={formik.touched.amount && Boolean(formik.errors.amount)}
                                            helperText={formik.touched.amount && formik.errors.amount}
                                        />
                                    </Grid>
                                </>
                            )
                        }
                    </Grid>




                </DialogContent>
                <DialogActions>
                    <Button color={'warning'} onClick={handleClose}>Anuluj</Button>
                    <Button type={'submit'} onClick={formik.handleSubmit} >{editMode ? "Zaktualizuj" : 'Stwórz'}</Button>
                </DialogActions>
            </form>
        </Dialog>
    )

}

export default ShoppingListEntryCEDialog;
