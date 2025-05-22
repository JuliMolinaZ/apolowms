"use client";

import React from "react";
import styled from "styled-components";

function WarehouseSketchfab({ onClose }: { onClose: () => void }) {
  // El iframe se mantiene 100% igual
  const iframeProps = {
    title: "Modelo Avanzado",
    frameBorder: "0",
    allowFullScreen: true,
    mozallowfullscreen: "true",
    webkitallowfullscreen: "true",
    allow: "autoplay; fullscreen; xr-spatial-tracking",
    "xr-spatial-tracking": "true" as const,
    "execution-while-out-of-viewport": "true" as const,
    "execution-while-not-rendered": "true" as const,
    "web-share": "true" as const,
    // Ajusta la URL a tu modelo:
    src: "https://sketchfab.com/models/3197c8e358994d5a8a86421d977c8a00/embed?ui_infos=0&ui_controls=0",
    style: { width: "100%", height: "100%" },
  };

  return (
    <Overlay>
      <CloseButton onClick={onClose}>Regresar</CloseButton>
      <iframe {...iframeProps} />
    </Overlay>
  );
}

export default WarehouseSketchfab;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  z-index: 1000;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 70px;
  left: 1rem;
  z-index: 1001;
  background-color: #e85b5b;
  color: #fff;
  border: none;
  border-radius: 1rem;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
`;
