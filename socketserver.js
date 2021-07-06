const WebSocket = require("ws");

const { fetch } = require("./fetchsite");

// const socketServer = () => {
// const wss = new WebSocket.Server({ port: 8082 });
const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", async (data) => {
    console.log("Client has sent us : " + data);
    // ws.send("I am fine.");

    data = data.split(",");
    const id = data[1];
    const url = data[0];
    const delay = data[2];
    console.log(data);
    let initial_data = await fetch(id, url);

    const repeat = setInterval(async () => {
      let recent_data = await fetch(id, url);
      if (recent_data !== initial_data) {
        initial_data = recent_data;
        ws.send("change detected");
      }
    }, delay);

    ws.on("close", () => {
      clearInterval(repeat);
      console.log("Client has disconnected");
    });
  });
});
// };

// module.exports = { socketServer };
module.exports = { wss };
