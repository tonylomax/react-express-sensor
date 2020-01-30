const express = require("express");
const http = require("http");
const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();
const server = http.createServer(app);
const socketIo = require("socket.io");
const io = socketIo(server, {
  serveClient: false,
});
app.use(index);
const EMG_CHANNEL = "EMG_CHANNEL"

// Sensor stuff - not currently using while testing
// const five = require("johnny-five");
// const board = new five.Board();
// board.on("ready", () => {
//   const mySensor = new five.Sensor("A0");
//   mySensor.on("change", function () {
//     currentVal = this.scaleTo(0, 1000);
//   });

// });

let currentStrength = 0;
let intervalID;

io.on('connection', function (socket) {
  console.log("user connected")

  if (intervalID) {
    clearInterval(intervalID);
  }
  intervalID = setInterval(() => {
    currentStrength = Math.floor(Math.random() * 1000);
    io.emit(EMG_CHANNEL, currentStrength)
  }, 1000);
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});


server.listen(port, () => console.log(`Listening on port ${port}`));
