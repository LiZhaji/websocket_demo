const WebSocketServer = require("websocket").server;
const http = require("http");

const server = http.createServer((request, response) => {
  console.log("received request for" + request.url);
  response.writeHead(403);
  response.end();
});
server.listen(8080, () => {
  console.log("running at prot 8080");
});

const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false, // websocket没有同源限制
});

wsServer.on("connect", (connection) => {
  console.log("is connecting ...", connection.state);
  connection.sendUTF("连接成功...");
  connection.sendUTF("很高兴见到你！");
});

wsServer.on("request", (request) => {
  // 判断域

  const connection = request.accept("echo-protocol", request.origin);
  console.log(new Date() + " connection accepted");
  connection.on("message", (message) => {
    if (message.type === "utf8") {
      console.log("Received Message: " + message.utf8Data);
      connection.sendUTF(answer(message.utf8Data));
    } else if (message.type === "binary") {
      console.log(
        "Received Binary Message of " + message.binaryData.length + " bytes"
      );
      connection.sendBytes(message.binaryData);
    }
  });
  connection.on("close", function (reasonCode, description) {
    console.log(
      new Date() + " Peer " + connection.remoteAddress + " disconnected."
    );
    console.log("reasonCode: ", reasonCode, " , description: " + description);
  });
  connection.on("error", (err) => {
    console.log("show error: ", err);
  });
});

function answer(data) {
  const helloReg = /hello | 你好/;
  if (helloReg.test(data)) {
    return "你好，我是WebSocket";
  } else if (data.includes("吗")) {
    return data.slice(0, -1);
  } else if (data.includes("?")) {
    return data.slice(0, -1);
  } else {
    return data + "!";
  }
}
