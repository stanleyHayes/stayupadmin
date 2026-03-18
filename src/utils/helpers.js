/**
 * Extract the primary image URL from a product.
 *
 * Backend returns:
 *   - images: [{ name, src, alt }] with virtuals url/secure_url
 *   - thumbnail (virtual): first image src
 *
 * Legacy seed data used:
 *   - image: { secure_url, url }
 *   - image: "string url"
 */
export const productImageUrl = (product) => {
    if (!product) return "";
    // Backend virtual field
    if (product.thumbnail) return product.thumbnail;
    // Backend images array
    if (Array.isArray(product.images) && product.images.length > 0) {
        const img = product.images[0];
        return img.secure_url || img.url || img.src || "";
    }
    // Legacy single image object
    if (product.image) {
        if (typeof product.image === "string") return product.image;
        return product.image.secure_url || product.image.url || product.image.src || "";
    }
    return "";
};

/**
 * Extract the customer display name from various shapes.
 * Works for: string, { name }, { display_name }, { first_name, last_name }, { email }
 */
export const displayName = (obj) => {
    if (!obj) return "—";
    if (typeof obj === "string") return obj;
    return obj.display_name || obj.name || (obj.first_name ? `${obj.first_name} ${obj.last_name || ""}`.trim() : null) || obj.email || "—";
};

/**
 * Format a date from any of the backend's date field names.
 */
export const resolveDate = (obj, ...fields) => {
    for (const f of fields) {
        if (obj[f]) return obj[f];
    }
    return obj.date_created || obj.created_at || obj.createdAt || null;
};
