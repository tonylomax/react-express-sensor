import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import { Line } from "react-chartjs-2";

export default function App() {
  const [response, setResponse] = React.useState([]);
  const [endpoint, setEndpoint] = React.useState("http://127.0.0.1:4001");
  const [refresh, setRefresh] = React.useState(false);


  const socket = socketIOClient(endpoint);
  socket.on("emg", data => {
    setResponse(prevState => {
      if (prevState.length > 30) {
        return prevState.slice(1).concat(data.y);
      }
      else {
        return prevState.concat(data.y)
      }
    })

  });


  const data = {
    datasets: [
      {
        label: 'My First dataset',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: response
      }
    ]
  };




  return (
    <div style={{ textAlign: "center" }}>
      {response ? <Line data={data} /> : <p>Loading...</p>}
    </div>
  );
}
