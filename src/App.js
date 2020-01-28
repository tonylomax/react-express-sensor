import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import { Line } from "react-chartjs-2";

export default function App() {
  const [response, setResponse] = React.useState([]);
  const [endpoint, setEndpoint] = React.useState("http://127.0.0.1:4001");

  const socket = socketIOClient(endpoint);
  socket.on("emg", data => setResponse(prevState => prevState.concat(data.y)));

  const data = canvas => {
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 100, 0);

    return {
      backgroundColor: gradient
    };
  };

  return (
    <div style={{ textAlign: "center" }}>
      {response ? <Line data={[10, 20, 30]}></Line> : <p>Loading...</p>}
      {response ? <p> The data is {response} </p> : <p>Loading...</p>}
    </div>
  );
}
