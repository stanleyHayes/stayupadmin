import {useSelector} from "react-redux";
import {selectUI} from "./redux/features/ui/ui-slice";
import {CssBaseline, GlobalStyles, ThemeProvider} from "@mui/material";
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
const TermsPage = lazy(() => import("./pages/others/terms-page.jsx"));

const CreateUserPage = lazy(() => import("./pages/users/create-user-page.jsx"));
const UpdateUserPage = lazy(() => import("./pages/users/update-user-page.jsx"));
const UserDetailPage = lazy(() => import("./pages/users/user-detail-page.jsx"));
const UsersPage = lazy(() => import("./pages/users/users-page.jsx"));

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

// Webhooks
const WebhooksPage = lazy(() => import("./pages/webhooks/webhooks-page.jsx"));
const WebhookDetailPage = lazy(() => import("./pages/webhooks/webhook-detail-page.jsx"));
const CreateWebhookPage = lazy(() => import("./pages/webhooks/create-webhook-page.jsx"));
const UpdateWebhookPage = lazy(() => import("./pages/webhooks/update-webhook-page.jsx"));

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


const wrap = (Component) => (
    <Suspense fallback={<Splash/>}><Component/></Suspense>
);

function App() {
    const {theme} = useSelector(selectUI);
    return (
        <ThemeProvider theme={theme === 'dark' ? THEMES.darkTheme : THEMES.lightTheme}>
            <CssBaseline enableColorScheme={true}/>
            <GlobalStyles styles={{"*": {transition: "background-color 0.25s ease, border-color 0.25s ease, color 0.15s ease"}}}/>
            <Routes>
                <Route path="/" element={wrap(OverviewPage)}/>
                <Route path="/overview" element={wrap(OverviewPage)}/>

                {/* Analytics */}
                <Route path="/analytics" element={wrap(AnalyticsPage)}/>
                <Route path="/revenue" element={wrap(RevenuePage)}/>

                {/* Products */}
                <Route path="/products" element={wrap(ProductsPage)}/>
                <Route path="/products/:productID" element={wrap(ProductDetailPage)}/>
                <Route path="/products/:productID/update" element={wrap(UpdateProductPage)}/>
                <Route path="/product/new" element={wrap(CreateProductPage)}/>

                {/* Orders */}
                <Route path="/orders" element={wrap(OrdersPage)}/>
                <Route path="/orders/:orderID" element={wrap(OrderDetailPage)}/>
                <Route path="/orders/:orderID/update" element={wrap(UpdateOrderPage)}/>
                <Route path="/order/new" element={wrap(CreateOrderPage)}/>

                {/* Order Notes */}
                <Route path="/order-notes" element={wrap(OrderNotesPage)}/>
                <Route path="/order-notes/:noteID" element={wrap(OrderNoteDetailPage)}/>
                <Route path="/order-note/new" element={wrap(CreateOrderNotePage)}/>

                {/* Order Refunds */}
                <Route path="/order-refunds" element={wrap(OrderRefundsPage)}/>
                <Route path="/order-refunds/:refundID" element={wrap(OrderRefundDetailPage)}/>
                <Route path="/order-refund/new" element={wrap(CreateOrderRefundPage)}/>

                {/* Customers */}
                <Route path="/customers" element={wrap(CustomersPage)}/>
                <Route path="/customers/:customerID" element={wrap(CustomerDetailPage)}/>
                <Route path="/customers/:customerID/update" element={wrap(UpdateCustomerPage)}/>
                <Route path="/customer/new" element={wrap(CreateCustomerPage)}/>

                {/* Categories */}
                <Route path="/categories" element={wrap(CategoriesPage)}/>
                <Route path="/categories/:categoryID" element={wrap(CategoryDetailPage)}/>
                <Route path="/categories/:categoryID/update" element={wrap(UpdateCategoryPage)}/>
                <Route path="/category/new" element={wrap(CreateCategoryPage)}/>

                {/* Coupons */}
                <Route path="/coupons" element={wrap(CouponsPage)}/>
                <Route path="/coupons/:couponID" element={wrap(CouponDetailPage)}/>
                <Route path="/coupons/:couponID/update" element={wrap(UpdateCouponPage)}/>
                <Route path="/coupon/new" element={wrap(CreateCouponPage)}/>

                {/* Tags */}
                <Route path="/tags" element={wrap(TagsPage)}/>

                {/* Attributes */}
                <Route path="/attributes" element={wrap(AttributesPage)}/>

                {/* Variations */}
                <Route path="/variations" element={wrap(VariationsPage)}/>

                {/* Order Actions */}
                <Route path="/order-actions" element={wrap(OrderActionsPage)}/>

                {/* Reviews */}
                <Route path="/reviews" element={wrap(ReviewsPage)}/>
                <Route path="/reviews/:reviewID" element={wrap(ReviewDetailPage)}/>

                {/* Tax */}
                <Route path="/tax-rates" element={wrap(TaxRatesPage)}/>
                <Route path="/tax-rates/:taxRateID" element={wrap(TaxRateDetailPage)}/>
                <Route path="/tax-rates/:taxRateID/update" element={wrap(UpdateTaxRatePage)}/>
                <Route path="/tax-rate/new" element={wrap(CreateTaxRatePage)}/>
                <Route path="/tax-classes" element={wrap(TaxClassesPage)}/>

                {/* Payment Gateways */}
                <Route path="/payment-gateways" element={wrap(PaymentGatewaysPage)}/>
                <Route path="/payment-gateways/:gatewayID" element={wrap(PaymentGatewayDetailPage)}/>

                {/* Shipping */}
                <Route path="/shipping-classes" element={wrap(ShippingClassesPage)}/>
                <Route path="/shipping-methods" element={wrap(ShippingMethodsPage)}/>

                {/* Webhooks */}
                <Route path="/webhooks" element={wrap(WebhooksPage)}/>
                <Route path="/webhooks/:webhookID" element={wrap(WebhookDetailPage)}/>
                <Route path="/webhooks/:webhookID/update" element={wrap(UpdateWebhookPage)}/>
                <Route path="/webhook/new" element={wrap(CreateWebhookPage)}/>

                {/* Subscribers */}
                <Route path="/subscribers" element={wrap(SubscribersPage)}/>
                <Route path="/subscribers/:subscriberID" element={wrap(SubscriberDetailPage)}/>

                {/* Messages */}
                <Route path="/messages" element={wrap(MessagesPage)}/>
                <Route path="/messages/:messageID" element={wrap(MessageDetailPage)}/>

                {/* Blog */}
                <Route path="/blog" element={wrap(BlogPostsPage)}/>
                <Route path="/blog/:postID" element={wrap(BlogPostDetailPage)}/>
                <Route path="/blog/:postID/update" element={wrap(UpdateBlogPostPage)}/>
                <Route path="/blog/new" element={wrap(CreateBlogPostPage)}/>

                {/* Testimonials */}
                <Route path="/testimonials" element={wrap(TestimonialsPage)}/>
                <Route path="/testimonials/:testimonialID" element={wrap(TestimonialDetailPage)}/>

                {/* Admins */}
                <Route path="/admins" element={wrap(AdminsPage)}/>
                <Route path="/admins/:adminID" element={wrap(AdminDetailPage)}/>
                <Route path="/admins/:adminID/update" element={wrap(UpdateAdminPage)}/>
                <Route path="/admin/new" element={wrap(CreateAdminPage)}/>

                {/* Users */}
                <Route path="/users" element={wrap(UsersPage)}/>
                <Route path="/users/:userID" element={wrap(UserDetailPage)}/>
                <Route path="/users/:userID/update" element={wrap(UpdateUserPage)}/>
                <Route path="/user/new" element={wrap(CreateUserPage)}/>

                {/* Invitations */}
                <Route path="/invitations" element={wrap(InvitationsPage)}/>
                <Route path="/invitations/:invitationID" element={wrap(InvitationDetailPage)}/>
                <Route path="/invitations/:invitationID/update" element={wrap(UpdateInvitationPage)}/>
                <Route path="/invitation/new" element={wrap(CreateInvitationPage)}/>

                {/* Account */}
                <Route path="/account" element={wrap(AccountPage)}/>
                <Route path="/profile" element={wrap(ProfilePage)}/>
                <Route path="/profile/update" element={wrap(UpdateProfilePage)}/>
                <Route path="/change-password" element={wrap(ChangePasswordPage)}/>

                {/* Auth */}
                <Route path="/auth/login" element={wrap(LoginPage)}/>
                <Route path="/auth/forgot-password" element={wrap(ForgotPasswordPage)}/>
                <Route path="/auth/reset-password" element={wrap(ResetPasswordPage)}/>
                <Route path="/auth/verify/:token" element={wrap(VerifyAccountPage)}/>
                <Route path="/auth/otp" element={wrap(VerifyOTPPage)}/>
                <Route path="/auth/invite/:token" element={wrap(AcceptInvitationPage)}/>

                {/* Info pages */}
                <Route path="/terms" element={wrap(TermsPage)}/>
                <Route path="/settings" element={wrap(SettingsPage)}/>
                <Route path="/privacy" element={wrap(PrivacyPage)}/>
                <Route path="/help" element={wrap(HelpPage)}/>
                <Route path="/faq" element={wrap(FAQPage)}/>
                <Route path="/contact" element={wrap(ContactPage)}/>
                <Route path="/us" element={wrap(AboutUsPage)}/>
                <Route path="/more" element={wrap(MorePage)}/>

                <Route path="*" element={wrap(NotFoundPage)}/>
            </Routes>
        </ThemeProvider>
    );
}

export default App;
