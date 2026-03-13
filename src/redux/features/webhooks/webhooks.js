export const webhooks = [
    {
        _id: "wh1",
        name: "New Order Notifier",
        status: "active",
        topic: "order.created",
        delivery_url: "https://hooks.example.com/order-created",
        secret: "whsec_abc123xyz",
        date_created: "2024-01-05T08:00:00Z"
    },
    {
        _id: "wh2",
        name: "Order Update Sync",
        status: "paused",
        topic: "order.updated",
        delivery_url: "https://hooks.example.com/order-updated",
        secret: "whsec_def456uvw",
        date_created: "2024-02-12T10:30:00Z"
    },
    {
        _id: "wh3",
        name: "Product Catalog Sync",
        status: "active",
        topic: "product.created",
        delivery_url: "https://hooks.example.com/product-created",
        secret: "whsec_ghi789rst",
        date_created: "2024-03-08T14:00:00Z"
    }
];
