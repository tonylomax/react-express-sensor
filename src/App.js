import React from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:4001";
const socket = socketIOClient(ENDPOINT);

export default function App() {
  const [response, setResponse] = React.useState([]);

  React.useEffect(() => {
    socket.on("FromAPI", data => {
      setResponse(response => [...response, data]);
    });

    return () => {
      console.log("Component unmounted");
      socket.close();
    };
  }, []);

  return (
    <div>
      {response.length > 0 ? (
        response.map((item, index) => <p key={index}>{item}</p>)
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
