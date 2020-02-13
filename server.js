const { Storage } = require("@google-cloud/storage");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const index = require("./routes/index");
const five = require("johnny-five");
const fetch = require("node-fetch");

const port = process.env.PORT || 4001;
const board = new five.Board();
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const fs = require("fs");
var csvWriter = require("csv-write-stream");
var writer = csvWriter();

const path = require("path");

app.use(index);

fetch("http://192.168.4.1:80", {
  method: "GET",
  mode: "no-cors",
  cache: "no-cache",
  credentials: "same-origin",
  headers: { "Content-Type": "text/html" }
})
  .then(res => {
    console.log("res1", res);
    return res.text();
  })
  .catch(error => console.error(error));

let timeCounter = 0;
let counter = 0;

const currentUser = process.env.NAME || "Jack";

var dir = `./src/Logs/${currentUser}`;

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

console.log("hello world");
const filePath = path.resolve(
  `./src/Logs/${currentUser}/${Date.now()}_${currentUser}.csv`
);



// Imports the Google Cloud client library

// Creates a client
// Creates a client from a Google service account key.
// const storage = new Storage({keyFilename: "key.json"});

/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
const bucketName = "samson-bucket-zinc";

const storage = new Storage();

async function uploadFile() {
  // Uploads a local file to the bucket
  await storage.bucket(bucketName).upload(filePath, {
    // Support for HTTP requests made with `Accept-Encoding: gzip`
    gzip: true,
    // By setting the option `destination`, you can change the name of the
    // object you are uploading to a bucket.
    metadata: {
      // Enable long-lived HTTP caching headers
      // Use only if the contents of the file will never change
      // (If the contents will change, use cacheControl: 'no-cache')
      cacheControl: "public, max-age=31536000"
    }
  });

  console.log(`${filePath} uploaded to ${bucketName}.`);
}


board.on("ready", () => {
  const mySensor = new five.Sensor("A0");

  // io.on("connection", socket => {

  // const currentFileName = `${Data.now()}`
  console.log("New client connected");
  writer.pipe(fs.createWriteStream(filePath));

  mySensor.on("change", function (event) {

    const scaledData = this.scaleTo(0, 1000);

    writer.write({ time: Date.now(), value: scaledData });


    console.log("change,", this.scaleTo(0, 1000))
    counter++;
    // if (counter % 10 === 0) {

    //   const timeObj = {
    //     x: timeCounter++,
    //     y: scaledData
    //   };
    //   socket.emit("emg", timeObj);
    // }
  });


  // socket.on("disconnect", () => {

  // }
  // );

});

setTimeout(() => {
  // writer.end();
  uploadFile().catch(console.error);
  console.log("Client disconnected");
}, 10000);
server.listen(port, () => console.log(`Listening on port ${port}`));
