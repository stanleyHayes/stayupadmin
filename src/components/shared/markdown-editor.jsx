import React, { useRef, useState } from "react";
import {
    Box, Button, ButtonGroup, Divider, Paper, Stack, Tab, Tabs,
    TextField, Typography
} from "@mui/material";
import {
    FormatBold, FormatItalic, FormatStrikethrough, Code,
    FormatListBulleted, FormatListNumbered, FormatQuote,
    Link as LinkIcon, Image as ImageIcon, Title, HorizontalRule
} from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ToolButton = ({ icon, title, onClick }) => (
    <Button
        size="small"
        onClick={onClick}
        title={title}
        sx={{ minWidth: 32, px: 0.5, color: "text.secondary" }}
    >
        {icon}
    </Button>
);

/**
 * Markdown editor with toolbar and live preview.
 *
 * Props:
 *   - value: string
 *   - onChange: (value: string) => void
 *   - error: boolean
 *   - helperText: string
 *   - minRows: number (default 12)
 */
const MarkdownEditor = ({ value = "", onChange, error, helperText, minRows = 12 }) => {
    const [tab, setTab] = useState(0); // 0 = write, 1 = preview
    const inputRef = useRef(null);

    const insert = (before, after = "", placeholder = "") => {
        const el = inputRef.current?.querySelector("textarea");
        if (!el) return;
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const selected = value.substring(start, end) || placeholder;
        const newValue = value.substring(0, start) + before + selected + after + value.substring(end);
        onChange(newValue);
        // Restore cursor position after React re-renders
        setTimeout(() => {
            el.focus();
            const cursorPos = start + before.length + selected.length + after.length;
            el.setSelectionRange(cursorPos, cursorPos);
        }, 0);
    };

    const wrapSelection = (wrapper) => insert(wrapper, wrapper, "text");
    const prefixLine = (prefix) => {
        const el = inputRef.current?.querySelector("textarea");
        if (!el) return;
        const start = el.selectionStart;
        // Find the start of the current line
        const lineStart = value.lastIndexOf("\n", start - 1) + 1;
        const newValue = value.substring(0, lineStart) + prefix + value.substring(lineStart);
        onChange(newValue);
    };

    const toolbar = (
        <Stack direction="row" flexWrap="wrap" sx={{ gap: 0.25 }}>
            <ButtonGroup size="small" variant="text">
                <ToolButton icon={<Title sx={{ fontSize: 18 }} />} title="Heading" onClick={() => prefixLine("## ")} />
                <ToolButton icon={<FormatBold sx={{ fontSize: 18 }} />} title="Bold" onClick={() => wrapSelection("**")} />
                <ToolButton icon={<FormatItalic sx={{ fontSize: 18 }} />} title="Italic" onClick={() => wrapSelection("_")} />
                <ToolButton icon={<FormatStrikethrough sx={{ fontSize: 18 }} />} title="Strikethrough" onClick={() => wrapSelection("~~")} />
            </ButtonGroup>
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
            <ButtonGroup size="small" variant="text">
                <ToolButton icon={<Code sx={{ fontSize: 18 }} />} title="Inline code" onClick={() => wrapSelection("`")} />
                <ToolButton icon={<FormatQuote sx={{ fontSize: 18 }} />} title="Blockquote" onClick={() => prefixLine("> ")} />
                <ToolButton icon={<HorizontalRule sx={{ fontSize: 18 }} />} title="Horizontal rule" onClick={() => insert("\n---\n")} />
            </ButtonGroup>
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
            <ButtonGroup size="small" variant="text">
                <ToolButton icon={<FormatListBulleted sx={{ fontSize: 18 }} />} title="Bullet list" onClick={() => prefixLine("- ")} />
                <ToolButton icon={<FormatListNumbered sx={{ fontSize: 18 }} />} title="Numbered list" onClick={() => prefixLine("1. ")} />
            </ButtonGroup>
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
            <ButtonGroup size="small" variant="text">
                <ToolButton icon={<LinkIcon sx={{ fontSize: 18 }} />} title="Link" onClick={() => insert("[", "](url)", "link text")} />
                <ToolButton icon={<ImageIcon sx={{ fontSize: 18 }} />} title="Image" onClick={() => insert("![", "](url)", "alt text")} />
            </ButtonGroup>
        </Stack>
    );

    return (
        <Paper variant="outlined" sx={{ overflow: "hidden" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider", px: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ minHeight: 36 }}>
                    <Tab label="Write" sx={{ minHeight: 36, textTransform: "none", fontSize: 13 }} />
                    <Tab label="Preview" sx={{ minHeight: 36, textTransform: "none", fontSize: 13 }} />
                </Tabs>
                {tab === 0 && toolbar}
            </Box>

            {tab === 0 && (
                <Box ref={inputRef}>
                    <TextField
                        fullWidth
                        multiline
                        minRows={minRows}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        error={error}
                        helperText={helperText}
                        placeholder="Write your content in Markdown..."
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 1,
                                "& fieldset": { border: "none" },
                            },
                            "& textarea": {
                                fontFamily: "'GoogleSans', monospace",
                                fontSize: 14,
                                lineHeight: 1.7,
                            }
                        }}
                    />
                </Box>
            )}

            {tab === 1 && (
                <Box sx={{ p: 3, minHeight: minRows * 24, overflow: "auto" }}>
                    {value ? (
                        <Box
                            sx={{
                                "& h1": { fontSize: 28, fontWeight: 700, mt: 3, mb: 1 },
                                "& h2": { fontSize: 22, fontWeight: 700, mt: 2.5, mb: 1 },
                                "& h3": { fontSize: 18, fontWeight: 600, mt: 2, mb: 0.5 },
                                "& p": { fontSize: 14, lineHeight: 1.8, mb: 1.5 },
                                "& ul, & ol": { pl: 3, mb: 1.5 },
                                "& li": { fontSize: 14, lineHeight: 1.8, mb: 0.5 },
                                "& blockquote": {
                                    borderLeft: 3, borderColor: "secondary.main",
                                    pl: 2, ml: 0, my: 1.5, color: "text.secondary", fontStyle: "italic"
                                },
                                "& code": {
                                    backgroundColor: "action.hover", px: 0.5, py: 0.25,
                                    borderRadius: 1, fontSize: 13, fontFamily: "monospace"
                                },
                                "& pre": {
                                    backgroundColor: "action.hover", p: 2, borderRadius: 1,
                                    overflow: "auto", mb: 1.5,
                                    "& code": { backgroundColor: "transparent", p: 0 }
                                },
                                "& img": { maxWidth: "100%", borderRadius: 1 },
                                "& a": { color: "secondary.main" },
                                "& hr": { my: 2, border: "none", borderTop: 1, borderColor: "divider" },
                                "& table": { width: "100%", borderCollapse: "collapse", mb: 1.5 },
                                "& th, & td": {
                                    border: 1, borderColor: "divider", px: 1.5, py: 0.75,
                                    fontSize: 13, textAlign: "left"
                                },
                                "& th": { fontWeight: 600, backgroundColor: "action.hover" },
                            }}
                        >
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
                        </Box>
                    ) : (
                        <Typography variant="body2" color="text.secondary">Nothing to preview</Typography>
                    )}
                </Box>
            )}
        </Paper>
    );
};

export default MarkdownEditor;
