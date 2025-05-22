// src/components/Auth/AnimatedLogo.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";

const LogoContainer = styled.div`
  /* Puedes agregar estilos propios para el contenedor del logo */
`;

const AnimatedLogo: React.FC = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setActive(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LogoContainer>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="375"
        height="375"
        viewBox="0 0 375 375"
        className={active ? "active" : ""}
      >
        {/* Aquí va el contenido completo de tu SVG */}
      </svg>
    </LogoContainer>
  );
};

export default AnimatedLogo;
