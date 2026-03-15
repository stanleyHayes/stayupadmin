import profile from "./../../../assets/images/profile.jpg";
import cap from "./../../../assets/images/products/cap.jpg";
import hoodie from "./../../../assets/images/products/hoodie.jpg";
import turtle from "./../../../assets/images/products/turtle-neck.jpg";

export const orders = [
    {
        _id: 1,
        number: "#1001",
        createdAt: "2024-11-15T09:23:00Z",
        updatedAt: "2024-11-18T14:00:00Z",
        status: "completed",
        billing: {
            name: "Inigo Lopez",
            email: "inigo.lopez@example.com",
            phone: "+44 7700 900123",
            address: "71 Cherry Court, Southampton, Hampshire, SO53 5PD, UK",
            method: "PayPal",
            transaction_id: "PAY-5GH82934KL"
        },
        shipping: {
            name: "Inigo Lopez",
            address: "71 Cherry Court, Southampton, Hampshire, SO53 5PD, UK",
            method: "Standard Flat Rate",
            fee: 5.00,
            tracking_number: "RM9283746501GB",
            carrier: "Royal Mail",
            shipped_at: "2024-11-16T10:00:00Z",
            delivered_at: "2024-11-18T14:00:00Z"
        },
        total: { amount: 160, currency: "GBP" },
        subtotal: 155,
        discount: { code: "WELCOME10", amount: 0 },
        tax: { rate: 0, amount: 0 },
        notes: "Please leave at the front door if no answer.",
        customer: { name: "Inigo Lopez", email: "inigo.lopez@example.com", image: "", _id: "c1" },
        orderItems: [
            { product: { title: "Classic Logo Cap", image: cap, sku: "CAP-001", price: { amount: 55, currency: "GBP" } }, quantity: 1 },
            { product: { title: "Pullover Hoodie", image: hoodie, sku: "HOD-001", price: { amount: 55, currency: "GBP" } }, quantity: 1 },
            { product: { title: "Ribbed Turtleneck Jumper", image: turtle, sku: "TRT-001", price: { amount: 50, currency: "GBP" } }, quantity: 1 }
        ]
    },
    {
        _id: 2,
        number: "#1002",
        createdAt: "2024-11-20T14:05:00Z",
        updatedAt: "2024-11-20T14:05:00Z",
        status: "pending payment",
        billing: {
            name: "Vladislaus Draguila",
            email: "vlad.draguila@example.com",
            phone: "+44 7700 900456",
            address: "71 Cherry Court, Billinge, Merseyside, WN5 7PX, UK",
            method: "Direct Bank Transfer",
            transaction_id: ""
        },
        shipping: {
            name: "Vladislaus Draguila",
            address: "71 Cherry Court, Billinge, Merseyside, WN5 7PX, UK",
            method: "Free Shipping",
            fee: 0,
            tracking_number: "",
            carrier: "",
            shipped_at: null,
            delivered_at: null
        },
        total: { amount: 220, currency: "GBP" },
        subtotal: 220,
        discount: { code: "", amount: 0 },
        tax: { rate: 0, amount: 0 },
        notes: "",
        customer: { name: "Vladislaus Draguila", email: "vlad.draguila@example.com", image: profile, _id: "c3" },
        orderItems: [
            { product: { title: "Pullover Hoodie", image: hoodie, sku: "HOD-001", price: { amount: 55, currency: "GBP" } }, quantity: 2 },
            { product: { title: "Classic Logo Cap", image: cap, sku: "CAP-001", price: { amount: 55, currency: "GBP" } }, quantity: 2 }
        ]
    },
    {
        _id: 3,
        number: "#1003",
        createdAt: "2024-12-02T11:40:00Z",
        updatedAt: "2024-12-03T09:00:00Z",
        status: "processing",
        billing: {
            name: "Stanley Hayford",
            email: "stanley.hayford@example.com",
            phone: "+44 7700 900789",
            address: "71 Cherry Court, Birkenhead, Merseyside, CH25 9BH, UK",
            method: "Credit Card (Stripe)",
            transaction_id: "ch_3Pz9KL2eZvKYlo2C"
        },
        shipping: {
            name: "Stanley Hayford",
            address: "71 Cherry Court, Birkenhead, Merseyside, CH25 9BH, UK",
            method: "Express Delivery",
            fee: 12.99,
            tracking_number: "",
            carrier: "DPD",
            shipped_at: null,
            delivered_at: null
        },
        total: { amount: 300, currency: "GBP" },
        subtotal: 300,
        discount: { code: "", amount: 0 },
        tax: { rate: 20, amount: 50 },
        notes: "Gift wrap requested.",
        customer: { name: "Stanley Hayford", email: "stanley.hayford@example.com", image: "", _id: "c2" },
        orderItems: [
            { product: { title: "Ribbed Turtleneck Jumper", image: turtle, sku: "TRT-001", price: { amount: 150, currency: "GBP" } }, quantity: 2 }
        ]
    },
    {
        _id: 4,
        number: "#1004",
        createdAt: "2024-12-10T16:15:00Z",
        updatedAt: "2024-12-10T16:15:00Z",
        status: "on-hold",
        billing: {
            name: "Inigo Lopez",
            email: "inigo.lopez@example.com",
            phone: "+44 7700 900123",
            address: "71 Cherry Court, Southampton, Hampshire, SO53 5PD, UK",
            method: "PayPal",
            transaction_id: "PAY-8JK29384ML"
        },
        shipping: {
            name: "Inigo Lopez",
            address: "71 Cherry Court, Southampton, Hampshire, SO53 5PD, UK",
            method: "Standard Flat Rate",
            fee: 5.00,
            tracking_number: "",
            carrier: "Royal Mail",
            shipped_at: null,
            delivered_at: null
        },
        total: { amount: 110, currency: "GBP" },
        subtotal: 110,
        discount: { code: "", amount: 0 },
        tax: { rate: 0, amount: 0 },
        notes: "Customer requested hold until next week.",
        customer: { name: "Inigo Lopez", email: "inigo.lopez@example.com", image: "", _id: "c1" },
        orderItems: [
            { product: { title: "Classic Logo Cap", image: cap, sku: "CAP-001", price: { amount: 55, currency: "GBP" } }, quantity: 2 }
        ]
    },
    {
        _id: 5,
        number: "#1005",
        createdAt: "2024-12-18T08:30:00Z",
        updatedAt: "2024-12-19T10:00:00Z",
        status: "cancelled",
        billing: {
            name: "Userma'atre Setepenre",
            email: "usermatre@example.com",
            phone: "+44 7700 900321",
            address: "71 Cherry Court, London, BR1 1AA, UK",
            method: "Credit Card (Stripe)",
            transaction_id: "ch_cancelled_001"
        },
        shipping: {
            name: "Userma'atre Setepenre",
            address: "71 Cherry Court, London, BR1 1AA, UK",
            method: "Standard Flat Rate",
            fee: 5.00,
            tracking_number: "",
            carrier: "",
            shipped_at: null,
            delivered_at: null
        },
        total: { amount: 55, currency: "GBP" },
        subtotal: 55,
        discount: { code: "", amount: 0 },
        tax: { rate: 0, amount: 0 },
        notes: "Customer cancelled - changed mind.",
        customer: { name: "Userma'atre Setepenre", email: "usermatre@example.com", image: "", _id: "c4" },
        orderItems: [
            { product: { title: "Classic Logo Cap", image: cap, sku: "CAP-001", price: { amount: 55, currency: "GBP" } }, quantity: 1 }
        ]
    },
    {
        _id: 6,
        number: "#1006",
        createdAt: "2025-01-05T13:55:00Z",
        updatedAt: "2025-01-08T16:00:00Z",
        status: "refunded",
        billing: {
            name: "Vladislaus Draguila",
            email: "vlad.draguila@example.com",
            phone: "+44 7700 900456",
            address: "71 Cherry Court, Billinge, Merseyside, WN5 7PX, UK",
            method: "PayPal",
            transaction_id: "PAY-REF-9KJ38472"
        },
        shipping: {
            name: "Vladislaus Draguila",
            address: "71 Cherry Court, Billinge, Merseyside, WN5 7PX, UK",
            method: "Free Shipping",
            fee: 0,
            tracking_number: "RM1029384756GB",
            carrier: "Royal Mail",
            shipped_at: "2025-01-06T09:00:00Z",
            delivered_at: "2025-01-07T15:00:00Z"
        },
        total: { amount: 150, currency: "GBP" },
        subtotal: 150,
        discount: { code: "", amount: 0 },
        tax: { rate: 0, amount: 0 },
        notes: "Refunded due to defective product.",
        customer: { name: "Vladislaus Draguila", email: "vlad.draguila@example.com", image: profile, _id: "c3" },
        orderItems: [
            { product: { title: "Ribbed Turtleneck Jumper", image: turtle, sku: "TRT-001", price: { amount: 150, currency: "GBP" } }, quantity: 1 }
        ]
    },
    {
        _id: 7,
        number: "#1007",
        createdAt: "2025-01-12T10:00:00Z",
        updatedAt: "2025-01-12T10:00:00Z",
        status: "failed",
        billing: {
            name: "Stanley Hayford",
            email: "stanley.hayford@example.com",
            phone: "+44 7700 900789",
            address: "71 Cherry Court, Birkenhead, Merseyside, CH25 9BH, UK",
            method: "Credit Card (Stripe)",
            transaction_id: "ch_failed_002"
        },
        shipping: {
            name: "Stanley Hayford",
            address: "71 Cherry Court, Birkenhead, Merseyside, CH25 9BH, UK",
            method: "Standard Flat Rate",
            fee: 5.00,
            tracking_number: "",
            carrier: "",
            shipped_at: null,
            delivered_at: null
        },
        total: { amount: 205, currency: "GBP" },
        subtotal: 205,
        discount: { code: "", amount: 0 },
        tax: { rate: 0, amount: 0 },
        notes: "Payment failed - card declined.",
        customer: { name: "Stanley Hayford", email: "stanley.hayford@example.com", image: "", _id: "c2" },
        orderItems: [
            { product: { title: "Pullover Hoodie", image: hoodie, sku: "HOD-001", price: { amount: 55, currency: "GBP" } }, quantity: 1 },
            { product: { title: "Ribbed Turtleneck Jumper", image: turtle, sku: "TRT-001", price: { amount: 150, currency: "GBP" } }, quantity: 1 }
        ]
    },
    {
        _id: 8,
        number: "#1008",
        createdAt: "2025-02-01T09:10:00Z",
        updatedAt: "2025-02-04T11:00:00Z",
        status: "completed",
        billing: {
            name: "Inigo Lopez",
            email: "inigo.lopez@example.com",
            phone: "+44 7700 900123",
            address: "71 Cherry Court, Southampton, Hampshire, SO53 5PD, UK",
            method: "Credit Card (Stripe)",
            transaction_id: "ch_3Qz8ML4fAvKZop3D"
        },
        shipping: {
            name: "Inigo Lopez",
            address: "71 Cherry Court, Southampton, Hampshire, SO53 5PD, UK",
            method: "Express Delivery",
            fee: 12.99,
            tracking_number: "DPD928374650",
            carrier: "DPD",
            shipped_at: "2025-02-02T08:00:00Z",
            delivered_at: "2025-02-03T16:30:00Z"
        },
        total: { amount: 315, currency: "GBP" },
        subtotal: 315,
        discount: { code: "STAYUP20", amount: 15 },
        tax: { rate: 20, amount: 52.50 },
        notes: "",
        customer: { name: "Inigo Lopez", email: "inigo.lopez@example.com", image: "", _id: "c1" },
        orderItems: [
            { product: { title: "Classic Logo Cap", image: cap, sku: "CAP-001", price: { amount: 55, currency: "GBP" } }, quantity: 1 },
            { product: { title: "Pullover Hoodie", image: hoodie, sku: "HOD-001", price: { amount: 55, currency: "GBP" } }, quantity: 1 },
            { product: { title: "Ribbed Turtleneck Jumper", image: turtle, sku: "TRT-001", price: { amount: 150, currency: "GBP" } }, quantity: 1 },
            { product: { title: "Classic Logo Cap", image: cap, sku: "CAP-001", price: { amount: 55, currency: "GBP" } }, quantity: 1 }
        ]
    }
];
