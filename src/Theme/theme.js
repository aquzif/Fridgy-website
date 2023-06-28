import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            light: 'rgb(250, 204, 44)',
            main: 'rgb(250, 204, 44)',
            dark: 'rgb(234,190,30)',
            contrastText: '#fff',
        },
       /* secondary: {
            light: '#ff7961',
            main: '#f44336',
            dark: '#ba000d',
            contrastText: '#000',
        },*/
    },
});


export default theme;