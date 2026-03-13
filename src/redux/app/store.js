import {configureStore} from "@reduxjs/toolkit";
import uiReducer from "./../features/ui/ui-slice";
import authReducer from "./../features/authentication/authentication-slice";
import customersReducer from "./../features/customers/customers-slice";
import ordersReducer from "./../features/orders/orders-slice";
import productsReducer from "./../features/products/products-slice";
import couponsReducer from "./../features/coupons/coupons-slice";
import categoriesReducer from "./../features/categories/categories-slice";
import tagsReducer from "./../features/tags/tags-slice.js";
import attributesReducer from "./../features/attributes/attributes-slice.js";
import adminsReducer from "./../features/admins/admins-slice.js";
import usersReducer from "./../features/users/users-slice.js";
import invitationsReducer from "./../features/invitations/invitations-slice.js";
import orderNotesReducer from "./../features/order-notes/order-notes-slice.js";
import orderRefundsReducer from "./../features/order-refunds/order-refunds-slice.js";
import reviewsReducer from "./../features/reviews/reviews-slice.js";
import taxRatesReducer from "./../features/tax-rates/tax-rates-slice.js";
import taxClassesReducer from "./../features/tax-classes/tax-classes-slice.js";
import paymentGatewaysReducer from "./../features/payment-gateways/payment-gateways-slice.js";
import shippingClassesReducer from "./../features/shipping-classes/shipping-classes-slice.js";
import shippingMethodsReducer from "./../features/shipping-methods/shipping-methods-slice.js";
import webhooksReducer from "./../features/webhooks/webhooks-slice.js";

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
        tags: tagsReducer,
        attributes: attributesReducer,
        admins: adminsReducer,
        users: usersReducer,
        invitations: invitationsReducer,
        orderNotes: orderNotesReducer,
        orderRefunds: orderRefundsReducer,
        reviews: reviewsReducer,
        taxRates: taxRatesReducer,
        taxClasses: taxClassesReducer,
        paymentGateways: paymentGatewaysReducer,
        shippingClasses: shippingClassesReducer,
        shippingMethods: shippingMethodsReducer,
        webhooks: webhooksReducer,
    }
});

export default store;
