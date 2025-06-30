// src/components/PDFViewer.tsx
'use client';

import React from 'react';
import styled from 'styled-components';

interface PDFViewerProps {
  /** URL absoluta o relativa al PDF */
  src: string;
  /** Ancho en píxeles */
  width?: number;
  /** Alto en píxeles */
  height?: number;
}

const Iframe = styled.iframe<{ w: number; h: number }>`
  width: ${({ w }) => w}px;
  height: ${({ h }) => h}px;
  border: none;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

export const PDFViewer: React.FC<PDFViewerProps> = ({
  src,
  width = 300,
  height = 400,
}) => {
  return <Iframe src={src} w={width} h={height} />;
};
