import {Button} from "@mui/material";
import {blue, green, grey, orange, red} from "@mui/material/colors";
import React from "react";

const Status = ({status}) => {
    const renderStatus = status => {
        switch (status) {
            case 'completed':
                return (
                    <Button
                        disableElevation={true}
                        fullWidth={true}
                        variant="contained"
                        size="small"
                        sx={{color: blue[800], backgroundColor: blue[200]}}>
                        Cancelled
                    </Button>
                )


            case 'cancelled':
                return (
                    <Button
                        disableElevation={true}
                        fullWidth={true}
                        variant="contained"
                        size="small"
                        sx={{color: grey[800], backgroundColor: grey[200]}}>
                        Cancelled
                    </Button>
                )


            case 'failed':
                return (
                    <Button
                        disableElevation={true}
                        fullWidth={true}
                        variant="contained"
                        size="small"
                        sx={{color: red[800], backgroundColor: red[200]}}>
                        Failed
                    </Button>
                )


            case 'on hold':
                return (
                    <Button
                        disableElevation={true}
                        fullWidth={true}
                        variant="contained"
                        size="small"
                        sx={{color: orange[800], backgroundColor: orange[200]}}>
                        On Hold
                    </Button>
                )

            case 'pending payment':
                return (
                    <Button
                        disableElevation={true}
                        fullWidth={true}
                        variant="contained"
                        size="small"
                        sx={{color: grey[800], backgroundColor: grey[200]}}>
                        Pending Payment
                    </Button>
                )

            case 'processing':
                return (
                    <Button
                        disableElevation={true}
                        fullWidth={true}
                        variant="contained"
                        size="small"
                        sx={{color: green[800], backgroundColor: green[200]}}>
                        Processing
                    </Button>
                )

            case 'refunded':
                return (
                    <Button
                        disableElevation={true}
                        fullWidth={true}
                        variant="contained"
                        size="small"
                        sx={{color: grey[800], backgroundColor: grey[200]}}>
                        Refunded
                    </Button>
                )

            default:
                return (
                    <Button
                        disableElevation={true}
                        fullWidth={true}
                        variant="contained"
                        size="small"
                        sx={{color: green[800], backgroundColor: green[200]}}>
                        Processing
                    </Button>
                )
        }
    }

    return (
        renderStatus(status)
    )
}

export default Status;