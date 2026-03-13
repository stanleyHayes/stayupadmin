export const orderRefunds = [
    {
        _id: "ref1",
        order_id: 6,
        amount: 150.00,
        reason: "Customer reported item not received after 14-day wait",
        status: "PROCESSED",
        line_items: [
            { product_name: "Ninja Silhouette T-Shirt", qty: 1, refund_amount: 150.00 }
        ],
        created_at: "2025-01-07T11:30:00Z"
    },
    {
        _id: "ref2",
        order_id: 2,
        amount: 110.00,
        reason: "Wrong size delivered — customer returned both caps",
        status: "PENDING",
        line_items: [
            { product_name: "Classic Logo Cap", qty: 2, refund_amount: 110.00 }
        ],
        created_at: "2024-11-28T13:30:00Z"
    },
    {
        _id: "ref3",
        order_id: 5,
        amount: 55.00,
        reason: "Order cancelled before dispatch",
        status: "PROCESSED",
        line_items: [
            { product_name: "Classic Logo Cap", qty: 1, refund_amount: 55.00 }
        ],
        created_at: "2024-12-19T10:00:00Z"
    },
    {
        _id: "ref4",
        order_id: 7,
        amount: 205.00,
        reason: "Payment failed — no funds taken, order voided",
        status: "FAILED",
        line_items: [
            { product_name: "Pullover Hoodie", qty: 1, refund_amount: 55.00 },
            { product_name: "Ninja Silhouette T-Shirt", qty: 1, refund_amount: 150.00 }
        ],
        created_at: "2025-01-12T10:30:00Z"
    }
];
