import styled from "styled-components";

const ProgressContainer = styled.div`
    width: 100%;
    height: 8px;
    border-radius: 4px;
    background-color: #e0e0e0;
`;

const PrimaryProgressValue = styled.div`
  height: 8px;
  border-radius: 4px;
  position: relative;
`;
const SecondaryProgressValue = styled(PrimaryProgressValue)`
  top: -8px;
`;

const MainContainer = styled.div`
    padding: 10px 0px;
`;

const Label = styled.span`
    color: gray;
`;

const Values = styled.div`
    text-align: center;
`;

const minMaxVal = (val,min,max) =>{
    if(val < min) return min;
    if(val > max) return max;
    return val;
}

const DoubleProgress = ({ val, max, primaryColor = '#0080ea',secondaryColor = '#ea0000',label = '',...rest }) => {

    let percent = (val / max) * 100;
    let secPercent = percent-100;

    percent = minMaxVal(percent,0,100);
    secPercent = minMaxVal(secPercent,0,100);


    return <MainContainer>
        <Label>{label}</Label>
        <ProgressContainer {...rest}>
            <PrimaryProgressValue style={{width: `${percent}%`,backgroundColor: primaryColor}} />
            <SecondaryProgressValue style={{width: `${secPercent}%`,backgroundColor: secondaryColor}} />
        </ProgressContainer>
        <Values>
            <span style={val > max ? {color:'red'} : {}} >{val}</span> / {max}
        </Values>
    </MainContainer>
}

export default DoubleProgress;