import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState();
  const video = document.querySelector("#video");

  async function getDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices1 = devices.filter(
      (device) => device.kind === "videoinput"
    );

    setVideoDevices(videoDevices1);
  }

  function gotStream(stream) {
    window.stream = stream; // make stream available to console

    if (video) {
      video.srcObject = stream;
    }
  }

  function getStream() {
    if (window.stream) {
      window.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    const videoSource = selectedDevice || videoDevices[0]?.deviceId;
    const constraints = {
      video: { deviceId: videoSource ? { exact: videoSource } : undefined },
    };
    return navigator.mediaDevices
      .getUserMedia(constraints)
      .then(gotStream)
      .catch((error) => console.error(error));
  }

  function handleClick(ev) {
    setSelectedDevice(ev.target.value);
  }

  useEffect(() => {
    getDevices();
  }, []);

  useEffect(() => {
    getStream();
  }, [videoDevices?.length, selectedDevice]);

  return (
    <>
      <div>
        <video autoPlay id="video" />
        <canvas className="d-none"></canvas>
        {videoDevices?.map(({ deviceId, label }) => (
          <button onClick={handleClick} key={deviceId} value={deviceId}>
            {label}
          </button>
        ))}
      </div>
    </>
  );
}

export default App;
