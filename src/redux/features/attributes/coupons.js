export const coupons = [
    {
        createdBy: {},
        code: "",
        description: "",
        allowFreeShipping: {},
        expiryDate: {},
        discountType: {
            type: String,
            enum: ['PERCENTAGE', 'FIXED_CART', 'FIXED_PRODUCT']
        },
        couponAmount: {},
        type: {
            type: String,
            enum: ['FLAT', 'PERCENTAGE']
        },
        amount: {},
        inclusions: {},
        exclusions: {},
        startDate: {},
        status: {},
        minimumSpend: {},
        maximumSpend: {},
        isIndividualUse: {},
        excludeSaleItems: {},
        products: [],
        excludeProducts: [],
        productCategories: [],
        excludeCategories: [],
        allowedEmails: [],
        usageLimit: {},
        usagePerPerson: {},
        limitToXItems: {},
        published: {}
    }
];