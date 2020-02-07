const { Storage } = require("@google-cloud/storage");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const index = require("./routes/index");
//const five = require("johnny-five");
const fetch = require("node-fetch");

const port = process.env.PORT || 4001;
//const board = new five.Board();
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

writer.pipe(fs.createWriteStream(filePath));

const testArr = [1, 2, 3, 4, 5];

testArr.forEach(num => {
  writer.write({ time: Date.now(), value: num });
});
writer.end();

// Imports the Google Cloud client library

// Creates a client
// Creates a client from a Google service account key.
// const storage = new Storage({keyFilename: "key.json"});

/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
const bucketName = "samson-bucket-zinc-t";

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
uploadFile().catch(console.error);

// board.on("ready", () => {
//   const mySensor = new five.Sensor("A0");

//   io.on("connection", socket => {

//     const currentFileName = `${Data.now()}`
//     console.log("New client connected");
//     mySensor.on("change", function (event) {

//       console.log("change,", this.scaleTo(0, 1000))
//       counter++;
//       if (counter % 10 === 0) {
//         const scaledData = this.scaleTo(0, 1000);
//         const timeObj = {
//           x: timeCounter++,
//           y: scaledData
//         };
//         socket.emit("emg", timeObj);
//       }
//     });
//     socket.on("disconnect", () => {

//       console.log("Client disconnected");
//     }
//     );
//   });
// })

server.listen(port, () => console.log(`Listening on port ${port}`));
