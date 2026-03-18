import {useDispatch, useSelector} from "react-redux";
import {selectUI} from "./redux/features/ui/ui-slice";
import {selectAuth, getProfile} from "./redux/features/authentication/authentication-slice";
import {fetchOrders} from "./redux/features/orders/orders-slice";
import {fetchMessages} from "./redux/features/messages/messages-slice";
import {fetchSubscribers} from "./redux/features/subscribers/subscribers-slice";
import {fetchReviews} from "./redux/features/reviews/reviews-slice";
import {fetchCustomers} from "./redux/features/customers/customers-slice";
import {CssBaseline, GlobalStyles, ThemeProvider} from "@mui/material";
import {THEMES} from "./utils/themes";
import {Route, Routes} from "react-router";
import {lazy, Suspense, useEffect} from "react";
import Splash from "./components/shared/splash.jsx";
import RequireAuth from "./components/shared/require-auth.jsx";
import ErrorBoundary from "./components/shared/error-boundary.jsx";
import ScrollToTop from "./components/shared/scroll-to-top.jsx";

const MorePage = lazy(() => import("./pages/others/more-page.jsx"));
const NotFoundPage = lazy(() => import("./pages/others/not-found-page.jsx"));
const OverviewPage = lazy(() => import("./pages/overview/overview-page.jsx"));
const AboutUsPage = lazy(() => import("./pages/others/about-us-page.jsx"));
const ContactPage = lazy(() => import("./pages/others/contact-page.jsx"));
const FAQPage = lazy(() => import("./pages/others/faq-page.jsx"));
const HelpPage = lazy(() => import("./pages/others/help-page.jsx"));
const PrivacyPage = lazy(() => import("./pages/others/privacy-page.jsx"));
const SettingsPage = lazy(() => import("./pages/others/settings-page.jsx"));
const TermsPage = lazy(() => import("./pages/others/terms-page.jsx"));


const AccountPage = lazy(() => import("./pages/account/account-page.jsx"));
const ChangePasswordPage = lazy(() => import("./pages/account/change-password-page.jsx"));
const ProfilePage = lazy(() => import("./pages/account/profile-page.jsx"));
const UpdateProfilePage = lazy(() => import("./pages/account/update-profile-page.jsx"));

const AdminsPage = lazy(() => import("./pages/admins/admins-page.jsx"));
const AdminDetailPage = lazy(() => import("./pages/admins/admin-detail-page.jsx"));
const CreateAdminPage = lazy(() => import("./pages/admins/create-admin-page.jsx"));
const UpdateAdminPage = lazy(() => import("./pages/admins/update-admin-page.jsx"));

const ForgotPasswordPage = lazy(() => import("./pages/authentication/forgot-password-page.jsx"));
const LoginPage = lazy(() => import("./pages/authentication/login-page.jsx"));

const ResetPasswordPage = lazy(() => import("./pages/authentication/reset-password-page.jsx"));
const VerifyAccountPage = lazy(() => import("./pages/authentication/verify-account-page.jsx"));
const VerifyOTPPage = lazy(() => import("./pages/authentication/verify-otp-page.jsx"));
const AcceptInvitationPage = lazy(() => import("./pages/authentication/accept-invitation-page.jsx"));

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

const TagsPage = lazy(() => import("./pages/tags/tags-page.jsx"));
const AttributesPage = lazy(() => import("./pages/attributes/attributes-page.jsx"));
const VariationsPage = lazy(() => import("./pages/variations/variations-page.jsx"));
const OrderActionsPage = lazy(() => import("./pages/order-actions/order-actions-page.jsx"));
const AnalyticsPage = lazy(() => import("./pages/analytics/analytics-page.jsx"));

// Order sub-resources
const OrderNotesPage = lazy(() => import("./pages/order-notes/order-notes-page.jsx"));
const OrderNoteDetailPage = lazy(() => import("./pages/order-notes/order-note-detail-page.jsx"));
const CreateOrderNotePage = lazy(() => import("./pages/order-notes/create-order-note-page.jsx"));
const OrderRefundsPage = lazy(() => import("./pages/order-refunds/order-refunds-page.jsx"));
const OrderRefundDetailPage = lazy(() => import("./pages/order-refunds/order-refund-detail-page.jsx"));
const CreateOrderRefundPage = lazy(() => import("./pages/order-refunds/create-order-refund-page.jsx"));

// Reviews
const ReviewsPage = lazy(() => import("./pages/reviews/reviews-page.jsx"));
const ReviewDetailPage = lazy(() => import("./pages/reviews/review-detail-page.jsx"));

// Tax
const TaxRatesPage = lazy(() => import("./pages/tax-rates/tax-rates-page.jsx"));
const TaxRateDetailPage = lazy(() => import("./pages/tax-rates/tax-rate-detail-page.jsx"));
const CreateTaxRatePage = lazy(() => import("./pages/tax-rates/create-tax-rate-page.jsx"));
const UpdateTaxRatePage = lazy(() => import("./pages/tax-rates/update-tax-rate-page.jsx"));
const TaxClassesPage = lazy(() => import("./pages/tax-classes/tax-classes-page.jsx"));

// Payment & Shipping
const PaymentGatewaysPage = lazy(() => import("./pages/payment-gateways/payment-gateways-page.jsx"));
const PaymentGatewayDetailPage = lazy(() => import("./pages/payment-gateways/payment-gateway-detail-page.jsx"));
const ShippingClassesPage = lazy(() => import("./pages/shipping-classes/shipping-classes-page.jsx"));
const ShippingMethodsPage = lazy(() => import("./pages/shipping-methods/shipping-methods-page.jsx"));


// Revenue
const RevenuePage = lazy(() => import("./pages/revenue/revenue-page.jsx"));

// Subscribers
const SubscribersPage = lazy(() => import("./pages/subscribers/subscribers-page.jsx"));
const SubscriberDetailPage = lazy(() => import("./pages/subscribers/subscriber-detail-page.jsx"));

// Messages
const MessagesPage = lazy(() => import("./pages/messages/messages-page.jsx"));
const MessageDetailPage = lazy(() => import("./pages/messages/message-detail-page.jsx"));

// Blog
const BlogPostsPage = lazy(() => import("./pages/blog/blog-posts-page.jsx"));
const BlogPostDetailPage = lazy(() => import("./pages/blog/blog-post-detail-page.jsx"));
const CreateBlogPostPage = lazy(() => import("./pages/blog/create-blog-post-page.jsx"));
const UpdateBlogPostPage = lazy(() => import("./pages/blog/update-blog-post-page.jsx"));

// Testimonials
const TestimonialsPage = lazy(() => import("./pages/testimonials/testimonials-page.jsx"));
const TestimonialDetailPage = lazy(() => import("./pages/testimonials/testimonial-detail-page.jsx"));

// Collections
const CollectionsPage = lazy(() => import("./pages/collections/collections-page.jsx"));
const CollectionDetailPage = lazy(() => import("./pages/collections/collection-detail-page.jsx"));
const CreateCollectionPage = lazy(() => import("./pages/collections/create-collection-page.jsx"));
const UpdateCollectionPage = lazy(() => import("./pages/collections/update-collection-page.jsx"));

// Roles & Permissions
const RolesPage = lazy(() => import("./pages/roles/roles-page.jsx"));
const RoleDetailPage = lazy(() => import("./pages/roles/role-detail-page.jsx"));
const CreateRolePage = lazy(() => import("./pages/roles/create-role-page.jsx"));
const UpdateRolePage = lazy(() => import("./pages/roles/update-role-page.jsx"));


const pub = (Component) => (
    <ErrorBoundary>
        <Suspense fallback={<Splash/>}><Component/></Suspense>
    </ErrorBoundary>
);

const guard = (Component) => (
    <ErrorBoundary>
        <Suspense fallback={<Splash/>}>
            <RequireAuth><Component/></RequireAuth>
        </Suspense>
    </ErrorBoundary>
);

function App() {
    const dispatch = useDispatch();
    const {theme} = useSelector(selectUI);
    const {isAuthenticated, user, token} = useSelector(selectAuth);

    useEffect(() => {
        if (isAuthenticated && token && !user) {
            dispatch(getProfile());
        }
    }, [dispatch, isAuthenticated, token, user]);

    // Fetch notification data on login + poll every 60s for new items
    useEffect(() => {
        if (!isAuthenticated || !token) return;
        const fetchAll = () => {
            dispatch(fetchOrders());
            dispatch(fetchMessages());
            dispatch(fetchSubscribers());
            dispatch(fetchReviews());
            dispatch(fetchCustomers());
        };
        fetchAll();
        const interval = setInterval(fetchAll, 60000);
        return () => clearInterval(interval);
    }, [dispatch, isAuthenticated, token]);

    return (
        <ThemeProvider theme={theme === 'dark' ? THEMES.darkTheme : THEMES.lightTheme}>
            <CssBaseline enableColorScheme={true}/>
            <ScrollToTop/>
            <GlobalStyles styles={{"*": {transition: "background-color 0.25s ease, border-color 0.25s ease, color 0.15s ease"}}}/>
            <Routes>
                <Route path="/" element={guard(OverviewPage)}/>
                <Route path="/overview" element={guard(OverviewPage)}/>

                {/* Analytics */}
                <Route path="/analytics" element={guard(AnalyticsPage)}/>
                <Route path="/revenue" element={guard(RevenuePage)}/>

                {/* Products */}
                <Route path="/products" element={guard(ProductsPage)}/>
                <Route path="/products/:productID" element={guard(ProductDetailPage)}/>
                <Route path="/products/:productID/update" element={guard(UpdateProductPage)}/>
                <Route path="/product/new" element={guard(CreateProductPage)}/>

                {/* Orders */}
                <Route path="/orders" element={guard(OrdersPage)}/>
                <Route path="/orders/:orderID" element={guard(OrderDetailPage)}/>
                <Route path="/orders/:orderID/update" element={guard(UpdateOrderPage)}/>
                <Route path="/order/new" element={guard(CreateOrderPage)}/>

                {/* Order Notes */}
                <Route path="/order-notes" element={guard(OrderNotesPage)}/>
                <Route path="/order-notes/:noteID" element={guard(OrderNoteDetailPage)}/>
                <Route path="/order-note/new" element={guard(CreateOrderNotePage)}/>

                {/* Order Refunds */}
                <Route path="/order-refunds" element={guard(OrderRefundsPage)}/>
                <Route path="/order-refunds/:refundID" element={guard(OrderRefundDetailPage)}/>
                <Route path="/order-refund/new" element={guard(CreateOrderRefundPage)}/>

                {/* Customers */}
                <Route path="/customers" element={guard(CustomersPage)}/>
                <Route path="/customers/:customerID" element={guard(CustomerDetailPage)}/>
                <Route path="/customers/:customerID/update" element={guard(UpdateCustomerPage)}/>
                <Route path="/customer/new" element={guard(CreateCustomerPage)}/>

                {/* Categories */}
                <Route path="/categories" element={guard(CategoriesPage)}/>
                <Route path="/categories/:categoryID" element={guard(CategoryDetailPage)}/>
                <Route path="/categories/:categoryID/update" element={guard(UpdateCategoryPage)}/>
                <Route path="/category/new" element={guard(CreateCategoryPage)}/>

                {/* Coupons */}
                <Route path="/coupons" element={guard(CouponsPage)}/>
                <Route path="/coupons/:couponID" element={guard(CouponDetailPage)}/>
                <Route path="/coupons/:couponID/update" element={guard(UpdateCouponPage)}/>
                <Route path="/coupon/new" element={guard(CreateCouponPage)}/>

                {/* Tags */}
                <Route path="/tags" element={guard(TagsPage)}/>

                {/* Attributes */}
                <Route path="/attributes" element={guard(AttributesPage)}/>

                {/* Collections */}
                <Route path="/collections" element={guard(CollectionsPage)}/>
                <Route path="/collections/:collectionID" element={guard(CollectionDetailPage)}/>
                <Route path="/collections/:collectionID/update" element={guard(UpdateCollectionPage)}/>
                <Route path="/collection/new" element={guard(CreateCollectionPage)}/>

                {/* Variations */}
                <Route path="/variations" element={guard(VariationsPage)}/>

                {/* Order Actions */}
                <Route path="/order-actions" element={guard(OrderActionsPage)}/>

                {/* Reviews */}
                <Route path="/reviews" element={guard(ReviewsPage)}/>
                <Route path="/reviews/:reviewID" element={guard(ReviewDetailPage)}/>

                {/* Tax */}
                <Route path="/tax-rates" element={guard(TaxRatesPage)}/>
                <Route path="/tax-rates/:taxRateID" element={guard(TaxRateDetailPage)}/>
                <Route path="/tax-rates/:taxRateID/update" element={guard(UpdateTaxRatePage)}/>
                <Route path="/tax-rate/new" element={guard(CreateTaxRatePage)}/>
                <Route path="/tax-classes" element={guard(TaxClassesPage)}/>

                {/* Payment Gateways */}
                <Route path="/payment-gateways" element={guard(PaymentGatewaysPage)}/>
                <Route path="/payment-gateways/:gatewayID" element={guard(PaymentGatewayDetailPage)}/>

                {/* Shipping */}
                <Route path="/shipping-classes" element={guard(ShippingClassesPage)}/>
                <Route path="/shipping-methods" element={guard(ShippingMethodsPage)}/>

                {/* Webhooks */}
                {/* Subscribers */}
                <Route path="/subscribers" element={guard(SubscribersPage)}/>
                <Route path="/subscribers/:subscriberID" element={guard(SubscriberDetailPage)}/>

                {/* Messages */}
                <Route path="/messages" element={guard(MessagesPage)}/>
                <Route path="/messages/:messageID" element={guard(MessageDetailPage)}/>

                {/* Blog */}
                <Route path="/blog" element={guard(BlogPostsPage)}/>
                <Route path="/blog/:postID" element={guard(BlogPostDetailPage)}/>
                <Route path="/blog/:postID/update" element={guard(UpdateBlogPostPage)}/>
                <Route path="/blog/new" element={guard(CreateBlogPostPage)}/>

                {/* Testimonials */}
                <Route path="/testimonials" element={guard(TestimonialsPage)}/>
                <Route path="/testimonials/:testimonialID" element={guard(TestimonialDetailPage)}/>

                {/* Roles & Permissions */}
                <Route path="/roles" element={guard(RolesPage)}/>
                <Route path="/roles/:roleID" element={guard(RoleDetailPage)}/>
                <Route path="/roles/:roleID/update" element={guard(UpdateRolePage)}/>
                <Route path="/role/new" element={guard(CreateRolePage)}/>

                {/* Admins */}
                <Route path="/admins" element={guard(AdminsPage)}/>
                <Route path="/admins/:adminID" element={guard(AdminDetailPage)}/>
                <Route path="/admins/:adminID/update" element={guard(UpdateAdminPage)}/>
                <Route path="/admin/new" element={guard(CreateAdminPage)}/>

                {/* Users */}

                {/* Invitations */}
                <Route path="/invitations" element={guard(InvitationsPage)}/>
                <Route path="/invitations/:invitationID" element={guard(InvitationDetailPage)}/>
                <Route path="/invitations/:invitationID/update" element={guard(UpdateInvitationPage)}/>
                <Route path="/invitation/new" element={guard(CreateInvitationPage)}/>

                {/* Account */}
                <Route path="/account" element={guard(AccountPage)}/>
                <Route path="/profile" element={guard(ProfilePage)}/>
                <Route path="/profile/update" element={guard(UpdateProfilePage)}/>
                <Route path="/change-password" element={guard(ChangePasswordPage)}/>

                {/* Auth (public) */}
                <Route path="/auth/login" element={pub(LoginPage)}/>
                <Route path="/auth/forgot-password" element={pub(ForgotPasswordPage)}/>
                <Route path="/auth/reset-password" element={pub(ResetPasswordPage)}/>
                <Route path="/auth/verify/:token" element={pub(VerifyAccountPage)}/>
                <Route path="/auth/otp" element={pub(VerifyOTPPage)}/>
                <Route path="/auth/invite/:token" element={pub(AcceptInvitationPage)}/>

                {/* Info pages (public) */}
                <Route path="/terms" element={pub(TermsPage)}/>
                <Route path="/settings" element={guard(SettingsPage)}/>
                <Route path="/privacy" element={pub(PrivacyPage)}/>
                <Route path="/help" element={pub(HelpPage)}/>
                <Route path="/faq" element={pub(FAQPage)}/>
                <Route path="/contact" element={pub(ContactPage)}/>
                <Route path="/us" element={pub(AboutUsPage)}/>
                <Route path="/more" element={pub(MorePage)}/>

                <Route path="*" element={pub(NotFoundPage)}/>
            </Routes>
        </ThemeProvider>
    );
}

export default App;
