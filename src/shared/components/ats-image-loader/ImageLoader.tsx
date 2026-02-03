import { useState, useEffect } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { Image } from "primereact/image";
import atsLogo from "../../../assets/ats.svg";
import "./ImageLoader.css";

interface ImageWithFallbackProps {
  src?: string;
  alt?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  preview?: boolean;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = "",
  width = "100%",
  height = "auto",
  preview = false,
}) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const isValidSrc = imgSrc && imgSrc.trim() !== "";

  useEffect(() => {
    setImgSrc(src);
    setLoading(true);
    setHasError(false);
  }, [src]);

  // Handle image load success
  const handleLoad = () => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  // Handle image load error
  const handleError = () => {
    setHasError(true);
    setLoading(false);
  };

  return (
    <div
      className={`relative ${className}`}
      style={{ width, height, overflow: "hidden" }}
    >
      {loading && isValidSrc && !hasError && (
        <div className="absolute inset-0 flex items-center bg-transparent justify-center z-10">
          <ProgressSpinner
            style={{ width: "50px", height: "50px", margin: "2px" }}
            strokeWidth="2"
            animationDuration=".8s"
          />
        </div>
      )}
      {isValidSrc && !hasError ? (
        <Image
          src={imgSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className="loadImage"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            display: loading ? "none" : "block",
          }}
          preview={preview}
        />
      ) : (
        <div
          className="flex items-center justify-center"
          style={{ width: "100%", height: "100%", backgroundColor: "#FFFFFF" }}
        >
          <Image
            src={atsLogo}
            alt="Fallback"
            style={{
              width: "70%",
              height: "70%",
              objectFit: "cover",
              objectPosition: "center center",
              justifyContent: "center",
              display: "flex",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageWithFallback;
