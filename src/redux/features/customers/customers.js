export const customers = [
    {
        _id: "c1",
        name: "Inigo Lopez",
        email: "inigo.lopez@ihs.org",
        username: "inigo.lopez",
        phone: "+442079476330",
        is_verified: false,
        status: "ACTIVE",
        total_orders: 3,
        total_spent: { amount: 150, currency: "GBP" },
        shipping_address: {
            country: "England",
            county: "Hampshire",
            city: "Southampton",
            postal_code: "SO535PD",
            address_line_1: "71 Cherry Court",
            address_line_2: ""
        },
        billing_address: {
            country: "England",
            county: "Hampshire",
            city: "Southampton",
            postal_code: "SO535PD",
            address_line_1: "71 Cherry Court",
            address_line_2: ""
        },
        created_at: "2023-03-10T10:00:00Z"
    },
    {
        _id: "c2",
        name: "Stanley Hayford",
        email: "stanley.hayford@ihs.org",
        username: "sahayford",
        phone: "+442079476332",
        is_verified: true,
        status: "ACTIVE",
        total_orders: 7,
        total_spent: { amount: 420, currency: "GBP" },
        shipping_address: {
            country: "England",
            county: "Merseyside",
            city: "Birkenhead",
            postal_code: "CH25 9BH",
            address_line_1: "71 Cherry Court",
            address_line_2: ""
        },
        billing_address: {
            country: "England",
            county: "Merseyside",
            city: "Birkenhead",
            postal_code: "CH25 9BH",
            address_line_1: "71 Cherry Court",
            address_line_2: ""
        },
        created_at: "2023-01-15T09:30:00Z"
    },
    {
        _id: "c3",
        name: "Vladislaus Draguila",
        email: "vladislaus.draguila@vampire.world",
        username: "vlad",
        phone: "+442079476335",
        is_verified: true,
        status: "ACTIVE",
        total_orders: 12,
        total_spent: { amount: 890, currency: "GBP" },
        shipping_address: {
            country: "England",
            county: "Merseyside",
            city: "Billinge",
            postal_code: "WN5 7PX",
            address_line_1: "71 Cherry Court",
            address_line_2: ""
        },
        billing_address: {
            country: "England",
            county: "Merseyside",
            city: "Billinge",
            postal_code: "WN5 7PX",
            address_line_1: "71 Cherry Court",
            address_line_2: ""
        },
        created_at: "2022-11-01T14:00:00Z"
    },
    {
        _id: "c4",
        name: "Userma'atre Setepenre",
        email: "usermaatre.setepenre@kemet.org",
        username: "setepenre",
        phone: "+442079476339",
        is_verified: false,
        status: "SUSPENDED",
        total_orders: 1,
        total_spent: { amount: 50, currency: "GBP" },
        shipping_address: {
            country: "England",
            county: "Greater London",
            city: "London",
            postal_code: "BR1 1AA",
            address_line_1: "71 Cherry Court",
            address_line_2: ""
        },
        billing_address: {},
        created_at: "2024-02-20T08:15:00Z"
    }
];
