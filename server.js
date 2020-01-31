const express = require("express");
const http = require("http");
const axios = require("axios");
const socketIo = require("socket.io");
const index = require("./routes/index");
const lodash = require("lodash");
const app = express();

const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 4001;

app.use(index);

const getApiAndEmit = async socket => {
  try {
    const res = await axios.get("https://cat-fact.herokuapp.com/facts"); // Getting the data from DarkSky
    console.log(
      "the response is",
      res.data.all[lodash.random(0, res.data.all.length)].text
    );
    socket.emit(
      "FromAPI",
      res.data.all[lodash.random(0, res.data.all.length)].text
    );
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};


io.on("connection", socket => {
  console.log("New client connected");
  setInterval(() => getApiAndEmit(socket), 3000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});




server.listen(PORT, () => console.log(`Listening on port ${PORT}`));