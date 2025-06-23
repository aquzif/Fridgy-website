import {Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, FormControl, InputLabel, Select, MenuItem, IconButton} from "@mui/material";
import {useState} from "react";
import AsyncAutocompleter from "@/Components/AsyncAutocomplete/AsyncAutocomplete";
import ProductsAPI from "@/API/ProductsAPI";
import NumberInput from "@/Components/NumberInput/NumberInput";
import {Delete} from "@mui/icons-material";
import {useMediaQuery} from "@/Hooks/useMediaQuery";

const CalendarEntryFromIngredientsCEDialog = ({open, onClose, onSelect}) => {
    const [items,setItems] = useState([]);
    const isMobile = useMediaQuery('(max-width: 768px)');

    const onProductSearch = async (search) => {
        if(!search) return [];
        const result = await ProductsAPI.search(search);
        return result?.data || [];
    };

    const onProductSelect = (product) => {
        if(!product) return;

        if(items.some(it => it.product.id === product.id)) {
            return;
        }

        setItems([...items,{product, quantity:1, unitId: product?.units?.[0]?.id || 0}]);
    };

    const updateQuantity = (id,val) => setItems(items.map(it=>it.product.id===id?{...it,quantity:val}:it));
    const updateUnit = (id,val) => setItems(items.map(it=>it.product.id===id?{...it,unitId:val}:it));
    const removeItem = (id) => setItems(items.filter(it=>it.product.id!==id));

    const handleSave = () => {
        const data = items.map(it=>({
            product_id: it.product.id,
            unit_id: it.unitId,
            quantity: it.quantity
        }));
        console.log({ingredients: data});
        if(onSelect) onSelect({ingredients: data});
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Wybierz składniki</DialogTitle>
            <DialogContent>
                <AsyncAutocompleter label={'Wyszukaj produkt'} onSearch={onProductSearch} onSelect={onProductSelect} />
                <Box sx={{mt:2}}>
                    {items.map(item => (
                        <Box
                            key={item.product.id}
                            sx={{
                                display: 'flex',
                                flexDirection: isMobile ? 'column' : 'row',
                                alignItems: isMobile ? 'flex-start' : 'center',
                                mb: 1
                            }}
                        >
                            <Box sx={{ flex: 1 }}>{item.product.name}</Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: isMobile ? 'row' : 'row',
                                    alignItems: 'center',
                                    mt: isMobile ? 1 : 0
                                }}
                            >
                                <FormControl variant={'standard'} sx={{ mx: 1, minWidth: 120 }}>
                                    <InputLabel>Jednostka</InputLabel>
                                    <Select value={item.unitId} onChange={e => updateUnit(item.product.id, e.target.value)}>
                                        {item.product.units?.map(unit => (
                                            <MenuItem key={unit.id} value={unit.id}>{unit.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <NumberInput withoutButtons={true} value={item.quantity} min={0} max={1000} onChange={(e, val) => updateQuantity(item.product.id, val)} />
                                <IconButton onClick={() => removeItem(item.product.id)}><Delete /></IconButton>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button color={'warning'} onClick={onClose}>Anuluj</Button>
                <Button onClick={handleSave}>Zapisz</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CalendarEntryFromIngredientsCEDialog;
