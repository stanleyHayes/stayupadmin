import {Chip} from "@mui/material";
import React from "react";

const statusConfig = {
    // Order statuses (full lifecycle)
    "pending":          {label: "Pending",          color: "warning"},
    "processing":       {label: "Processing",       color: "info"},
    "on-hold":          {label: "On Hold",          color: "warning"},
    "shipped":          {label: "Shipped",           color: "info"},
    "in-transit":       {label: "In Transit",        color: "info"},
    "out_for_delivery": {label: "Out for Delivery",  color: "info"},
    "delivered":        {label: "Delivered",          color: "success"},
    "completed":        {label: "Completed",         color: "success"},
    "cancelled":        {label: "Cancelled",         color: "default"},
    "refunded":         {label: "Refunded",          color: "default"},
    "failed":           {label: "Failed",            color: "error"},
    "trash":            {label: "Trash",             color: "error"},
    // Legacy variants
    "pending payment":  {label: "Pending Payment",   color: "warning"},
    "on hold":          {label: "On Hold",           color: "warning"},
    // Uppercase variants (other entities)
    "ACTIVE":           {label: "Active",            color: "success"},
    "INACTIVE":         {label: "Inactive",          color: "default"},
    "PENDING":          {label: "Pending",           color: "warning"},
    "EXPIRED":          {label: "Expired",           color: "default"},
    "UPCOMING":         {label: "Upcoming",          color: "info"},
    "SUSPENDED":        {label: "Suspended",         color: "error"},
    "DELETED":          {label: "Deleted",           color: "error"},
    "APPROVED":         {label: "Approved",          color: "success"},
    "SPAM":             {label: "Spam",              color: "error"},
    "HOLD":             {label: "Hold",              color: "warning"},
    // Lowercase variants
    "active":           {label: "Active",            color: "success"},
    "suspended":        {label: "Suspended",         color: "error"},
    "approved":         {label: "Approved",          color: "success"},
    "spam":             {label: "Spam",              color: "error"},
    "draft":            {label: "Draft",             color: "warning"},
    "published":        {label: "Published",         color: "success"},
    "archived":         {label: "Archived",          color: "default"},
};

const Status = ({status}) => {
    const cfg = statusConfig[status] || {label: status || "Unknown", color: "default"};
    return <Chip label={cfg.label} color={cfg.color} size="small" sx={{textTransform: "capitalize", fontWeight: 500}}/>;
};

export default Status;
