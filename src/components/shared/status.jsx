import {Chip} from "@mui/material";
import React from "react";

const statusConfig = {
    "completed":        {label: "Completed",       color: "success"},
    "processing":       {label: "Processing",      color: "info"},
    "pending payment":  {label: "Pending Payment", color: "warning"},
    "on hold":          {label: "On Hold",          color: "warning"},
    "refunded":         {label: "Refunded",         color: "default"},
    "cancelled":        {label: "Cancelled",        color: "default"},
    "failed":           {label: "Failed",           color: "error"},
    // uppercase variants (for other entities)
    "ACTIVE":           {label: "Active",           color: "success"},
    "INACTIVE":         {label: "Inactive",         color: "default"},
    "PENDING":          {label: "Pending",          color: "warning"},
    "EXPIRED":          {label: "Expired",          color: "default"},
    "UPCOMING":         {label: "Upcoming",         color: "info"},
    "SUSPENDED":        {label: "Suspended",        color: "error"},
    "DELETED":          {label: "Deleted",          color: "error"},
    "APPROVED":         {label: "Approved",         color: "success"},
    "SPAM":             {label: "Spam",             color: "error"},
    "HOLD":             {label: "Hold",             color: "warning"},
};

const Status = ({status}) => {
    const cfg = statusConfig[status] || {label: status || "Unknown", color: "default"};
    return <Chip label={cfg.label} color={cfg.color} size="small"/>;
};

export default Status;