"use client";
import React, { useEffect } from "react";

interface CappasityViewerProps {
  src: string;
}

const CappasityViewer: React.FC<CappasityViewerProps> = ({ src }) => {
  useEffect(() => {
    const scriptId = "cappasity-script";
    // Inyecta el script de Cappasity una sola vez
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.src = "https://api.cappasity.com/api/player/cappasity-ai";
      script.async = true;
      script.id = scriptId;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <iframe
      width="100%"
      height="600px"
      frameBorder="0"
      allowFullScreen
      style={{ border: 0 }}
      src={src}
      {...({ mozallowfullscreen: "true", webkitallowfullscreen: "true" } as any)}
    />
  );
};

export default CappasityViewer;
