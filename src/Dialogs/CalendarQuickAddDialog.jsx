import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grow, TextField } from "@mui/material";
import { forwardRef, useEffect, useState } from "react";

const Transition = forwardRef(function Transition(props, ref) {
    return <Grow ref={ref} {...props} />;
});

const CalendarQuickAddDialog = ({ open, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [calories, setCalories] = useState('');

    useEffect(() => {
        if(open){
            setName('');
            setCalories('');
        }
    }, [open]);

    const handleSave = () => {
        const data = {
            name: name,
            calories: parseFloat(calories)
        };
        console.log(data);
        if(onSave) onSave(data);
        if(onClose) onClose();
    };

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={onClose}
            fullWidth
            maxWidth={'xs'}
        >
            <DialogTitle>Szybkie dodawanie</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    variant={'standard'}
                    label={'Nazwa posiłku'}
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    style={{marginTop: 20}}
                    variant={'standard'}
                    label={'Kalorie'}
                    type={'number'}
                    fullWidth
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button color={'warning'} onClick={onClose}>Anuluj</Button>
                <Button onClick={handleSave}>Zapisz</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CalendarQuickAddDialog;
