import styled from 'styled-components';

import {Checkbox, CircularProgress, IconButton} from "@mui/material";
import {toggleEntry} from "@/Store/Reducers/ShoppingListReducer";
import store from "@/Store/store";
import {Delete, Edit, EditNote} from "@mui/icons-material";
import {useState} from "react";
import toast from "react-hot-toast";
import {useMediaQuery} from "@/Hooks/useMediaQuery";



const Container = styled.div`
  width: 100%;
  height: 50px;
  //border: 1px dashed black;
  //margin: 10px 0;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  
  &:hover {
    background-color: #f5f5f5;
    box-shadow: 0 0 5px 0 rgba(0,0,0,0.2);
  }
`;

const Title = styled.h3`
  font-weight: normal;
  ${props => props.checked && `
    text-decoration: line-through;
    color: gray;
  `}
`;

const Subtitle = styled.h4`
  font-weight: normal;
  color: gray;
  font-size: 12px;
  ${props => props.checked && 'text-decoration: line-through;'}
`;



const EntryRawProductContent = ({data, checked}) =>
    <>
        <Title checked={checked} >{data.product_name}</Title>
        <Subtitle checked={checked} >{data.amount} x {data.unit_name}</Subtitle>
    </>

const EntryRawContent = ({data, checked}) =>
    <>
        <Title style={{marginTop: '8px'}} checked={checked} >{data.product_name}</Title>
    </>


const ShoppingListEntry = (
    {
        data,
        shoppingList,

        onEdit = (entryID) => {},
        onDelete= (entryID) => {}
    }
) => {

    const {checked} = data;

    const [hover,setHover] = useState(false);
    const [isDeleting,setIsDeleting] = useState(false);

    const isMobile = useMediaQuery('(max-width: 768px)');

    const onToggleCheck = () => {
        store.dispatch(toggleEntry({
            shoppingListID: shoppingList.id,
            shoppingListEntryID: data.id,
            newState: !checked
        }))
    }


    const handleOnEdit = () => {
        onEdit(data.id);
    }

    const handleOnDelete = async () => {
        setIsDeleting(true);
        try{
            await onDelete(data.id)
        }catch (e){
            setIsDeleting(false);
            toast.error('Nie udało się usunąć wpisu');
        };
    }


    return <Container onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
    >
        <Checkbox checked={data.checked}
                  onChange={onToggleCheck}
                  sx={isMobile ? { '& .MuiSvgIcon-root': { fontSize: 28 } } : {}}
                  style={{margin: '4px'}} />
        <div style={{margin: '5px',width: 'calc(100% - 100px)'}}
             onClick={onToggleCheck}
        >
            {data.type === 'raw_product' && <EntryRawProductContent data={data} checked={checked} />}
            {data.type === 'raw' && <EntryRawContent data={data} checked={checked} />}


        </div>
        <div style={{padding: '5px'}} >
            { hover &&
                <div style={{display: 'flex',flexDirection: 'row'}} >
                    <IconButton onClick={handleOnEdit}  >
                        <Edit />
                    </IconButton>
                    <IconButton onClick={handleOnDelete}  >
                        {
                            isDeleting ?
                                <CircularProgress size={24} />
                                : <Delete color={'error'} />
                        }

                    </IconButton>
                </div>

            }
        </div>
    </Container>
}

export default ShoppingListEntry;

