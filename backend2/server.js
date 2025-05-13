const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const axios = require("axios");
require("dotenv").config(); // Load .env variables

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }

    rooms[roomId].push(socket.id);

    // Assign roles based on join order
    let role = "viewer";
    if (rooms[roomId].length === 1) {
      role = "primary";
    } else if (rooms[roomId].length === 2) {
      role = "secondary";
    }

    socket.emit("roleAssigned", { role });

    // Ask for sync if joining later
    if (rooms[roomId].length > 1) {
      const primarySocketId = rooms[roomId][0];
      io.to(primarySocketId).emit("requestSync", { requesterId: socket.id });
    }
  });

  socket.on("codeChange", ({ roomId, code }) => {
    io.to(roomId).emit("codeUpdate", code);
  });

  socket.on("languageChange", ({ roomId, language }) => {
    io.to(roomId).emit("languageUpdate", language);
  });

  socket.on("syncState", ({ targetId, code, language }) => {
    io.to(targetId).emit("codeUpdate", code);
    io.to(targetId).emit("languageUpdate", language);
  });

  socket.on("compileCode", async ({ roomId, language, code, input }) => {
    try {
      const response = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          source_code: code,
          language_id: getLanguageId(language),
          stdin: input,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );

      const token = response.data.token;

      setTimeout(async () => {
        const result = await axios.get(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
          {
            headers: {
              "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            },
          }
        );

        const output =
          result.data.stdout ||
          result.data.stderr ||
          result.data.compile_output;
        io.to(roomId).emit("compileResult", { output });
      }, 2000);
    } catch (err) {
      io.to(roomId).emit("compileResult", { output: "Error running code." });
    }
  });

  // ✅ Chat Message Handler
  socket.on("chatMessage", ({ roomId, message, sender }) => {
    io.to(roomId).emit("receiveMessage", {
      sender,
      message,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter((id) => id !== socket.id);
      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      }
    }
  });
});

const getLanguageId = (lang) => {
  switch (lang) {
    case "cpp":
      return 54;
    case "python":
      return 71;
    case "java":
      return 62;
    case "javascript":
      return 63;
    default:
      return 63;
  }
};

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
