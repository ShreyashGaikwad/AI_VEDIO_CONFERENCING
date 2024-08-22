// client/src/App.js
import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import * as facemesh from '@tensorflow-models/facemesh';

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);

  useEffect(() => {
    // Function to set up the webcam
    const setupCamera = async () => {
      const video = videoRef.current;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play();
        };
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    };

    // Function to load the facemesh model
    const loadModel = async () => {
      try {
        const model = await facemesh.load();
        setModel(model);
        console.log('Facemesh model loaded successfully.');
      } catch (error) {
        console.error('Error loading facemesh model:', error);
      }
    };

    // Function to detect faces and draw landmarks
    const detectFaces = async () => {
      if (model && videoRef.current) {
        const video = videoRef.current;
        const predictions = await model.estimateFaces(video, false);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (predictions.length > 0) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          predictions.forEach(prediction => {
            const keypoints = prediction.scaledMesh;
            keypoints.forEach(point => {
              ctx.beginPath();
              ctx.arc(point[0], point[1], 1, 0, 2 * Math.PI);
              ctx.fillStyle = 'red';  // Set color for the points
              ctx.fill();
            });
          });
        }
        requestAnimationFrame(detectFaces);
      }
    };

    // Initialize camera and load model
    setupCamera();
    loadModel().then(detectFaces);

  }, [model]);

  return (
    <div className="App">
      <video ref={videoRef} width="640" height="480" autoPlay muted></video>
      <canvas ref={canvasRef} width="640" height="480" style={{ position: 'absolute', top: 0, left: 0 }}></canvas>
    </div>
  );
}

export default App;
