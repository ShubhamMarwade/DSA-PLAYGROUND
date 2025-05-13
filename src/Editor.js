import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import Editor from "@monaco-editor/react";

const socket = io("http://localhost:5000");

const Editor1 = () => {
  const [roomId, setRoomId] = useState("");
  const [code, setCode] = useState("// Start coding...");
  const [language, setLanguage] = useState("javascript");
  const [role, setRole] = useState(null);
  const [output, setOutput] = useState("");
  const [isInRoom, setIsInRoom] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [theme, setTheme] = useState("light");
  const [isCompiling, setIsCompiling] = useState(false);


  const editorRef = useRef(null);


  useEffect(() => {
    if (!roomId) return;

    socket.emit("joinRoom", roomId);

    socket.on("roleAssigned", ({ role }) => setRole(role));
    socket.on("codeUpdate", (newCode) => setCode(newCode));
    socket.on("languageUpdate", (newLang) => setLanguage(newLang));
    socket.on("compileResult", (result) => {setOutput(result.output || "No output."); setIsCompiling(false);});
    socket.on("requestSync", ({ requesterId }) => {
      socket.emit("syncState", {
        targetId: requesterId,
        code,
        language,
      });
    });

    socket.on("receiveMessage", ({ sender, message }) => {
      setMessages((prev) => [...prev, { sender, message }]);
    });
  
  

    return () => socket.disconnect();
  }, [roomId]);

  const handleEditorChange = (value) => {
    setCode(value);
    socket.emit("codeChange", { roomId, code: value });
  };


  const handleCompile = () => {
    setIsCompiling(true);
    socket.emit("compileCode", { roomId, language, code, input });
  };

  const sendMessage = () => {
    if (chatInput.trim()) {
      socket.emit("chatMessage", {
        roomId,
        sender: role || "User",
        message: chatInput,
      });
      
      setChatInput("");
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
        fontFamily: "Arial, sans-serif",
        
        
      }}
    >
      {!isInRoom ? (
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            width: "320px",
            background: "#fff",
          }}
        >
          <h1 className="text-3xl font-bold text-red-600 mb-5">
            DUO CODE EDITOR
          </h1>
  
          <button
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginBottom: "15px",
            }}
            onClick={() => {
              const newRoomId = uuidv4();
              setRoomId(newRoomId);
              setIsInRoom(true);
            }}
          >
            Create Room
          </button>
  
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
  
          <button
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              backgroundColor: "#008CBA",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => roomId.trim() && setIsInRoom(true)}
          >
            Join Room
          </button>
        </div>
      ) : (
        <div style={{ width: "95%", maxWidth: "1500px" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <h1 className="text-3xl font-bold text-red-600">DUO CODE EDITOR</h1>
          </div>

          {/* Room Info & Controls */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px",
            borderRadius: "5px",
            background: "#f5f5f5",
            marginBottom: "20px",
            boxShadow: "0 2px 4px rgb(255, 0, 0)",
          }}
        >
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid gray",
            }}
          >
            <option value="javascript">JavaScript</option>
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>

          <span>
            <strong>Room ID:</strong> {roomId}
          </span>

          <span>
            <strong>Role:</strong> {role}
          </span>

          <button
            onClick={toggleTheme}
            style={{
              padding: "8px 12px",
              borderRadius: "5px",
              background: "#222",
              color: "white",
              cursor: "pointer",
            }}
          >
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </div>

  
          {/* Main Layout: Editor, Input/Output, and Chat Box Side by Side */}
          <div style={{ display: "flex", gap: "20px" }}>
            {/* Code Editor */}
            <div style={{ flex: "3", border: "2px solid green", borderRadius: "0px", height: "470px" , padding: "5px" }}>
              <Editor
                height="450px"
                defaultLanguage={language}
                language={language}
                value={code}
                onChange={handleEditorChange}
                onMount={(editor) => {
                  editorRef.current = editor;
                  setTimeout(() => editor.layout(), 100);
                }}
                theme={theme === "dark" ? "vs-dark" : "vs-light"}
              />
            </div>
  
            {/* Input / Output Section */}
            <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "10px" , height: "450px"}}>
              <label><strong>Input:</strong></label>
              <textarea
                rows="4"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ width: "100%", padding: "5px", borderRadius: "5px", border: "1px solid gray" }}
              />
  
              <button
                onClick={handleCompile}
                style={{
                  padding: "8px 12px",
                  background: "#007bff",
                  color: "white",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                ▶️ Run Code
              </button>
  
              <label><strong>Output:</strong></label>
              {isCompiling ? <p>Processing...</p> :<pre style={{ background: "#f0f0f0", padding: "10px", minHeight: "100px", borderRadius: "5px", overflowX: "auto", border: "1px solid gray" }}>
                {output}
              </pre>}
            </div>
  
            {/* Chat Section */}
            <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "10px", border: "1px solid #ccc", borderRadius: "5px", padding: "10px", background: "#fafafa", height: "450px" }}>
              <h3>💬 Chat Box</h3>
              <div style={{ height: "350px", overflowY: "auto", padding: "10px", background: "#fff", border: "1px solid gray", borderRadius: "5px" }}>
              {messages.map((msg, idx) => (
                <p key={idx}><strong>{msg.sender}:</strong> {msg.message}</p>
              ))}
              </div>
  
              <input 
                type="text" 
                placeholder="Type a message..." 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)} 
                style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid gray" }}
              />
  
              <button
                onClick={sendMessage}
                style={{
                  padding: "8px 12px",
                  background: "#28a745",
                  color: "white",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
  
  export default Editor1;