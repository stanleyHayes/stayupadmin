import {configureStore} from "@reduxjs/toolkit";
import uiReducer from "./../features/ui/ui-slice";
import authReducer from "./../features/authentication/authentication-slice";
import customersReducer from "./../features/customers/customers-slice";
import ordersReducer from "./../features/orders/orders-slice";
import productsReducer from "./../features/products/products-slice";
import couponsReducer from "./../features/coupons/coupons-slice";
import categoriesReducer from "./../features/categories/categories-slice";

const store = configureStore({
    devTools: true,
    reducer: {
        ui: uiReducer,
        auth: authReducer,
        customers: customersReducer,
        orders: ordersReducer,
        products: productsReducer,
        coupons: couponsReducer,
        categories: categoriesReducer,
    }
});

export default store;