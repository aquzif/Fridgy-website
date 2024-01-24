import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import NotFoundView from "../Views/Error/NotFoundView";
import LoginView from "@/Views/LoginView";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import DashboardView from "@/Views/DashboardView";
import AuthAPI from "@/API/AuthAPI";
import ShoppingListView from "@/Views/Dashboard/ShoppingListView";
import RecipesView from "@/Views/Dashboard/RecipesView";
import ProductsView from "@/Views/Dashboard/ProductsView";
import store from "@/Store/store";
import {expire} from "@/Store/Reducers/AuthReducer";
import CategoriesView from "@/Views/Dashboard/CategoriesView";

const Router = () => {

    const authReducer = useSelector(state => state.authReducer);
    const [loggedIn,setLoggedIn] = useState(authReducer.token !== null && authReducer.token !== undefined && authReducer.token !== '');

    useEffect(() => {
        let probablyLogged = authReducer.token !== null && authReducer.token !== undefined && authReducer.token !== '';
        setLoggedIn(probablyLogged);

        if(probablyLogged)
            AuthAPI.getUser()
                .catch(() => {
                    store.dispatch(expire());
                });

    }, [authReducer.token]);



    return (
        <BrowserRouter>
            <Routes>
                {
                    loggedIn ? (
                        <>
                            <Route path="/" element={<DashboardView />} >
                                <Route path="/" element={<Navigate to={'/lista-zakupow'} />} />
                                <Route path="/lista-zakupow" element={<ShoppingListView />} />
                                <Route path="/przepisy" element={<RecipesView />} />
                                <Route path="/produkty" element={<ProductsView />} />
                                <Route path="/kategorie" element={<CategoriesView />} />
                                <Route path="*" element={<NotFoundView />} />
                            </Route>

                        </>
                    ):(
                        <Route path="*" element={<LoginView />} />
                    )
                }
            </Routes>
        </BrowserRouter>
    )
}

export default Router;
