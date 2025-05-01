export const coupons = [
    {
        created_by: {
            first_name: "Vladislaus",
            last_name: "Draguila"
        },
        code: "BBC_SEPT_10",
        description: "10% off January to June",
        allow_free_shipping: false,
        expiry_date: new Date("2023-05-01").getTime(),
        discount_type: 'PERCENTAGE',
        coupon_amount: 9,
        type: 'PERCENTAGE',
        start_date: new Date("2023-01-01").getTime(),
        status: 'ACTIVE',
        minimum_spend: {
            amount: 100,
            currency: "GBP"
        },
        maximum_spend: {
            amount: 1000,
            currency: "GBP"
        },
        is_individual_use: true,
        exclude_sale_items: true,
        products: [],
        exclude_products: [],
        product_categories: [],
        exclude_categories: [],
        allowed_emails: [],
        usage_limit_per_coupon: 100,
        usage_per_person: 1,
        limit_usage_to_x_items: 10,
        published: true
    }
];