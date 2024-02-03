import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide,
    TextField
} from "@mui/material";
import {forwardRef, useState} from "react";
import toast from "react-hot-toast";
import FastFoodStoresAPI from "@/API/FastFoodStores/FastFoodStoresAPI";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const FastFoodCEDialog = (
    {
        open,
        onClose,
    }
) => {

    const [name, setName] = useState('');

    const handleClose = () => onClose();

    const handleConfirm = () => {

        if(name === '')
            return toast.error('Nazwa nie może być pusta!');

        toast.promise(
            FastFoodStoresAPI.create({name}),
            {
                loading: 'Dodawanie restauracji...',
                success: () => {
                    onClose();
                    return 'Pomyślnie dodano restaurację'
                },
                error: 'Nie udało się dodać restauracji'
            }
        )


    }

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            maxWidth={'sm'}
            fullWidth
        >
            <DialogTitle>Nowa restauracja</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Nazwa restauracji"
                    type="text"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button color={'warning'} onClick={handleClose}>Anuluj</Button>
                <Button onClick={handleConfirm} >Potwierdź</Button>
            </DialogActions>
        </Dialog>
    )
}

export default FastFoodCEDialog;