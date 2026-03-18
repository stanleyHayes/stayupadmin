import {Avatar, Link as MUILink, Stack, TableCell, TableRow, Tooltip, Typography} from "@mui/material";
import React, {useState} from "react";
import {DeleteForeverOutlined, EditOutlined, Verified, VisibilityOutlined} from "@mui/icons-material";
import {Link} from "react-router-dom";
import ConfirmDialog from "./confirm-dialog.jsx";
import CustomerQuickView from "./customer-quick-view.jsx";
import {motion} from "framer-motion";

const resolveName = (c) => c?.display_name || c?.name || (c?.first_name ? `${c.first_name} ${c.last_name || ""}`.trim() : c?.email || "—");

const Customer = ({customer, index}) => {
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openQuickViewDialog, setOpenQuickViewDialog] = useState(false);
    const name = resolveName(customer);

    return (
        <React.Fragment>
            <TableRow
                component={motion.tr}
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.3, delay: Math.min(index * 0.04, 0.5), ease: "easeOut"}}
                sx={{"&:hover": {backgroundColor: "action.hover"}}}
            >
                <TableCell>
                    <Link to={`/customers/${customer._id}`} style={{textDecoration: "none"}}>
                        <Typography variant="body2" component="span" sx={{color: "text.secondary"}}>{index + 1}</Typography>
                    </Link>
                </TableCell>
                <TableCell>
                    <Link to={`/customers/${customer._id}`} style={{textDecoration: "none"}}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar src={customer.avatar_url || customer.image} sx={{width: 32, height: 32}}/>
                            <Stack>
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    <Typography variant="body2" sx={{color: "text.primary", fontWeight: 500}}>{name}</Typography>
                                    {customer.is_verified && <Verified sx={{fontSize: 12, color: "secondary.main"}}/>}
                                </Stack>
                                {customer.email && <Typography variant="caption" color="text.secondary">{customer.email}</Typography>}
                            </Stack>
                        </Stack>
                    </Link>
                </TableCell>
                <TableCell>
                    <MUILink href={`tel:${customer.phone}`} sx={{textDecoration: "none"}}>
                        <Typography variant="body2" sx={{color: "text.primary"}}>{customer.phone || "—"}</Typography>
                    </MUILink>
                </TableCell>
                <TableCell>
                    <Typography variant="body2" sx={{color: "text.secondary"}}>
                        {customer.username ? `@${customer.username.toLowerCase()}` : "—"}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Stack direction="row" justifyContent="flex-start" spacing={1} alignItems="center">
                        <Tooltip title="View">
                            <VisibilityOutlined
                                onClick={() => setOpenQuickViewDialog(true)}
                                sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 1, borderColor: "light.green", color: "text.green", backgroundColor: "light.green", cursor: "pointer", transition: "all 0.2s ease", "&:hover": {transform: "scale(1.15)"}}}
                            />
                        </Tooltip>
                        <Tooltip title="Edit">
                            <Link to={`/customers/${customer._id}/update`} style={{textDecoration: "none"}}>
                                <EditOutlined sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 1, borderColor: "light.secondary", color: "secondary.main", backgroundColor: "light.secondary", cursor: "pointer"}}/>
                            </Link>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <DeleteForeverOutlined
                                onClick={() => setOpenConfirmDialog(true)}
                                sx={{padding: 0.4, fontSize: 28, borderWidth: 1, borderStyle: "solid", borderRadius: 1, borderColor: "light.red", color: "text.red", backgroundColor: "light.red", cursor: "pointer", transition: "all 0.2s ease", "&:hover": {transform: "scale(1.15)"}}}
                            />
                        </Tooltip>
                    </Stack>
                </TableCell>
            </TableRow>

            {openConfirmDialog && (
                <ConfirmDialog
                    open={openConfirmDialog}
                    handleClose={() => setOpenConfirmDialog(false)}
                    message={`Are you sure you want to delete customer ${name}?`}
                    handleDelete={() => setOpenConfirmDialog(true)}
                />
            )}

            {openQuickViewDialog && (
                <CustomerQuickView
                    customer={customer}
                    open={openQuickViewDialog}
                    handleClose={() => setOpenQuickViewDialog(false)}
                />
            )}
        </React.Fragment>
    )
}

export default Customer;
