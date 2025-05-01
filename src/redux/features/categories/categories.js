export const categories = [
    {
        name: "",
        slug: "",
        is_sub_category: false,
        parent: null,
        description: "",
        image: {
            public_id: {
                type: String,
                required: true
            },
            secure_url: {
                type: String,
                required: true
            }
        },
        status: "ACTIVE",
        created_by: {
            first_name: "",
            last_name: ""
        }
    }
];