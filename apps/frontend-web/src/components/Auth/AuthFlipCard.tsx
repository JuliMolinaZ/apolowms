// src/components/Auth/AuthFlipCard.tsx
import React, { useState } from "react";
import styled from "styled-components";
import AnimatedLogo from "./AnimatedLogo";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const FlipContainer = styled.div`
  position: relative;
  width: 340px;
  height: 480px;
  perspective: 1000px;
`;

const FlipInner = styled.div<{ flipped: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.45, 0.05, 0.55, 0.95);
  transform-style: preserve-3d;
  transform: ${(props) => (props.flipped ? "rotateY(180deg)" : "none")};
`;

const Side = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
`;

const CardShape = styled.div`
  width: 100%;
  height: 100%;
  padding: 2rem;
  background: #fff;
  border-radius: 0 50px 50px 0;
  box-shadow: 0 6px 18px rgba(0,0,0,0.15);
`;

const AuthFlipCard: React.FC = () => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <AnimatedLogo />
      <FlipContainer>
        <FlipInner flipped={flipped}>
          <Side>
            <CardShape>
              <LoginForm onSwitch={() => setFlipped(true)} />
            </CardShape>
          </Side>
          <Side style={{ transform: "rotateY(180deg)" }}>
            <CardShape>
              <RegisterForm onSwitch={() => setFlipped(false)} />
            </CardShape>
          </Side>
        </FlipInner>
      </FlipContainer>
    </div>
  );
};

export default AuthFlipCard;
