import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grow,
    TextareaAutosize, TextField
} from "@mui/material";
import {forwardRef, useEffect, useState} from "react";

const Transition = forwardRef(function Transition(props, ref) {
    return <Grow /*direction="down"*/ ref={ref} {...props} />;
});
const LongTextEditDialog = (
    {
        title = 'Wprowadź tekst',
        startText = '',
        onSave = () => {},
        onReject = () => {},
        open = false
    }
) => {

    const [editValue,setEditValue] = useState(startText);


    useEffect(() => {
        setEditValue(startText);
    },[startText,open]);

    const saveHandler = () => {
        onSave(editValue);
    }

    console.log(startText);

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            maxWidth={'sm'}
            fullWidth={true}
            onClose={onReject}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <TextField
                    style={{width: '100%'}}
                    multiline={true}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button color={'warning'} onClick={onReject}>Anuluj</Button>
                <Button onClick={saveHandler} >Zapisz</Button>
            </DialogActions>
        </Dialog>
    )
}

export default LongTextEditDialog;