const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const index = require("./routes/index");
const five = require("johnny-five");

const port = process.env.PORT || 4001;
const board = new five.Board();
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(index);

let timeCounter = 0;
let counter = 0;

board.on("ready", () => {
  const mySensor = new five.Sensor("A0");

  io.on("connection", socket => {
    console.log("New client connected");
    mySensor.on("change", function (event) {
      counter++;
      if (counter % 100 === 0) {
        const scaledData = this.scaleTo(0, 1000);
        const timeObj = {
          x: timeCounter++,
          y: scaledData
        };
        socket.emit("emg", timeObj);
      }
    });
    socket.on("disconnect", () => console.log("Client disconnected"));
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));