export const paymentGateways = [
    {
        _id: "pg1",
        title: "PayPal",
        description: "Pay via PayPal; you can pay with your credit card if you don't have a PayPal account.",
        enabled: true,
        method_title: "PayPal",
        method_description: "PayPal standard sends customers to PayPal to enter their payment information.",
        order: 1,
        category: "card",
        settings: {
            email: { value: "merchant@example.com", label: "PayPal Email", type: "email", placeholder: "you@business.com" },
            client_id: { value: "", label: "Client ID", type: "text", placeholder: "Your PayPal Client ID" },
            client_secret: { value: "", label: "Client Secret", type: "password", placeholder: "Your PayPal Client Secret" },
            sandbox: { value: "no", label: "Enable Sandbox Mode", type: "toggle" },
            ipn_notification: { value: "yes", label: "Enable IPN Email Notifications", type: "toggle" },
            payment_action: { value: "sale", label: "Payment Action", type: "select", options: ["sale", "authorize", "order"] }
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
        category: "card",
        settings: {
            publishable_key: { value: "pk_test_placeholder", label: "Publishable Key", type: "text", placeholder: "pk_test_..." },
            secret_key: { value: "sk_test_placeholder", label: "Secret Key", type: "password", placeholder: "sk_test_..." },
            webhook_secret: { value: "", label: "Webhook Secret", type: "password", placeholder: "whsec_..." },
            test_mode: { value: "yes", label: "Enable Test Mode", type: "toggle" },
            capture: { value: "yes", label: "Capture Payments Immediately", type: "toggle" },
            statement_descriptor: { value: "StayUp", label: "Statement Descriptor", type: "text", placeholder: "Appears on customer statement" }
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
        category: "offline",
        settings: {
            instructions: { value: "Please have exact change ready at time of delivery.", label: "Customer Instructions", type: "textarea", placeholder: "Instructions shown to customer at checkout" },
            enable_for_virtual: { value: "no", label: "Accept for Virtual Orders", type: "toggle" },
            minimum_order: { value: "", label: "Minimum Order Amount (£)", type: "text", placeholder: "0.00" }
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
        category: "offline",
        settings: {
            account_name: { value: "StayUp Commerce Ltd", label: "Account Name", type: "text", placeholder: "Business account name" },
            account_number: { value: "00012345", label: "Account Number", type: "text", placeholder: "00000000" },
            sort_code: { value: "12-34-56", label: "Sort Code", type: "text", placeholder: "00-00-00" },
            bank_name: { value: "First National Bank", label: "Bank Name", type: "text", placeholder: "Your bank name" },
            iban: { value: "GB00FNBA12345600012345", label: "IBAN", type: "text", placeholder: "GB00XXXX..." },
            bic_swift: { value: "", label: "BIC / SWIFT Code", type: "text", placeholder: "XXXXGB2L" },
            instructions: { value: "Please use your Order ID as the payment reference.", label: "Payment Instructions", type: "textarea", placeholder: "Instructions shown to customer" }
        }
    },
    {
        _id: "pg5",
        title: "Mobile Money (MTN MoMo)",
        description: "Accept payments via MTN Mobile Money. Customers pay directly from their mobile wallet.",
        enabled: false,
        method_title: "MTN Mobile Money",
        method_description: "MTN MoMo allows customers to pay using their MTN Mobile Money wallet.",
        order: 5,
        category: "mobile_money",
        settings: {
            api_user: { value: "", label: "API User ID", type: "text", placeholder: "Your MTN MoMo API User" },
            api_key: { value: "", label: "API Key", type: "password", placeholder: "Your MTN MoMo API Key" },
            subscription_key: { value: "", label: "Subscription Key (Ocp-Apim)", type: "password", placeholder: "Primary or secondary key" },
            environment: { value: "sandbox", label: "Environment", type: "select", options: ["sandbox", "production"] },
            currency: { value: "GHS", label: "Currency", type: "select", options: ["GHS", "UGX", "XAF", "XOF", "EUR"] },
            callback_url: { value: "", label: "Callback URL", type: "text", placeholder: "https://yourdomain.com/api/momo/callback" },
            collection_phone: { value: "", label: "Collection Phone Number", type: "text", placeholder: "+233XXXXXXXXX" }
        }
    },
    {
        _id: "pg6",
        title: "Vodafone Cash",
        description: "Accept payments via Vodafone Cash mobile wallet.",
        enabled: false,
        method_title: "Vodafone Cash",
        method_description: "Let customers pay using their Vodafone Cash mobile money wallet.",
        order: 6,
        category: "mobile_money",
        settings: {
            merchant_id: { value: "", label: "Merchant ID", type: "text", placeholder: "Your Vodafone Cash Merchant ID" },
            api_key: { value: "", label: "API Key", type: "password", placeholder: "Your Vodafone Cash API Key" },
            merchant_phone: { value: "", label: "Merchant Phone Number", type: "text", placeholder: "+233XXXXXXXXX" },
            callback_url: { value: "", label: "Callback URL", type: "text", placeholder: "https://yourdomain.com/api/vodacash/callback" },
            test_mode: { value: "yes", label: "Enable Test Mode", type: "toggle" }
        }
    },
    {
        _id: "pg7",
        title: "AirtelTigo Money",
        description: "Accept payments via AirtelTigo Money mobile wallet.",
        enabled: false,
        method_title: "AirtelTigo Money",
        method_description: "AirtelTigo Money enables customers to pay from their AirtelTigo mobile wallet.",
        order: 7,
        category: "mobile_money",
        settings: {
            merchant_id: { value: "", label: "Merchant ID", type: "text", placeholder: "Your AirtelTigo Merchant ID" },
            api_key: { value: "", label: "API Key", type: "password", placeholder: "Your AirtelTigo API Key" },
            merchant_phone: { value: "", label: "Merchant Phone Number", type: "text", placeholder: "+233XXXXXXXXX" },
            callback_url: { value: "", label: "Callback URL", type: "text", placeholder: "https://yourdomain.com/api/airteltigo/callback" },
            test_mode: { value: "yes", label: "Enable Test Mode", type: "toggle" }
        }
    },
    {
        _id: "pg8",
        title: "Paystack",
        description: "Accept payments via Paystack — cards, bank transfers, mobile money, and USSD across Africa.",
        enabled: false,
        method_title: "Paystack",
        method_description: "Paystack helps African businesses accept payments from anyone, anywhere in the world.",
        order: 8,
        category: "card",
        settings: {
            public_key: { value: "", label: "Public Key", type: "text", placeholder: "pk_test_..." },
            secret_key: { value: "", label: "Secret Key", type: "password", placeholder: "sk_test_..." },
            test_mode: { value: "yes", label: "Enable Test Mode", type: "toggle" },
            payment_channels: { value: "card,bank,mobile_money", label: "Payment Channels", type: "text", placeholder: "card,bank,mobile_money,ussd" },
            webhook_url: { value: "", label: "Webhook URL", type: "text", placeholder: "https://yourdomain.com/api/paystack/webhook" }
        }
    },
    {
        _id: "pg9",
        title: "Flutterwave",
        description: "Accept payments via Flutterwave — cards, mobile money, bank transfers, and more across Africa.",
        enabled: false,
        method_title: "Flutterwave (Rave)",
        method_description: "Flutterwave provides a seamless payment infrastructure for businesses across Africa.",
        order: 9,
        category: "card",
        settings: {
            public_key: { value: "", label: "Public Key", type: "text", placeholder: "FLWPUBK_TEST-..." },
            secret_key: { value: "", label: "Secret Key", type: "password", placeholder: "FLWSECK_TEST-..." },
            encryption_key: { value: "", label: "Encryption Key", type: "password", placeholder: "Your Flutterwave Encryption Key" },
            test_mode: { value: "yes", label: "Enable Test Mode", type: "toggle" },
            payment_options: { value: "card,mobilemoney,ussd", label: "Payment Options", type: "text", placeholder: "card,mobilemoney,ussd,banktransfer" },
            webhook_url: { value: "", label: "Webhook URL", type: "text", placeholder: "https://yourdomain.com/api/flutterwave/webhook" }
        }
    },
    {
        _id: "pg10",
        title: "Cryptocurrency (Coinbase)",
        description: "Accept Bitcoin, Ethereum, Litecoin, and other cryptocurrencies via Coinbase Commerce.",
        enabled: false,
        method_title: "Coinbase Commerce",
        method_description: "Coinbase Commerce lets you accept cryptocurrency payments directly into your wallet.",
        order: 10,
        category: "crypto",
        settings: {
            api_key: { value: "", label: "API Key", type: "password", placeholder: "Your Coinbase Commerce API Key" },
            webhook_secret: { value: "", label: "Webhook Shared Secret", type: "password", placeholder: "Your webhook shared secret" },
            accepted_currencies: { value: "BTC,ETH,USDT,USDC", label: "Accepted Currencies", type: "text", placeholder: "BTC,ETH,USDT,USDC,LTC" },
            webhook_url: { value: "", label: "Webhook URL", type: "text", placeholder: "https://yourdomain.com/api/coinbase/webhook" },
            auto_convert: { value: "no", label: "Auto-convert to Fiat", type: "toggle" }
        }
    },
    {
        _id: "pg11",
        title: "Cryptocurrency (BitPay)",
        description: "Accept Bitcoin and other cryptocurrency payments via BitPay.",
        enabled: false,
        method_title: "BitPay",
        method_description: "BitPay enables merchants to accept cryptocurrency payments and receive settlement in their preferred currency.",
        order: 11,
        category: "crypto",
        settings: {
            api_token: { value: "", label: "API Token", type: "password", placeholder: "Your BitPay API Token" },
            notification_url: { value: "", label: "Notification URL (IPN)", type: "text", placeholder: "https://yourdomain.com/api/bitpay/ipn" },
            test_mode: { value: "yes", label: "Enable Test Mode", type: "toggle" },
            auto_settle: { value: "yes", label: "Auto-settle to Fiat", type: "toggle" },
            settlement_currency: { value: "GBP", label: "Settlement Currency", type: "select", options: ["GBP", "USD", "EUR", "BTC"] }
        }
    },
    {
        _id: "pg12",
        title: "USSD Payment",
        description: "Accept payments via USSD — no internet required. Ideal for feature phone users.",
        enabled: false,
        method_title: "USSD Payment",
        method_description: "USSD payments let customers pay by dialing a code on their phone, no data connection needed.",
        order: 12,
        category: "mobile_money",
        settings: {
            provider: { value: "paystack", label: "USSD Provider", type: "select", options: ["paystack", "flutterwave", "custom"] },
            ussd_code: { value: "", label: "USSD Short Code", type: "text", placeholder: "*123#" },
            merchant_code: { value: "", label: "Merchant Code", type: "text", placeholder: "Your assigned merchant code" },
            api_key: { value: "", label: "API Key", type: "password", placeholder: "Your provider API key" },
            test_mode: { value: "yes", label: "Enable Test Mode", type: "toggle" }
        }
    }
];
