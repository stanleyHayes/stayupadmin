import cap from "./../../../assets/images/products/cap.jpg";
import hoodie from "./../../../assets/images/products/hoodie.jpg";
import turtle from "./../../../assets/images/products/turtle-neck.jpg";
export const products = [
    {
        sku: "CAP",
        title: "Cap",
        description: "",
        stock_quantity: 52,
        short_description: "",
        variations: {},
        image: {
            public_id: "",
            secure_url: cap
        },
        allow_back_orders: false,
        low_stock_threshold: 2,
        sold_individually: false,
        price: {
            currency: "GBP",
            amount: 55
        },
        sale: {
            status: true,
            price: {
                currency: "GBP",
                amount: 45
            },
            start_date: "",
            end_date: ""
        },
        weight: {
            unit: "g",
            amount: 15
        },
        dimensions: {
            length: {
                unit: "cm",
                amount: 20
            },
            width: {
                unit: "cm",
                amount: 20
            },
            height: {
                unit: "cm",
                amount: 30
            }
        },
        shipping: "",
        upsells: [],
        cross_sells: [],
        attributes: [],
        purchase_note: "",
        enable_reviews: true,
        categories: [
            {
                name: "",
                slug: "",
                is_sub_category: false,
                parent: true,
                description: "",
                image: {
                    secure_url: ""
                }
            }
        ],
        tags: [""],
        status: "PUBLISHED",
        visibility: 'PUBLIC',
        date_published: "",
        created_at: "",
        featured: false,
        gallery: [
            {
                public_id: "",
                secure_url: ""
            }
        ]
    },
    {
        sku: "HDEE",
        title: "Hoodie",
        description: "",
        stock_quantity: 5,
        short_description: "",
        variations: {},
        image: {
            public_id: "",
            secure_url: hoodie
        },
        allow_back_orders: false,
        low_stock_threshold: 2,
        sold_individually: false,
        price: {
            currency: "GBP",
            amount: 55
        },
        sale: {
            status: true,
            price: {
                currency: "GBP",
                amount: 45
            },
            start_date: "",
            end_date: ""
        },
        weight: {
            unit: "g",
            amount: 15
        },
        dimensions: {
            length: {
                unit: "cm",
                amount: 20
            },
            width: {
                unit: "cm",
                amount: 20
            },
            height: {
                unit: "cm",
                amount: 30
            }
        },
        shipping: {
            type: String
        },
        upsells: [],
        cross_sells: [],
        attributes: [],
        purchase_note: "",
        enable_reviews: true,
        categories: [
            {
                name: "",
                slug: "",
                is_sub_category: false,
                parent: true,
                description: "",
                image: {
                    secure_url: ""
                }
            }
        ],
        tags: [""],
        status: "PUBLISHED",
        visibility: 'PUBLIC',
        date_published: "",
        featured: true,
        gallery: [
            {
                public_id: ""
            }
        ]
    },
    {
        sku: "NJA",
        title: "Ninja Silhouette",
        description: "",
        stock_quantity: 200,
        short_description: "",
        variations: {},
        image: {
            public_id: "",
            secure_url: turtle
        },
        allow_back_orders: false,
        low_stock_threshold: 2,
        sold_individually: false,
        price: {
            currency: "GBP",
            amount: 150
        },
        sale: {
            status: true,
            price: {
                currency: "GBP",
                amount: 45
            },
            start_date: "",
            end_date: ""
        },
        weight: {
            unit: "g",
            amount: 15
        },
        dimensions: {
            length: {
                unit: "cm",
                amount: 20
            },
            width: {
                unit: "cm",
                amount: 20
            },
            height: {
                unit: "cm",
                amount: 30
            }
        },
        shipping: {
            type: String
        },
        upsells: [],
        cross_sells: [],
        attributes: [],
        purchase_note: "",
        enable_reviews: true,
        categories: [
            {
                name: "",
                slug: "",
                is_sub_category: false,
                parent: true,
                description: "",
                image: {
                    secure_url: ""
                }
            }
        ],
        tags: [""],
        status: "PUBLISHED",
        visibility: 'PUBLIC',
        date_published: "",
        featured: false,
        gallery: [
            {
                public_id: ""
            }
        ]
    },
]