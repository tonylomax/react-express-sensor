const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();
app.use(index);
const server = http.createServer(app);
const io = socketIo(server); // < Interesting!

const fs = require("fs");
const five = require("johnny-five");
const board = new five.Board();

const lodash = require("lodash");
// const getApiAndEmit = async socket => {
//   try {
//     const res = await axios.get("https://cat-fact.herokuapp.com/facts"); // Getting the data from DarkSky
//     console.log(
//       "the response is",
//       res.data.all[lodash.random(0, res.data.all.length)].text
//     );
//     socket.emit(
//       "FromAPI",
//       res.data.all[lodash.random(0, res.data.all.length)].text
//     ); // Emitting a new message. It will be consumed by the client
//   } catch (error) {
//     console.error(`Error: ${error.code}`);
//   }
// };
let timeCounter = 0;
let counter = 0;

board.on("ready", () => {
  const mySensor = new five.Sensor("A0");

  io.on("connection", socket => {
    console.log("New client connected");

    // setInterval(() => getApiAndEmit(socket), 3000);

    mySensor.on("change", function (event) {
      counter++;
      console.log(counter);

      if (counter % 100 === 0) {
        const scaledData = this.scaleTo(0, 1000);
        const timeObj = { x: timeCounter++, y: scaledData };
        console.log(timeObj);
        socket.emit("emg", timeObj);
      }
    });

    socket.on("disconnect", () => console.log("Client disconnected"));
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
