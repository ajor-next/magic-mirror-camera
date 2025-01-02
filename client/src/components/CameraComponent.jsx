import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { distort, VirtualPixelMethod, toHTMLCanvasElement } from "@alxcube/lens";

const CameraComponent = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [distortedImage, setDistortedImage] = useState(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  }, [webcamRef]);

  const applyArcDistortion = async () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = capturedImage;
    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0);

      // Apply Arc distortion with parameters
      const arcAngle = 360; // Full circle
      const rotationAngle = 0; // No rotation
      const outerRadius = img.height/2; // Outer radius for arc
      const innerRadius = 0; // No inner radius to form a solid circle

      const distorted = await distort(canvas, "Arc", [arcAngle, rotationAngle, outerRadius, innerRadius], {
        virtualPixelMethod: VirtualPixelMethod.HORIZONTAL_TILE, // Avoid gaps at edges
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
          onClick={capture}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Capture
        </button>
        <button
          onClick={applyArcDistortion}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Apply Arc Effect
        </button>
      </div>

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

export default CameraComponent;
