import { useRef, useState } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  facingMode: "environment",
};

const EdgeDetectionScanner = () => {
  const webcamRef = useRef<Webcam>(null);
  const [images, set] = useState<string[]>([]);

  const captureAndDetectEdges = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        set((prev) => [...prev, imageSrc]);
      }
    }
  };
  const fileInputRef = useRef(null);
  const [imageURL] = useState(null);

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      // setImageURL(URL.createObjectURL(file));
    }
  };

  const openCamera = () => {
    // fileInputRef.current.click();
  };
  return (
    <div>
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        style={{ width: "100%", maxWidth: "400px" }}
        screenshotQuality={100}
      />
      <button onClick={captureAndDetectEdges}>Capture + Detect Edges</button>
      {images.map((item) => {
        return <img src={item} />;
      })}

      <div>
        <div>
          <button onClick={openCamera}>Open Camera</button>

          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: "none" }}
          />

          {imageURL && (
            <div style={{ marginTop: 20 }}>
              <img src={imageURL} alt="Captured" style={{ width: "100%" }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EdgeDetectionScanner;
