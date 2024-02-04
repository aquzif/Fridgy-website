import Quagga from 'quagga';
import {useEffect, useState} from "react";
import styled from "styled-components";
import OpenFoodFactsAPI from "@/API/OpenFoodFactsAPI";
import {useNavigate} from "react-router-dom";
import {Container} from "@/Components/Common/Common"; // ES6

const ScannerContainer = styled.div`
    & video {
      width: 100%;
    }
     canvas {
      position: absolute;
      z-index: 1000;
      right: 0;
      width: 100%;
       height: 100%;
    }
`;

const Title = styled.h2`
    padding: 5px;
    text-align: center;
`;

const BarcodeScannerView = () => {

    const navigate = useNavigate();

    useEffect(() => {
        init();
    });

    const init = async () => {
        let backCameraList = [];
        let devices = await navigator.mediaDevices.enumerateDevices();

        devices.forEach((device) => {
            if ( device.kind === 'videoinput' && device.label.match(/back/) != null )
                backCameraList.push({'deviceLabel': device.label, 'deviceId': device.deviceId});
        });

        Quagga.init({
            inputStream : {
                name : "Live",
                type : "LiveStream",
                constraints: {
                    width: 640,
                    height:  480,
                    deviceId: backCameraList[backCameraList.length - 1]['deviceId']
                },
                frequency: 10,
                singleChannel: true,
                target: document.querySelector('#scanner')    // Or '#yourElement' (optional)
            },
            decoder : {
                readers : ["ean_reader"]
            }
        }, function(err) {
            if (err) {
                console.log(err);
                return
            }
            Quagga.start();

            Quagga.onDetected((res) => {
                let {code} = res.codeResult;
                navigate(`/skaner/${code}`);
                Quagga.stop();


            })

        });
    }

    return (
        <Container>
            <Title>Zeskanuj kod kreskowy</Title>
            <ScannerContainer>
                <>
                    <ScannerContainer
                        id={'scanner'}
                    >
                    </ScannerContainer>
                </>
            </ScannerContainer>
        </Container>
    )


}

export default BarcodeScannerView;