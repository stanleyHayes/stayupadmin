import Layout from "../../components/shared/layout.jsx";
import {
    Alert, AlertTitle, Box, Button, Card, CardContent, CardMedia, Chip,
    Container, Divider, FormControl, Grid, InputLabel, LinearProgress,
    MenuItem, Select, Stack, Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import React, {useMemo, useState} from "react";
import {DatePicker} from "@mui/x-date-pickers";
import moment from "moment";
import {useSelector} from "react-redux";
import Empty from "../../components/shared/empty.jsx";
import {motion} from "framer-motion";
import {
    Close, InventoryOutlined, StarOutlined, WarningAmberOutlined,
    RemoveShoppingCartOutlined, EditOutlined, VisibilityOutlined,
    Star, LocalOfferOutlined
} from "@mui/icons-material";
import PageHeader from "../../components/shared/page-header.jsx";
import KPIBox from "../../components/shared/kpi-box.jsx";
import {selectProducts} from "../../redux/features/products/products-slice";

const stockBadge = (status) => {
    if (status === "instock") return {label: "In Stock", color: "#22C55E", bg: "#DCFCE7"};
    if (status === "lowstock") return {label: "Low Stock", color: "#F59E0B", bg: "#FEF3C7"};
    return {label: "Out of Stock", color: "#EF4444", bg: "#FEE2E2"};
};

const ProductCard = ({product, index}) => {
    const stock = stockBadge(product.stock_status);
    const imgUrl = product.image?.secure_url || product.image?.url || "";
    const hasDiscount = product.on_sale && product.sale_price && product.sale_price < product.price?.amount;
    const discountPercent = hasDiscount
        ? Math.round(((product.price.amount - product.sale_price) / product.price.amount) * 100)
        : 0;

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.4, delay: Math.min(index * 0.05, 0.6), ease: [0.25, 0.46, 0.45, 0.94]}}
            style={{height: "100%"}}
        >
            <Card elevation={0} sx={{
                height: "100%", display: "flex", flexDirection: "column",
                border: "1px solid", borderColor: "divider", overflow: "hidden",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                    borderColor: "secondary.main",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                    transform: "translateY(-4px)",
                    "& .product-img": {transform: "scale(1.05)"},
                },
            }}>
                {/* Image */}
                <Box sx={{position: "relative", overflow: "hidden", backgroundColor: "background.default"}}>
                    <CardMedia
                        className="product-img"
                        component="img"
                        image={imgUrl}
                        alt={product.title}
                        sx={{
                            height: 220, objectFit: "cover",
                            transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                    />
                    {/* Badges */}
                    <Stack direction="row" spacing={0.75} sx={{position: "absolute", top: 10, left: 10}}>
                        {product.featured && (
                            <Chip
                                icon={<Star sx={{fontSize: 14, color: "#F59E0B !important"}}/>}
                                label="Featured"
                                size="small"
                                sx={{
                                    height: 24, fontSize: 11, fontWeight: 700,
                                    backgroundColor: "rgba(245,158,11,0.15)",
                                    backdropFilter: "blur(8px)",
                                    color: "#F59E0B", border: "1px solid rgba(245,158,11,0.3)",
                                }}
                            />
                        )}
                        {hasDiscount && (
                            <Chip
                                label={`-${discountPercent}%`}
                                size="small"
                                sx={{
                                    height: 24, fontSize: 11, fontWeight: 700,
                                    backgroundColor: "rgba(239,68,68,0.15)",
                                    backdropFilter: "blur(8px)",
                                    color: "#EF4444", border: "1px solid rgba(239,68,68,0.3)",
                                }}
                            />
                        )}
                    </Stack>
                    <Chip
                        label={stock.label}
                        size="small"
                        sx={{
                            position: "absolute", top: 10, right: 10,
                            height: 24, fontSize: 11, fontWeight: 700,
                            backgroundColor: `${stock.bg}E6`,
                            backdropFilter: "blur(8px)",
                            color: stock.color, border: `1px solid ${stock.color}30`,
                        }}
                    />
                </Box>

                {/* Content */}
                <CardContent sx={{flex: 1, display: "flex", flexDirection: "column", p: 2.5, pb: 1.5}}>
                    {/* Category */}
                    {product.categories?.[0] && (
                        <Typography variant="caption" sx={{
                            color: "secondary.main", fontWeight: 600, fontSize: 10,
                            textTransform: "uppercase", letterSpacing: 1, mb: 0.5
                        }}>
                            {product.categories[0].name}
                        </Typography>
                    )}

                    {/* Title */}
                    <Typography variant="subtitle1" sx={{
                        fontWeight: 600, lineHeight: 1.3, mb: 0.75,
                        display: "-webkit-box", WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>
                        {product.title}
                    </Typography>

                    {/* Description */}
                    <Typography variant="caption" color="text.secondary" sx={{
                        mb: 1.5, lineHeight: 1.5, flex: 1,
                        display: "-webkit-box", WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>
                        {product.short_description || product.description}
                    </Typography>

                    {/* Price & SKU */}
                    <Stack direction="row" alignItems="baseline" spacing={1} sx={{mb: 1}}>
                        {hasDiscount ? (
                            <>
                                <Typography sx={{fontFamily: "'Inconsolata', monospace", fontWeight: 800, fontSize: 20, color: "text.primary"}}>
                                    £{product.sale_price}
                                </Typography>
                                <Typography sx={{fontFamily: "'Inconsolata', monospace", fontWeight: 500, fontSize: 14, color: "text.secondary", textDecoration: "line-through"}}>
                                    £{product.price?.amount}
                                </Typography>
                            </>
                        ) : (
                            <Typography sx={{fontFamily: "'Inconsolata', monospace", fontWeight: 800, fontSize: 20, color: "text.primary"}}>
                                £{product.price?.amount}
                            </Typography>
                        )}
                    </Stack>

                    {/* Meta row */}
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="caption" color="text.secondary" sx={{fontFamily: "'Inconsolata', monospace", fontSize: 11}}>
                                {product.sku}
                            </Typography>
                            {product.manage_stock && (
                                <>
                                    <Box sx={{width: 3, height: 3, borderRadius: 0, backgroundColor: "text.secondary"}}/>
                                    <Typography variant="caption" color="text.secondary" sx={{fontSize: 11}}>
                                        {product.stock_quantity} in stock
                                    </Typography>
                                </>
                            )}
                        </Stack>
                    </Stack>
                </CardContent>

                {/* Actions */}
                <Stack direction="row" spacing={1} sx={{px: 2.5, pb: 2, pt: 0.5}}>
                    <Link to={`/products/${product._id || product.sku}`} style={{textDecoration: "none", flex: 1}}>
                        <Button size="small" variant="outlined" color="secondary" fullWidth startIcon={<VisibilityOutlined sx={{fontSize: 16}}/>}>
                            View
                        </Button>
                    </Link>
                    <Link to={`/products/${product._id || product.sku}/update`} style={{textDecoration: "none", flex: 1}}>
                        <Button size="small" variant="contained" color="secondary" fullWidth startIcon={<EditOutlined sx={{fontSize: 16}}/>}>
                            Edit
                        </Button>
                    </Link>
                </Stack>
            </Card>
        </motion.div>
    );
};

const ProductsPage = () => {
    const [query, setQuery] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("all");

    const {products = [], productLoading = false, productError = null} = useSelector(selectProducts);

    const totalProducts = products?.length || 0;
    const featuredProducts = products?.filter(p => p.featured).length || 0;
    const lowStockProducts = products?.filter(p => p.stock_status === "lowstock").length || 0;
    const outOfStockProducts = products?.filter(p => p.stock_status === "outofstock").length || 0;

    const filteredProducts = useMemo(() => {
        if (!Array.isArray(products)) return [];
        const q = query.trim().toLowerCase();
        return products.filter(p => {
            if (selectedCategory && selectedCategory !== "all") {
                if (selectedCategory === "featured" && !p.featured) return false;
                if (selectedCategory === "low_stock" && p.stock_status !== "lowstock") return false;
                if (selectedCategory === "out_of_stock" && p.stock_status !== "outofstock") return false;
            }
            if (p.created_at) {
                const d = moment(p.created_at);
                if (startDate && d.isBefore(moment(startDate).startOf("day"))) return false;
                if (endDate && d.isAfter(moment(endDate).endOf("day"))) return false;
            }
            if (!q) return true;
            return [p.title, p.sku, p.short_description, p.description].join(" ").toLowerCase().includes(q);
        });
    }, [products, query, selectedCategory, startDate, endDate]);

    return (
        <Layout>
            {productLoading && <LinearProgress variant="query" color="secondary"/>}
            <Box sx={{pt: 4, pb: 6}}>
                {productError && (
                    <Alert severity="error" sx={{mb: 2}}>
                        <AlertTitle>{productError}</AlertTitle>
                    </Alert>
                )}

                <Container>
                    <PageHeader
                        title="Products"
                        query={query}
                        onQueryChange={setQuery}
                        searchPlaceholder="Search products..."
                        action={
                            <Link to="/product/new" style={{textDecoration: "none"}}>
                                <Button size="small" color="secondary" variant="contained">Add Product</Button>
                            </Link>
                        }
                    />
                    <Divider variant="fullWidth" sx={{my: 3}}/>

                    {/* KPIs */}
                    <Grid container spacing={2} sx={{mb: 3}}>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Total Products" value={totalProducts} icon={<InventoryOutlined fontSize="small"/>} iconColor="secondary.main" iconBg="light.secondary" trend={10}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Featured" value={featuredProducts} icon={<StarOutlined fontSize="small"/>} iconColor="text.yellow" iconBg="light.yellow" trend={5}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Low Stock" value={lowStockProducts} icon={<WarningAmberOutlined fontSize="small"/>} iconColor="text.orange" iconBg="light.orange" trend={-2}/>
                        </Grid>
                        <Grid size={{xs: 6, sm: 3}}>
                            <KPIBox label="Out of Stock" value={outOfStockProducts} icon={<RemoveShoppingCartOutlined fontSize="small"/>} iconColor="text.red" iconBg="light.red"/>
                        </Grid>
                    </Grid>

                    {/* Filters */}
                    <Stack direction={{xs: "column", md: "row"}} spacing={2} alignItems={{xs: "stretch", md: "center"}} sx={{mb: 3}}>
                        <DatePicker
                            slotProps={{textField: {size: "small", sx: {minWidth: 150}}}}
                            value={startDate}
                            onChange={date => setStartDate(date)}
                            disableFuture
                            label="Start Date"
                        />
                        <DatePicker
                            slotProps={{textField: {size: "small", sx: {minWidth: 150}}}}
                            value={endDate}
                            onChange={date => setEndDate(date)}
                            disableFuture
                            label="End Date"
                        />
                        <FormControl size="small" sx={{minWidth: 150}}>
                            <InputLabel>Category</InputLabel>
                            <Select onChange={e => setSelectedCategory(e.target.value)} value={selectedCategory} label="Category">
                                <MenuItem value="all">All Products</MenuItem>
                                <MenuItem value="featured">Featured</MenuItem>
                                <MenuItem value="low_stock">Low Stock</MenuItem>
                                <MenuItem value="out_of_stock">Out of Stock</MenuItem>
                            </Select>
                        </FormControl>
                        {(startDate || endDate || selectedCategory !== "all") && (
                            <Button
                                size="small"
                                variant="outlined"
                                color="inherit"
                                onClick={() => { setStartDate(null); setEndDate(null); setSelectedCategory("all"); }}
                            >
                                Clear Filters
                            </Button>
                        )}
                    </Stack>

                    <Divider sx={{mb: 3}}/>

                    {/* Results count */}
                    <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                        Showing {filteredProducts.length} of {totalProducts} products
                    </Typography>

                    {/* Product Cards */}
                    {filteredProducts.length === 0 ? (
                        <Empty
                            icon={
                                <Box component={motion.div} exit={{}}>
                                    <Close sx={{
                                        padding: 1, fontSize: 36, borderWidth: 1, borderStyle: "solid",
                                        borderRadius: 0, borderColor: "light.secondary",
                                        color: "secondary.main", backgroundColor: "light.secondary",
                                    }}/>
                                </Box>
                            }
                            title="No Products Found"
                            message="Try adjusting your search or filters"
                            button={
                                <Link to="/product/new" style={{textDecoration: "none"}}>
                                    <Button size="small" color="secondary" variant="contained">
                                        Create Product
                                    </Button>
                                </Link>
                            }
                        />
                    ) : (
                        <Grid container spacing={2.5}>
                            {filteredProducts.map((product, index) => (
                                <Grid key={product._id || product.sku || index} size={{xs: 12, sm: 6, md: 4, lg: 3}}>
                                    <ProductCard product={product} index={index}/>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Container>
            </Box>
        </Layout>
    );
};

export default ProductsPage;
