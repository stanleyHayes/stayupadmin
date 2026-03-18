import Layout from "../../components/shared/layout.jsx";
import {
    Accordion, AccordionDetails, AccordionSummary, Box, Button,
    Container, Divider, Paper, Stack, Typography
} from "@mui/material";
import {ArrowBack, ExpandMore} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import React, {useState} from "react";

const faqs = [
    {
        category: "Products",
        items: [
            {
                q: "How do I add a new product?",
                a: "Navigate to Products in the sidebar and click the 'New Product' button. Fill in the product details including title, description, price, stock quantity, images, and select the appropriate category and tags."
            },
            {
                q: "How do I manage product variations?",
                a: "Product variations (sizes, colors, etc.) can be managed through the Attributes and Variations sections. First define your attributes, then create variations for each product using those attributes."
            },
            {
                q: "How do I organize products into categories?",
                a: "Go to Categories in the sidebar to create and manage categories. When creating or editing a product, you can assign it to one or more categories."
            }
        ]
    },
    {
        category: "Orders",
        items: [
            {
                q: "How do I process a new order?",
                a: "Orders appear in the Orders section of the dashboard. Click on an order to view its details, update its status (processing, shipped, delivered), and add tracking information."
            },
            {
                q: "How do I issue a refund?",
                a: "Navigate to Order Refunds and click 'New Refund'. Select the order, specify the refund amount and reason. The refund will be processed through the original payment method."
            },
            {
                q: "Can I create manual orders?",
                a: "Yes, go to Orders and click 'New Order'. You can manually enter customer details, add products, set pricing, and select the payment and shipping methods."
            }
        ]
    },
    {
        category: "Customers & Engagement",
        items: [
            {
                q: "Where can I see newsletter subscribers?",
                a: "Newsletter subscribers can be viewed and managed in the Subscribers section. You can filter by status (active, unsubscribed, bounced) and search by email."
            },
            {
                q: "How do I view contact form messages?",
                a: "Messages submitted through the website's contact form appear in the Messages section. Unread messages are highlighted, and you can filter by status and subject category."
            },
            {
                q: "How do I moderate product reviews?",
                a: "Go to Reviews in the sidebar. You can approve, mark as spam, or delete reviews. Pending reviews require approval before they appear on the website."
            }
        ]
    },
    {
        category: "Payments & Shipping",
        items: [
            {
                q: "How do I set up payment gateways?",
                a: "Go to Payment Gateways in the sidebar. You can configure supported payment methods including card payments, mobile money, cryptocurrency, and cash on delivery."
            },
            {
                q: "How do I configure shipping rates?",
                a: "Shipping can be configured through Shipping Classes and Shipping Methods. Set up different shipping zones, methods, and rates based on your delivery areas."
            },
            {
                q: "How do I manage tax rates?",
                a: "Navigate to Tax Rates to set up tax rules for different regions. You can also manage Tax Classes to group products with similar tax treatments."
            }
        ]
    },
    {
        category: "Account & Security",
        items: [
            {
                q: "How do I change my password?",
                a: "Go to More > Change Password, or navigate to Settings > Security. Enter your current password and set a new one."
            },
            {
                q: "How do I add new admin users?",
                a: "Navigate to Admins in the sidebar and click 'New Admin'. Fill in the admin's details and assign appropriate permissions."
            },
            {
                q: "How do I switch between dark and light mode?",
                a: "Go to Settings and toggle the Dark Mode switch under the Appearance section. Your preference will be saved automatically."
            }
        ]
    }
];

const FaqPage = () => {
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <Layout>
            <Box sx={{pt: 4, pb: 6}}>
                <Container maxWidth="md">
                    <Button startIcon={<ArrowBack/>} onClick={() => navigate(-1)} variant="outlined" size="small" sx={{mb: 3}}>Back</Button>

                    <Typography variant="h4" sx={{color: "text.secondary", mb: 1}}>Frequently Asked Questions</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mb: 4}}>
                        Find answers to common questions about using the admin dashboard.
                    </Typography>

                    <Divider sx={{mb: 4}}/>

                    <Stack spacing={4}>
                        {faqs.map(({category, items}) => (
                            <Box key={category}>
                                <Typography variant="subtitle1" sx={{fontWeight: 600, mb: 2, color: "text.secondary"}}>
                                    {category}
                                </Typography>
                                <Paper elevation={0} sx={{borderRadius: 1, overflow: "hidden"}}>
                                    {items.map(({q, a}, i) => {
                                        const panel = `${category}-${i}`;
                                        return (
                                            <Accordion
                                                key={panel}
                                                expanded={expanded === panel}
                                                onChange={handleChange(panel)}
                                                elevation={0}
                                                disableGutters
                                                sx={{
                                                    "&:before": {display: "none"},
                                                    borderBottom: i < items.length - 1 ? "1px solid" : "none",
                                                    borderColor: "divider"
                                                }}
                                            >
                                                <AccordionSummary expandIcon={<ExpandMore/>} sx={{px: 3}}>
                                                    <Typography variant="body2" sx={{fontWeight: 500}}>{q}</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails sx={{px: 3, pb: 2.5}}>
                                                    <Typography variant="body2" color="text.secondary" sx={{lineHeight: 1.7}}>
                                                        {a}
                                                    </Typography>
                                                </AccordionDetails>
                                            </Accordion>
                                        );
                                    })}
                                </Paper>
                            </Box>
                        ))}
                    </Stack>
                </Container>
            </Box>
        </Layout>
    );
};

export default FaqPage;
