import React from "react";
import socketIOClient from "socket.io-client";
import styled from "styled-components";
const EMG_CHANNEL = "EMG_CHANNEL"


const Full = styled.div`
  border:black 5px solid;
  width: 100px;
  height:20px;
  background-color:${props => props.strength >= props.threshold ? 'blue' : 'white'};
`;


// const socket = socketIOClient("http://127.0.0.1:4001");


export default function App() {
  const [strength, setStrength] = React.useState(555);

  // socket.on(EMG_CHANNEL, (strengthData) => {
  //   console.log(strengthData);
  //   setStrength(strengthData)
  // })


  return (
    <div style={{ textAlign: "center" }}>
      <h1>Strength score</h1>
      <Full strength={strength} threshold={900}></Full>
      <Full strength={strength} threshold={800}></Full>
      <Full strength={strength} threshold={700}></Full>
      <Full strength={strength} threshold={600}></Full>
      <Full strength={strength} threshold={500}></Full>
      <Full strength={strength} threshold={400}></Full>
      <Full strength={strength} threshold={300}></Full>
      <Full strength={strength} threshold={200}></Full>
      <Full strength={strength} threshold={100}></Full>
    </div>
  );
}
