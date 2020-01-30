import React from "react";
import socketIOClient from "socket.io-client";
import styled from "styled-components";
const EMG_CHANNEL = "EMG_CHANNEL"


const BarChartSection = styled.div`
  border:black 5px solid;
  width: 100px;
  height:20px;
  background-color:${props => props.strength >= props.threshold ? 'blue' : 'white'};
`;


const socket = socketIOClient("http://127.0.0.1:4001");


export default function App() {
  const [strength, setStrength] = React.useState(755);

  socket.on(EMG_CHANNEL, (strengthData) => {
    console.log(strengthData);
    setStrength(strengthData)
  })


  return (
    <div style={{ textAlign: "center" }}>
      <h1>Strength score</h1>
      {/* Threshold dictates if the bar chart should be filled in or not */}
      <BarChartSection strength={strength} threshold={900} />
      <BarChartSection strength={strength} threshold={800} />
      <BarChartSection strength={strength} threshold={700} />
      <BarChartSection strength={strength} threshold={600} />
      <BarChartSection strength={strength} threshold={500} />
      <BarChartSection strength={strength} threshold={400} />
      <BarChartSection strength={strength} threshold={300} />
      <BarChartSection strength={strength} threshold={200} />
      <BarChartSection strength={strength} threshold={100} />
    </div>
  );
}
