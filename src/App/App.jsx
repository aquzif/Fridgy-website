import Router from "../Routes/Router";
import {Toaster} from "react-hot-toast";
import {Provider} from "react-redux";
import store from "@/Store/store";

import '@/App/GlobalStyles/index.scss';
import {useServiceWorker} from "@/Hooks/useServiceWorker";
import {useEffect} from "react";
import {ThemeProvider} from "@mui/material";
import theme from "@/Theme/theme";


const App = () => {

    const { waitingWorker, showReload, reloadPage } = useServiceWorker();

    useEffect(() => {
        if (showReload && waitingWorker) {
            // eslint-disable-next-line no-restricted-globals
            if(confirm("New version available! Click OK to refresh."))
                reloadPage();
        }
    }, [waitingWorker, showReload, reloadPage]);

    return (
        <>
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <Toaster />
                    <Router />
                </Provider>
            </ThemeProvider>

        </>
    );
}

export default App;
