import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grow,
    useMediaQuery
} from "@mui/material";
import {forwardRef} from "react";
import styled from "styled-components";
import {Icon} from "@iconify/react/offline";
import receiptText from "@iconify/icons-mdi/receipt-text";
import burgerIcon from "@iconify/icons-mdi/burger";
import fruitWatermelon from "@iconify/icons-mdi/fruit-watermelon";

const Transition = forwardRef(function Transition(props, ref) {
    return <Grow /*direction="down"*/ ref={ref} {...props} />;
});

const SSContainer = styled.div`
    //padding: 20px;
    width: 140px;
    height: 140px;
    text-align: center;
    background-color: ${props => props.bgColor};
    color: white;
    font-weight: bold;
    border-radius: 20px;
    margin: 0px 10px;
    position: relative;
    transition: 0.2s;
  
  &:hover {
    cursor: pointer;
    background-color: ${props => props.hoverBg};
  }
  
  @media (max-width: 768px) {
    margin: 10px 0px;
  
  }
  
`;

const StyledIcon = styled(Icon)`
    width: 90px;
    height: 90px;
    margin-left: 25px;
    margin-top: 15px;
    display: block;
    color: white;
  
  position: absolute;
`;

const SSTitle = styled.span`
    position: absolute;
    bottom: 10px;
    left: 0px;
    width: 100%;
    text-align: center;
`;

const SourceSelector = (
    {
        title='Przepisy',
        bgColor = '#ff000070',
        hoverBg = 'rgba(135,0,0,0.44)',
        icon,
        onClick
    }
) => {

    return (
        <SSContainer onClick={onClick} bgColor={bgColor} hoverBg={hoverBg}>
            <StyledIcon icon={icon} />
            <SSTitle>{title}</SSTitle>

        </SSContainer>
    );

}

const SourceSelectDialog = (
    {
        open,
        onClose,
        onSelect,
    }
) => {

    const isMobile = useMediaQuery('(max-width:768px)');

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={onClose}
        >
            <DialogTitle>Wybierz źródło</DialogTitle>
            <DialogContent>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: isMobile ? 'column' : 'row',
                    flexWrap: 'wrap'

                }} >
                    <SourceSelector
                        onClick={() => onSelect('recipe')}
                        bgColor={'#51c2f6'}
                        hoverBg={'#3f9dc1'}
                        title="Przepisy"
                        icon={receiptText}
                    />
                    <SourceSelector
                        onClick={() => onSelect('fastfood')}
                        bgColor={'#ffde87'}
                        hoverBg={'#c7ac67'}
                        title="Fast Food"
                        icon={burgerIcon}
                    />
                    <SourceSelector
                        onClick={() => onSelect('source')}
                        bgColor={'#ff000070'}
                        hoverBg={'rgba(135,0,0,0.44)'}
                        title="Składniki"
                        icon={fruitWatermelon}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button color={'warning'} onClick={onClose}>Anuluj</Button>
            </DialogActions>
        </Dialog>
    )
}

export default SourceSelectDialog;