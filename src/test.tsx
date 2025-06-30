import { useRef, useState } from "react";

const CameraCapture = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    setError(null);
    setCapturedImage(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });

      const video = videoRef.current;
      console.log(stream, video);
      if (video) {
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play();
        };
        setStreaming(true);
      }
    } catch (err: any) {
      console.error("Camera error:", err);
      setError("Unable to access the camera. Check permissions and try again.");
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const image = canvas.toDataURL("image/png");
        setCapturedImage(image);
      }
    }
  };

  const stopCamera = () => {
    const video = videoRef.current;
    if (video?.srcObject) {
      (video.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop());
    }
    setStreaming(false);
  };

  return (
    <div style={{ textAlign: "center", padding: "1rem" }}>
      {!streaming ? <button onClick={startCamera}>Start Camera</button> : null}
      <>
        <video
          ref={videoRef}
          style={{ width: "100%", maxWidth: "500px" }}
          autoPlay
          muted
          playsInline // Required for mobile browsers
        />
        <br />
        <button onClick={captureImage}>📸 Capture</button>
        <button onClick={stopCamera} style={{ marginLeft: "1rem" }}>
          ❌ Stop
        </button>
      </>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {capturedImage && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Captured Image</h3>
          <img
            src={capturedImage}
            alt="Captured"
            style={{ width: "100%", maxWidth: "500px" }}
          />
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CameraCapture;
