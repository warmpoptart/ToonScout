import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import corsMiddleware from "./middlewares/cors.js";
import interactionsRouter from "./routes/interactions.js";
import tokenRouter from "./routes/token.js";
import utilityRouter from "./routes/utility.js";
import { handleWebSocketConnection } from "./websocket.js";
import { loadCommands } from "./utils.js";

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3000;

app.commands = new Map();

loadCommands(app);

app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());

app.use("/interactions", interactionsRouter);
app.use("/token", tokenRouter);
app.use("/utility", utilityRouter);

wss.on("connection", handleWebSocketConnection);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

process.on("SIGINT", () => {
  console.log("Shutting down...");
  process.exit();
});
