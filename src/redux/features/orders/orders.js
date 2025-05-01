import profile from "./../../../assets/images/profile.jpg";

export const orders = [
    {
        _id: 1,
        number: '#9D',
        createdAt: '07-29-2020',
        status: 'completed',
        billing: {
            address: 'Zoe Tamayo, Patterson-Fletcher, 2349 Court Street, Old Monroe, MD 63369',
            method: 'PayPal'
        },
        total: {
            amount: 50,
            currency: 'GBP'
        },
        customer: {
            name: 'Inigo Lopez',
            image: '',
            _id: '12345'
        },
        orderItems: [
            {
                product: {
                    title: "Cap",
                    image: "",
                    price: {
                        amount: 20,
                        currency: "GPB"
                    }
                },
                quantity: 3
            },
            {
                product: {
                    title: "Belt",
                    image: "",
                    price: {
                        amount: 50,
                        currency: "GPB"
                    }
                },
                quantity: 2
            },
            {
                product: {
                    title: "Trousers",
                    image: "",
                    price: {
                        amount: 100,
                        currency: "GPB"
                    }
                },
                quantity: 1
            }
        ]
    },
    {
        _id: 2,
        number: '#8D',
        createdAt: '07-25-2020',
        status: 'pending payment',
        billing: {
            address: 'Megan Harrison, Patterson-Fletcher, 47 City Walls Rd, Clifton Upon Teme, WR6 6NG, United Kingdom (UK)',
            method: 'PayPal'
        },
        total: {
            amount: 70,
            currency: 'GBP'
        },
        customer: {
            name: 'Vladislaus Draguila',
            image: profile,
            _id: '23456'
        },
        orderItems: [
            {
                product: {
                    name: "Cap",
                    image: "",
                    price: {
                        amount: 20,
                        currency: "GPB"
                    }
                },
                quantity: 3
            },
            {
                product: {
                    name: "Trousers",
                    image: "",
                    price: {
                        amount: 100,
                        currency: "GPB"
                    }
                },
                quantity: 1
            }
        ]
    }
];