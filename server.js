const express = require("express");
const path = require("path");

// const { socketServer } = require("./socketserver");
// socketServer();
const { wss } = require("./socketserver");

const app = express();
const port = process.env.PORT || 8000;

app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/js", express.static(path.join(__dirname, "public/javascripts")));
app.use("/sounds", express.static(path.join(__dirname, "public/sounds")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
  console.log(__dirname);
});

const server = app.listen(port, "0.0.0.0");
// const server = app.listen(port);

console.log("Server started at http://localhost:" + port);

server.on("upgrade", (request, socket, head) => {
  console.log("upgrading .. ");
  wss.handleUpgrade(request, socket, head, (socket) => {
    wss.emit("connection", socket, request);
  });
});
