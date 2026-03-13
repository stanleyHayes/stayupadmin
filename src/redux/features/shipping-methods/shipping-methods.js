export const shippingMethods = [
    {
        _id: "sm1",
        title: "Flat Rate",
        description: "Charge a fixed rate for shipping.",
        enabled: true,
        method_id: "flat_rate",
        settings: {
            cost: { value: "5.99", label: "Cost" },
            tax_status: { value: "taxable", label: "Tax Status" }
        }
    },
    {
        _id: "sm2",
        title: "Free Shipping",
        description: "Free shipping is a special method which can be triggered with coupons.",
        enabled: true,
        method_id: "free_shipping",
        settings: {
            cost: { value: "0.00", label: "Cost" },
            requires: { value: "coupon", label: "Free shipping requires" },
            min_amount: { value: "50.00", label: "Minimum order amount" }
        }
    },
    {
        _id: "sm3",
        title: "Local Pickup",
        description: "Allow customers to pick up orders themselves.",
        enabled: true,
        method_id: "local_pickup",
        settings: {
            cost: { value: "0.00", label: "Cost" },
            tax_status: { value: "taxable", label: "Tax Status" }
        }
    },
    {
        _id: "sm4",
        title: "Express Flat Rate",
        description: "Charge a higher fixed rate for express shipping.",
        enabled: false,
        method_id: "flat_rate",
        settings: {
            cost: { value: "14.99", label: "Cost" },
            tax_status: { value: "taxable", label: "Tax Status" }
        }
    }
];
