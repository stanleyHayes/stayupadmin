import {useSelector} from "react-redux";
import {selectUI} from "./redux/features/ui/ui-slice";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {THEMES} from "./utils/themes";
import {Route, Routes} from "react-router";
import {lazy, Suspense} from "react";
import Splash from "./components/shared/splash.jsx";

const MorePage = lazy(() => import("./pages/others/more-page.jsx"));
const NotFoundPage = lazy(() => import("./pages/others/not-found-page.jsx"));
const OverviewPage = lazy(() => import("./pages/overview/overview-page.jsx"));
const AboutUsPage = lazy(() => import("./pages/others/about-us-page.jsx"));
const ContactPage = lazy(() => import("./pages/others/contact-page.jsx"));
const FAQPage = lazy(() => import("./pages/others/faq-page.jsx"));
const HelpPage = lazy(() => import("./pages/others/help-page.jsx"));
const PrivacyPage = lazy(() => import("./pages/others/privacy-page.jsx"));
const SettingsPage = lazy(() => import("./pages/others/settings-page.jsx"));
const SupportPage = lazy(() => import("./pages/others/support-page.jsx"));
const TermsPage = lazy(() => import("./pages/others/terms-page.jsx"));

const CreateUserPage = lazy(() => import("./pages/users/create-user-page.jsx"));
const UpdateUserPage = lazy(() => import("./pages/users/update-user-page.jsx"));
const UserDetailPage = lazy(() => import("./pages/users/user-detail-page.jsx"));
const UsersPage = lazy(() => import("./pages/users/users-page.jsx"));

const AccountPage = lazy(() => import("./pages/account/account-page.jsx"));
const ChangePasswordPage = lazy(() => import("./pages/account/change-password-page.jsx"));
const ProfilePage = lazy(() => import("./pages/account/profile-page.jsx"));
const UpdateProfilePage = lazy(() => import("./pages/account/update-profile-page.jsx"));

const AdminDetailPage = lazy(() => import("./pages/admins/admin-detail-page.jsx"));
const CreateAdminPage = lazy(() => import("./pages/admins/create-admin-page.jsx"));
const UpdateAdminPage = lazy(() => import("./pages/admins/update-admin-page.jsx"));

const ForgotPasswordPage = lazy(() => import("./pages/authentication/forgot-password-page.jsx"));
const LoginPage = lazy(() => import("./pages/authentication/login-page.jsx"));
const RegisterPage = lazy(() => import("./pages/authentication/register-page.jsx"));
const ResetPasswordPage = lazy(() => import("./pages/authentication/reset-password-page.jsx"));
const VerifyAccountPage = lazy(() => import("./pages/authentication/verify-account-page.jsx"));
const VerifyOTPPage = lazy(() => import("./pages/authentication/verify-otp-page.jsx"));

const CampaignDetailPage = lazy(() => import("./pages/sales/campaign-detail-page.jsx"));
const CampaignsPage = lazy(() => import("./pages/sales/campaigns-page.jsx"));
const MyCampaignsPage = lazy(() => import("./pages/sales/my-campaigns-page.jsx"));

const CreateProductPage = lazy(() => import("./pages/products/create-product-page.jsx"));
const ProductDetailPage = lazy(() => import("./pages/products/product-detail-page.jsx"));
const ProductsPage = lazy(() => import("./pages/products/products-page.jsx"));
const UpdateProductPage = lazy(() => import("./pages/products/update-product-page.jsx"));

const UpdateCouponPage = lazy(() => import("./pages/coupons/update-coupon-page.jsx"));
const CreateCouponPage = lazy(() => import("./pages/coupons/create-coupon-page.jsx"));
const CouponsPage = lazy(() => import("./pages/coupons/coupons-page.jsx"));
const CouponDetailPage = lazy(() => import("./pages/coupons/coupon-detail-page.jsx"));

const UpdateCustomerPage = lazy(() => import("./pages/customers/update-customer-page.jsx"));
const CreateCustomerPage = lazy(() => import("./pages/customers/create-customer-page.jsx"));
const CustomersPage = lazy(() => import("./pages/customers/customers-page.jsx"));
const CustomerDetailPage = lazy(() => import("./pages/customers/customer-detail-page.jsx"));

const UpdateOrderPage = lazy(() => import("./pages/orders/update-order-page.jsx"));
const CreateOrderPage = lazy(() => import("./pages/orders/create-order-page.jsx"));
const OrdersPage = lazy(() => import("./pages/orders/orders-page.jsx"));
const OrderDetailPage = lazy(() => import("./pages/orders/order-detail-page.jsx"));

const UpdateInvitationPage = lazy(() => import("./pages/invitations/update-invitation-page.jsx"));
const CreateInvitationPage = lazy(() => import("./pages/invitations/create-invitation-page.jsx"));
const InvitationsPage = lazy(() => import("./pages/invitations/invitations-page.jsx"));
const InvitationDetailPage = lazy(() => import("./pages/invitations/invitation-detail-page.jsx"));

const UpdateCategoryPage = lazy(() => import("./pages/categories/update-category-page.jsx"));
const CreateCategoryPage = lazy(() => import("./pages/categories/create-category-page.jsx"));
const CategoriesPage = lazy(() => import("./pages/categories/categories-page.jsx"));
const CategoryDetailPage = lazy(() => import("./pages/categories/category-detail-page.jsx"));


function App() {
    const {theme} = useSelector(selectUI);
    return (
        <ThemeProvider theme={theme === 'dark' ? THEMES.darkTheme : THEMES.lightTheme}>
            <CssBaseline enableColorScheme={true}/>
            <Routes>
                <Route path="/" element={<Suspense fallback={<Splash/>}><OverviewPage/></Suspense>}/>
                <Route path="/overview" element={<Suspense fallback={<Splash/>}><OverviewPage/></Suspense>}/>
                <Route path="/categories" element={<Suspense fallback={<Splash/>}><CategoriesPage/></Suspense>}/>
                <Route path="/categores/:categoryID"
                       element={<Suspense fallback={<Splash/>}><CategoryDetailPage/></Suspense>}/>
                <Route path="/categores/:categoryID/update"
                       element={<Suspense fallback={<Splash/>}><UpdateCategoryPage/></Suspense>}/>
                <Route path="/category/new" element={<Suspense fallback={<Splash/>}><CreateCategoryPage/></Suspense>}/>
                <Route path="/coupons" element={<Suspense fallback={<Splash/>}><CouponsPage/></Suspense>}/>
                <Route path="/coupons/:couponID"
                       element={<Suspense fallback={<Splash/>}><CouponDetailPage/></Suspense>}/>
                <Route path="/coupons/:couponID/update"
                       element={<Suspense fallback={<Splash/>}><UpdateCouponPage/></Suspense>}/>
                <Route path="/coupon/new" element={<Suspense fallback={<Splash/>}><CreateCouponPage/></Suspense>}/>
                <Route path="/users" element={<Suspense fallback={<Splash/>}><UsersPage/></Suspense>}/>
                <Route path="/users/:userID" element={<Suspense fallback={<Splash/>}><UserDetailPage/></Suspense>}/>
                <Route path="/users/:userID/update"
                       element={<Suspense fallback={<Splash/>}><UpdateUserPage/></Suspense>}/>
                <Route path="/user/new" element={<Suspense fallback={<Splash/>}><CreateUserPage/></Suspense>}/>
                <Route path="/terms" element={<Suspense fallback={<Splash/>}><TermsPage/></Suspense>}/>
                <Route path="/support" element={<Suspense fallback={<Splash/>}><SupportPage/></Suspense>}/>
                <Route path="/settings" element={<Suspense fallback={<Splash/>}><SettingsPage/></Suspense>}/>
                <Route path="/privacy" element={<Suspense fallback={<Splash/>}><PrivacyPage/></Suspense>}/>
                <Route path="/help" element={<Suspense fallback={<Splash/>}><HelpPage/></Suspense>}/>
                <Route path="/faq" element={<Suspense fallback={<Splash/>}><FAQPage/></Suspense>}/>
                <Route path="/contact" element={<Suspense fallback={<Splash/>}><ContactPage/></Suspense>}/>
                <Route path="/us" element={<Suspense fallback={<Splash/>}><AboutUsPage/></Suspense>}/>
                <Route path="/invitations" element={<Suspense fallback={<Splash/>}><InvitationsPage/></Suspense>}/>
                <Route path="/invitations/:invitationID"
                       element={<Suspense fallback={<Splash/>}><InvitationDetailPage/></Suspense>}/>
                <Route path="/invitations/:invitationID/update"
                       element={<Suspense fallback={<Splash/>}><UpdateInvitationPage/></Suspense>}/>
                <Route path="/invitation/new"
                       element={<Suspense fallback={<Splash/>}><CreateInvitationPage/></Suspense>}/>
                <Route path="/account" element={<Suspense fallback={<Splash/>}><AccountPage/></Suspense>}/>
                <Route path="/change-password"
                       element={<Suspense fallback={<Splash/>}><ChangePasswordPage/></Suspense>}/>
                <Route path="/profile" element={<Suspense fallback={<Splash/>}><ProfilePage/></Suspense>}/>
                <Route path="/profile/update" element={<Suspense fallback={<Splash/>}><UpdateProfilePage/></Suspense>}/>
                <Route path="/admins/:adminID" element={<Suspense fallback={<Splash/>}><AdminDetailPage/></Suspense>}/>
                <Route path="/admin/new" element={<Suspense fallback={<Splash/>}><CreateAdminPage/></Suspense>}/>
                <Route path="/admins/:adminID/update"
                       element={<Suspense fallback={<Splash/>}><UpdateAdminPage/></Suspense>}/>
                <Route path="/auth/forgot-password"
                       element={<Suspense fallback={<Splash/>}><ForgotPasswordPage/></Suspense>}/>
                <Route path="/auth/login" element={<Suspense fallback={<Splash/>}><LoginPage/></Suspense>}/>
                <Route path="/auth/register" element={<Suspense fallback={<Splash/>}><RegisterPage/></Suspense>}/>
                <Route path="/auth/reset-password"
                       element={<Suspense fallback={<Splash/>}><ResetPasswordPage/></Suspense>}/>
                <Route path="/auth/verify/:token"
                       element={<Suspense fallback={<Splash/>}><VerifyAccountPage/></Suspense>}/>
                <Route path="/auth/otp" element={<Suspense fallback={<Splash/>}><VerifyOTPPage/></Suspense>}/>
                <Route path="/campaigns/:campaignID"
                       element={<Suspense fallback={<Splash/>}><CampaignDetailPage/></Suspense>}/>
                <Route path="/campaigns" element={<Suspense fallback={<Splash/>}><CampaignsPage/></Suspense>}/>
                <Route path="/campaign/me" element={<Suspense fallback={<Splash/>}><MyCampaignsPage/></Suspense>}/>
                <Route path="/product/new" element={<Suspense fallback={<Splash/>}><CreateProductPage/></Suspense>}/>
                <Route path="/products/:productID"
                       element={<Suspense fallback={<Splash/>}><ProductDetailPage/></Suspense>}/>
                <Route path="/products/:productID/update"
                       element={<Suspense fallback={<Splash/>}><UpdateProductPage/></Suspense>}/>
                <Route path="/products" element={<Suspense fallback={<Splash/>}><ProductsPage/></Suspense>}/>
                <Route path="/coupon/new" element={<Suspense fallback={<Splash/>}><CreateCouponPage/></Suspense>}/>
                <Route path="/categories/:couponID"
                       element={<Suspense fallback={<Splash/>}><CouponDetailPage/></Suspense>}/>
                <Route path="/categories/:couponID/update"
                       element={<Suspense fallback={<Splash/>}><UpdateCouponPage/></Suspense>}/>
                <Route path="/categories" element={<Suspense fallback={<Splash/>}><CouponsPage/></Suspense>}/>
                <Route path="/customer/new" element={<Suspense fallback={<Splash/>}><CreateCustomerPage/></Suspense>}/>
                <Route path="/customers/:customerID"
                       element={<Suspense fallback={<Splash/>}><CustomerDetailPage/></Suspense>}/>
                <Route path="/customers/:customerID/update"
                       element={<Suspense fallback={<Splash/>}><UpdateCustomerPage/></Suspense>}/>
                <Route path="/customers" element={<Suspense fallback={<Splash/>}><CustomersPage/></Suspense>}/>
                <Route path="/order/new" element={<Suspense fallback={<Splash/>}><CreateOrderPage/></Suspense>}/>
                <Route path="/orders/:customerID"
                       element={<Suspense fallback={<Splash/>}><OrderDetailPage/></Suspense>}/>
                <Route path="/orders/:orderID/update"
                       element={<Suspense fallback={<Splash/>}><UpdateOrderPage/></Suspense>}/>
                <Route path="/orders" element={<Suspense fallback={<Splash/>}><OrdersPage/></Suspense>}/>
                <Route path="/more" element={<Suspense fallback={<Splash/>}><MorePage/></Suspense>}/>
                <Route path="/elections/:electionID/update"
                       element={<Suspense fallback={<Splash/>}><UpdateProductPage/></Suspense>}/>
                <Route path="*" element={<Suspense fallback={<Splash/>}><NotFoundPage/></Suspense>}/>
            </Routes>
        </ThemeProvider>
    );
}

export default App;
