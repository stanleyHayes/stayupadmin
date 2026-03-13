export const paymentGateways = [
    {
        _id: "pg1",
        title: "PayPal",
        description: "Pay via PayPal; you can pay with your credit card if you don't have a PayPal account.",
        enabled: true,
        method_title: "PayPal",
        method_description: "PayPal standard sends customers to PayPal to enter their payment information.",
        order: 1,
        settings: {
            email: { value: "merchant@example.com", label: "PayPal Email" },
            sandbox: { value: "no", label: "Enable PayPal Sandbox" },
            ipn_notification: { value: "yes", label: "Enable IPN Email Notifications" }
        }
    },
    {
        _id: "pg2",
        title: "Stripe",
        description: "Pay with your credit or debit card via Stripe.",
        enabled: true,
        method_title: "Stripe",
        method_description: "Stripe works by adding payment fields on the checkout and then sending the details to Stripe for verification.",
        order: 2,
        settings: {
            publishable_key: { value: "pk_test_placeholder", label: "Publishable Key" },
            secret_key: { value: "sk_test_placeholder", label: "Secret Key" },
            test_mode: { value: "yes", label: "Enable Test Mode" }
        }
    },
    {
        _id: "pg3",
        title: "Cash on Delivery",
        description: "Pay with cash upon delivery.",
        enabled: true,
        method_title: "Cash on Delivery",
        method_description: "Have your customers pay with cash (or by other means) upon delivery.",
        order: 3,
        settings: {
            instructions: { value: "Please have exact change ready at time of delivery.", label: "Instructions" },
            enable_for_virtual: { value: "no", label: "Accept for virtual orders" }
        }
    },
    {
        _id: "pg4",
        title: "Bank Transfer",
        description: "Make your payment directly into our bank account. Your order will not be shipped until the funds have cleared.",
        enabled: false,
        method_title: "Direct Bank Transfer",
        method_description: "Take payments in person via BACS. More commonly known as direct bank/wire transfer.",
        order: 4,
        settings: {
            account_name: { value: "StayUp Commerce Ltd", label: "Account Name" },
            account_number: { value: "00012345", label: "Account Number" },
            sort_code: { value: "12-34-56", label: "Sort Code" },
            bank_name: { value: "First National Bank", label: "Bank Name" },
            iban: { value: "GB00FNBA12345600012345", label: "IBAN" }
        }
    }
];
