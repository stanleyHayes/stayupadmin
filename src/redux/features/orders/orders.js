import profile from "./../../../assets/images/profile.jpg";
import cap from "./../../../assets/images/products/cap.jpg";
import hoodie from "./../../../assets/images/products/hoodie.jpg";
import turtle from "./../../../assets/images/products/turtle-neck.jpg";

export const orders = [
    {
        _id: 1,
        number: "#1001",
        createdAt: "2024-11-15T09:23:00Z",
        status: "completed",
        billing: {
            address: "Inigo Lopez, 71 Cherry Court, Southampton, Hampshire, SO53 5PD, UK",
            method: "PayPal"
        },
        shipping: {
            address: "71 Cherry Court, Southampton, Hampshire, SO53 5PD, UK",
            method: "Standard Flat Rate"
        },
        total: { amount: 160, currency: "GBP" },
        customer: { name: "Inigo Lopez", image: "", _id: "c1" },
        orderItems: [
            {
                product: { title: "Classic Logo Cap", image: cap, price: { amount: 55, currency: "GBP" } },
                quantity: 1
            },
            {
                product: { title: "Pullover Hoodie", image: hoodie, price: { amount: 55, currency: "GBP" } },
                quantity: 1
            },
            {
                product: { title: "Ribbed Turtleneck Jumper", image: turtle, price: { amount: 50, currency: "GBP" } },
                quantity: 1
            }
        ]
    },
    {
        _id: 2,
        number: "#1002",
        createdAt: "2024-11-20T14:05:00Z",
        status: "pending payment",
        billing: {
            address: "Vladislaus Draguila, 71 Cherry Court, Billinge, Merseyside, WN5 7PX, UK",
            method: "Direct Bank Transfer"
        },
        shipping: {
            address: "71 Cherry Court, Billinge, Merseyside, WN5 7PX, UK",
            method: "Free Shipping"
        },
        total: { amount: 220, currency: "GBP" },
        customer: { name: "Vladislaus Draguila", image: profile, _id: "c3" },
        orderItems: [
            {
                product: { title: "Pullover Hoodie", image: hoodie, price: { amount: 55, currency: "GBP" } },
                quantity: 2
            },
            {
                product: { title: "Classic Logo Cap", image: cap, price: { amount: 55, currency: "GBP" } },
                quantity: 2
            }
        ]
    },
    {
        _id: 3,
        number: "#1003",
        createdAt: "2024-12-02T11:40:00Z",
        status: "processing",
        billing: {
            address: "Stanley Hayford, 71 Cherry Court, Birkenhead, Merseyside, CH25 9BH, UK",
            method: "Credit Card (Stripe)"
        },
        shipping: {
            address: "71 Cherry Court, Birkenhead, Merseyside, CH25 9BH, UK",
            method: "Express Delivery"
        },
        total: { amount: 300, currency: "GBP" },
        customer: { name: "Stanley Hayford", image: "", _id: "c2" },
        orderItems: [
            {
                product: { title: "Ribbed Turtleneck Jumper", image: turtle, price: { amount: 150, currency: "GBP" } },
                quantity: 2
            }
        ]
    },
    {
        _id: 4,
        number: "#1004",
        createdAt: "2024-12-10T16:15:00Z",
        status: "on-hold",
        billing: {
            address: "Inigo Lopez, 71 Cherry Court, Southampton, Hampshire, SO53 5PD, UK",
            method: "PayPal"
        },
        shipping: {
            address: "71 Cherry Court, Southampton, Hampshire, SO53 5PD, UK",
            method: "Standard Flat Rate"
        },
        total: { amount: 110, currency: "GBP" },
        customer: { name: "Inigo Lopez", image: "", _id: "c1" },
        orderItems: [
            {
                product: { title: "Classic Logo Cap", image: cap, price: { amount: 55, currency: "GBP" } },
                quantity: 2
            }
        ]
    },
    {
        _id: 5,
        number: "#1005",
        createdAt: "2024-12-18T08:30:00Z",
        status: "cancelled",
        billing: {
            address: "Userma'atre Setepenre, 71 Cherry Court, London, BR1 1AA, UK",
            method: "Credit Card (Stripe)"
        },
        shipping: {
            address: "71 Cherry Court, London, BR1 1AA, UK",
            method: "Standard Flat Rate"
        },
        total: { amount: 55, currency: "GBP" },
        customer: { name: "Userma'atre Setepenre", image: "", _id: "c4" },
        orderItems: [
            {
                product: { title: "Classic Logo Cap", image: cap, price: { amount: 55, currency: "GBP" } },
                quantity: 1
            }
        ]
    },
    {
        _id: 6,
        number: "#1006",
        createdAt: "2025-01-05T13:55:00Z",
        status: "refunded",
        billing: {
            address: "Vladislaus Draguila, 71 Cherry Court, Billinge, Merseyside, WN5 7PX, UK",
            method: "PayPal"
        },
        shipping: {
            address: "71 Cherry Court, Billinge, Merseyside, WN5 7PX, UK",
            method: "Free Shipping"
        },
        total: { amount: 150, currency: "GBP" },
        customer: { name: "Vladislaus Draguila", image: profile, _id: "c3" },
        orderItems: [
            {
                product: { title: "Ribbed Turtleneck Jumper", image: turtle, price: { amount: 150, currency: "GBP" } },
                quantity: 1
            }
        ]
    },
    {
        _id: 7,
        number: "#1007",
        createdAt: "2025-01-12T10:00:00Z",
        status: "failed",
        billing: {
            address: "Stanley Hayford, 71 Cherry Court, Birkenhead, Merseyside, CH25 9BH, UK",
            method: "Credit Card (Stripe)"
        },
        shipping: {
            address: "71 Cherry Court, Birkenhead, Merseyside, CH25 9BH, UK",
            method: "Standard Flat Rate"
        },
        total: { amount: 205, currency: "GBP" },
        customer: { name: "Stanley Hayford", image: "", _id: "c2" },
        orderItems: [
            {
                product: { title: "Pullover Hoodie", image: hoodie, price: { amount: 55, currency: "GBP" } },
                quantity: 1
            },
            {
                product: { title: "Ribbed Turtleneck Jumper", image: turtle, price: { amount: 150, currency: "GBP" } },
                quantity: 1
            }
        ]
    },
    {
        _id: 8,
        number: "#1008",
        createdAt: "2025-02-01T09:10:00Z",
        status: "completed",
        billing: {
            address: "Inigo Lopez, 71 Cherry Court, Southampton, Hampshire, SO53 5PD, UK",
            method: "Credit Card (Stripe)"
        },
        shipping: {
            address: "71 Cherry Court, Southampton, Hampshire, SO53 5PD, UK",
            method: "Express Delivery"
        },
        total: { amount: 315, currency: "GBP" },
        customer: { name: "Inigo Lopez", image: "", _id: "c1" },
        orderItems: [
            {
                product: { title: "Classic Logo Cap", image: cap, price: { amount: 55, currency: "GBP" } },
                quantity: 1
            },
            {
                product: { title: "Pullover Hoodie", image: hoodie, price: { amount: 55, currency: "GBP" } },
                quantity: 1
            },
            {
                product: { title: "Ribbed Turtleneck Jumper", image: turtle, price: { amount: 150, currency: "GBP" } },
                quantity: 1
            },
            {
                product: { title: "Classic Logo Cap", image: cap, price: { amount: 55, currency: "GBP" } },
                quantity: 1
            }
        ]
    }
];
