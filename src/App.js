import React from "react";
import socketIOClient from "socket.io-client";
import { Bar } from "react-chartjs-2";

const ENDPOINT = "http://127.0.0.1:4001";
const socket = socketIOClient(ENDPOINT);

export default function App() {
  const [response, setResponse] = React.useState([]);

  React.useEffect(() => {
    socket.on("emg", data => {
      // do stuff with your data below
      console.log(data)
      setResponse(data);
    });
    return () => {
      console.log("Component unmounted");
      socket.close();
    };
  }, []);

  const data = {
    datasets: [
      {
        label: "My First dataset",
        fill: false,
        lineTension: 1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [{ x: "strength", y: response }],
        options: {
          animation: false,
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                min: 0,
                max: 1000
              }
            }]
          }
        }

      }
    ]
  };

  return (
    <div style={{ textAlign: "center" }}>
      {response ? <Bar data={data} /> : <p>Loading...</p>}
    </div>
  );
}
