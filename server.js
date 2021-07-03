const express = require("express");
const path = require("path");

const { socketServer } = require("./socketserver");
socketServer();

const app = express();
const port = process.env.PORT || 8080;
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
  console.log(__dirname);
});
app.use('/css',express.static(path.join(__dirname, 'public/css')));
app.listen(port);
console.log("Server started at http://localhost:" + port);
