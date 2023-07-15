import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide} from "@mui/material";
import {forwardRef} from "react";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const ConfirmDialog = (
    {
        open = false,
        onClose = () => {},
        title = 'Potwierdzenie',
        subtitle= 'Czy na pewno?'
    }
) => {

    const handleCloseYes = () => onClose(true);
    const handleCloseNo = () => onClose(false);


    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseNo}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {subtitle}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color={'warning'} onClick={handleCloseNo}>Anuluj</Button>
                <Button onClick={handleCloseYes} >Potwierdź</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDialog;