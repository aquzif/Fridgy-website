import styled from "styled-components";
import {Icon} from "@iconify/react/offline";


const Item = styled(Icon)`
    width: 24px;
    height: 24px;
    padding: 4px;
    color: #A6A6A6;
    margin: 0px 8px;

    &:hover {
        cursor: pointer;
    }

    @media (max-width: 768px) {
        width: 40px;
        height: 40px;
        padding: 5px;
    }

`;

const MiniNavItem = ({
    icon,
    onClick
}) => {

    return <Item icon={icon} onClick={onClick} />

}

export default MiniNavItem;
