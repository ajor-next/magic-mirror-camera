import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { distort, VirtualPixelMethod, toHTMLCanvasElement } from "@alxcube/lens";

const Camera = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [distortedImage, setDistortedImage] = useState(null);
  const [countdown, setCountdown] = useState(0); // Timer state

  // Function to start a 3-second countdown
  const startCaptureCountdown = () => {
    if (countdown === 0) {
      setCountdown(3); // Start countdown from 3 seconds

      const intervalId = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(intervalId);
            capture(); // Capture the image when countdown finishes
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }
  };

  // Capture image
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  }, [webcamRef]);

  // Apply slimming effect
  const applySlimmingEffect = async () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = capturedImage;
    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0);

      // Slimming effect parameters
      const controlPoints = [
        // Face area: Apply slimming
        img.width * 0.4, img.height * 0.3, img.width * 0.45, img.height * 0.3, // Left cheek inward
        img.width * 0.6, img.height * 0.3, img.width * 0.55, img.height * 0.3, // Right cheek inward

        // Upper body area: Slight inward adjustment
        img.width * 0.4, img.height * 0.5, img.width * 0.45, img.height * 0.5, // Upper left body inward
        img.width * 0.6, img.height * 0.5, img.width * 0.55, img.height * 0.5, // Upper right body inward

        // Lower body area: Apply slimming
        img.width * 0.4, img.height * 0.8, img.width * 0.42, img.height * 0.8, // Lower left body inward
        img.width * 0.6, img.height * 0.8, img.width * 0.58, img.height * 0.8, // Lower right body inward
      ];

      const distorted = await distort(canvas, "Affine", controlPoints, {
        virtualPixelMethod: VirtualPixelMethod.TRANSPARENT,
      });

      // Convert the distorted result to an HTMLCanvasElement
      const distortedCanvas = toHTMLCanvasElement(distorted.image.getResource());

      // Convert the distorted canvas to a Data URL for display
      const distortedDataUrl = distortedCanvas.toDataURL();
      setDistortedImage(distortedDataUrl);
    };
  };

  return (
    <div className="p-4">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="w-[500px] mx-auto"
        videoConstraints={{
          facingMode: "user",
        }}
      />
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={startCaptureCountdown} // Start the countdown when clicked
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Capture
        </button>
        <button
          onClick={applySlimmingEffect}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Apply Slimming Effect
        </button>
      </div>

      {/* Show the countdown timer */}
      {countdown > 0 && (
        <div className="flex justify-center mt-4">
          <p className="text-lg text-red-500">Capturing in {countdown}...</p>
        </div>
      )}

      <div className="flex justify-center items-center gap-4 mt-4">
        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured"
            className="w-1/2 border border-gray-300 rounded"
          />
        )}
        {distortedImage && (
          <img
            src={distortedImage}
            alt="Distorted"
            className="w-1/2 border border-gray-300 rounded"
          />
        )}
      </div>
    </div>
  );
};

export default Camera;
