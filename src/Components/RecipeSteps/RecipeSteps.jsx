import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';


export default function VerticalLinearStepper({steps}) {
    return (
        <Box sx={{ maxWidth: 400 }}>
            <Stepper  activeStep={-1}  orientation="vertical">
                {steps.map((step, index) => (
                    <Step key={step}>
                        <StepLabel
                        >
                            {step}
                        </StepLabel>

                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}