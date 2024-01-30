import Quagga from 'quagga';
import {useEffect} from "react";
import styled from "styled-components"; // ES6

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

const BarcodeScanner = () => {

    useEffect(() => {
        Quagga.init({
            inputStream : {
                name : "Live",
                type : "LiveStream",
                target: document.querySelector('#scanner')    // Or '#yourElement' (optional)
            },
            decoder : {
                readers : ["code_128_reader", "ean_reader", "ean_8_reader", "code_39_reader", "code_39_vin_reader", "codabar_reader", "upc_reader", "upc_e_reader", "i2of5_reader"]
            }
        }, function(err) {
            if (err) {
                console.log(err);
                return
            }
            console.log("Initialization finished. Ready to start");
            Quagga.start();

            Quagga.onDetected((res) => {
                console.log(res);
                Quagga.stop();
            })



        });

    });

    return (
        <ScannerContainer>
            <h1>BarcodeScanner</h1>
            <>
                <ScannerContainer
                    id={'scanner'}
                ></ScannerContainer>
            </>
        </ScannerContainer>

    )
}

export default BarcodeScanner;