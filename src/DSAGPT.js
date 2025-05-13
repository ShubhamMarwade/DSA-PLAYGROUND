import React, { useState, useRef } from "react";
import { Box, TextField, IconButton, Paper, CircularProgress } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import "react-resizable/css/styles.css"; // Import necessary styles

const DSAGPT = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatWindowSize, setChatWindowSize] = useState({
    width: 320,
    height: 450
  });

  const chatWindowRef = useRef(null);
  const isResizing = useRef(false);

  const handleToggle = () => setOpen(!open);

  const startResizing = (e) => {
    isResizing.current = true;
    document.body.style.cursor = 'ew-resize';
  };

  const stopResizing = () => {
    isResizing.current = false;
    document.body.style.cursor = 'auto';
  };

  const handleMouseMove = (e) => {
    if (!isResizing.current) return;

    const newWidth = e.clientX - chatWindowRef.current.getBoundingClientRect().left;
    if (newWidth > 200 && newWidth < 600) {
      setChatWindowSize((prev) => ({
        ...prev,
        width: newWidth
      }));
    }
  };

  // Add event listeners when the window is open
  React.useEffect(() => {
    if (open) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", stopResizing);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopResizing);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopResizing);
    };
  }, [open]);

  const sendMessage = async () => {
    if (!query.trim()) return;

    const userMessage = { text: query, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setLoading(true);

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/dsa-gpt/?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Failed to fetch response");

      const data = await res.json();

      const botMessage = { 
        text: data.response, 
        sender: "bot",
        isError: data.response === "Only ask DSA-related questions."
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { text: "Server down, please try again.", sender: "bot" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <IconButton
        onClick={handleToggle}
        sx={{
          position: "fixed",
          bottom: 20,
          left: 20,
          backgroundColor: "red",
          color: "white",
          "&:hover": { backgroundColor: "#dc2626" },
        }}
      >
        <ChatIcon />
      </IconButton>

      {/* Chat Window */}
      {open && (
        <Paper
          ref={chatWindowRef}
          elevation={3}
          sx={{
            position: "fixed",
            bottom: 80,
            left: 20,
            width: chatWindowSize.width,
            height: chatWindowSize.height,
            display: "flex",
            flexDirection: "column",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          {/* Chat Header */}
          <Box sx={{ backgroundColor: "red", padding: "10px", color: "white", display: "flex", justifyContent: "space-between" }}>
            <h6 className="text-2xl font-bold text-center text-white">DSA GPT</h6>
            <IconButton size="small" sx={{ color: "white" }} onClick={handleToggle}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Chat Messages */}
          <Box sx={{ flex: 1, padding: "10px", overflowY: "auto", backgroundColor: "#f5f5f5" }}>
            {messages.map((msg, index) => (
              <Box key={index} sx={{ textAlign: msg.sender === "user" ? "right" : "left", marginBottom: "8px" }}>
                <Paper
                  sx={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    backgroundColor: msg.sender === "user" ? "red" : "#e0e0e0",
                    color: msg.sender === "user" ? "white" : "black",
                  }}
                >
                  {/* Format response with Markdown */}
                  <ReactMarkdown
                    components={{
                      code({ inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <SyntaxHighlighter style={materialDark} language={match[1]} {...props}>
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </Paper>
              </Box>
            ))}

            {/* Show loading bubble when waiting for response */}
            {loading && (
              <Box sx={{ textAlign: "left", marginTop: "8px" }}>
                <Paper
                  sx={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    backgroundColor: "#e0e0e0",
                    color: "black",
                  }}
                >
                  <CircularProgress size={20} sx={{ marginRight: "8px" }} />
                  Thinking...
                </Paper>
              </Box>
            )}
          </Box>

          {/* Input Box */}
          <Box sx={{ display: "flex", padding: "10px", borderTop: "1px solid #ddd" }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question..."
            />
            <IconButton color="primary" onClick={sendMessage}>
              <SendIcon />
            </IconButton>
          </Box>

          {/* Resize Handle (on right side) */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "10px",
              height: "100%",
              cursor: "ew-resize",
              zIndex: 10,
            }}
            onMouseDown={startResizing}
          />
        </Paper>
      )}
    </>
  );
};

export default DSAGPT;
