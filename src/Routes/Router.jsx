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
import CategoriesView from "@/Views/Dashboard/Settings/CategoriesView";
import ProductView from "@/Views/Dashboard/ProductView";
import RecipeEditView from "@/Views/Dashboard/RecipeEditView";
import SettingsView from "@/Views/Dashboard/SettingsView";
import RecipeView from "@/Views/Dashboard/RecipeView";
import CalendarView from "@/Views/Dashboard/CalendarView";
import ProfileView from "@/Views/Dashboard/ProfileView";
import UserSettingsView from "@/Views/Dashboard/UserSettingsView";
import BarcodeScannerView from "@/Views/Dashboard/BarcodeScannerView";
import BarcodeResultsView from "@/Views/Dashboard/BarcodeResultsView";
import FastFoodsView from "@/Views/Dashboard/FastFoodsView";
import FastFoodEditView from "@/Views/Dashboard/FastFoodEditView";
import FastFoodView from "@/Views/Dashboard/FastFoodView";

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
                                <Route path="/kalendarz" element={<CalendarView />} />
                                <Route path="/przepisy/:id" element={<RecipeView />} />
                                <Route path="/przepisy/:id/edycja" element={<RecipeEditView />} />
                                <Route path="/produkty" element={<ProductsView />} />
                                <Route path="/produkty/:id" element={<ProductView />} />
                                <Route path="/kategorie" element={<CategoriesView />} />
                                <Route path="/profil" element={<ProfileView />} />
                                <Route path="/ustawienia" element={<UserSettingsView />} />
                                <Route path="/skaner/:barcode" element={<BarcodeResultsView />} />
                                <Route path="/skaner" element={<BarcodeScannerView />} />
                                <Route path="/admin/ustawienia" element={<SettingsView />} />
                                <Route path="/fast-food/:id/edit" element={<FastFoodEditView />} />
                                <Route path="/fast-food/:id" element={<FastFoodView />} />
                                <Route path="/fast-food" element={<FastFoodsView />} />
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
