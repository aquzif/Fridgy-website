import styled from "styled-components";

const Pill = styled.div`

  border: 2px solid ${props => props.color};
  color: ${props => props.color};
  text-align: center;
  border-radius: 15px;
  padding: 1px 5px;
  font-weight: bold;

`;

const ColorPill = ({color = '#ffffff'}) => {

    return <Pill color={color} >{quality}</Pill>

}

export default ColorPill;
