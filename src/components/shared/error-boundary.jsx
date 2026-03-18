import React from "react";
import { Alert, AlertTitle, Box, Button, Container, Stack, Typography } from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box sx={{ py: 6, px: 2 }}>
                    <Container maxWidth="sm">
                        <Stack alignItems="center" spacing={2}>
                            <ErrorOutline sx={{ fontSize: 48, color: "text.red" }} />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>Something went wrong</Typography>
                            <Typography variant="body2" color="text.secondary" align="center">
                                An unexpected error occurred while rendering this section.
                            </Typography>
                            {this.state.error && (
                                <Alert severity="error" sx={{ width: "100%", mt: 1 }}>
                                    <AlertTitle>Error Details</AlertTitle>
                                    <Typography variant="caption" sx={{ fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                                        {this.state.error.message || String(this.state.error)}
                                    </Typography>
                                </Alert>
                            )}
                            <Button
                                variant="outlined"
                                color="secondary"
                                size="small"
                                onClick={() => this.setState({ hasError: false, error: null })}
                            >
                                Try Again
                            </Button>
                        </Stack>
                    </Container>
                </Box>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
