const ws = new WebSocket("ws://localhost:8080", 'echo-protocol');

ws.onopen = function (event) {
  console.log("connection open ...");
  const hello = "hello websocket, I'm zhaji"
  ws.send(hello);
  appendMsg(hello, true)
};
ws.onmessage = function (event) {
  console.log("received from ws: ", event.data);
  appendMsg(event.data)
};
ws.onclose = function (event) {
  console.log("connection close ...");
};


