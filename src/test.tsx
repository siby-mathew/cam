import React, { useEffect, useRef, useState } from "react";

const CameraCapture = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" }, // Use rear camera
            width: { ideal: 4096 },
            height: { ideal: 2160 },
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        alert("Camera access failed");
      }
    };

    startCamera();

    return () => {
      // Cleanup on unmount
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setPhotoURL(url);
          }
        },
        "image/jpeg",
        0.95
      );
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: "100%", maxWidth: "480px", borderRadius: "8px" }}
      />
      <br />
      <button onClick={handleCapture} style={{ marginTop: "10px" }}>
        Capture Photo
      </button>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {photoURL && (
        <div style={{ marginTop: "15px" }}>
          <img
            src={photoURL}
            alt="Captured"
            style={{ width: "100%", maxWidth: "480px", borderRadius: "8px" }}
          />
          <br />
          <a href={photoURL} download="captured.jpg">
            Download Photo
          </a>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
