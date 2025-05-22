"use client";

import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

interface User {
  id: number;
  name: string;
  isOnline: boolean;
  avatar: string;
}

type CallType = "audio" | "video";
type CallState = "calling" | "in-progress" | "ended";

interface CallModalProps {
  callType: CallType;
  user: User | null;
  onClose: () => void;
}

export default function CallModal({ callType, user, onClose }: CallModalProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [callState, setCallState] = useState<CallState>("calling");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const ringAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let localStream: MediaStream;
    async function startCall() {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: callType === "video",
          audio: true,
        });
        setStream(localStream);

        if (callType === "video" && localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
          // Intentar reproducir (puede requerir interacción)
          localVideoRef.current.play().catch((err) => {
            console.log("Auto-play blocked:", err);
          });
        }
      } catch (error) {
        console.error("Error al acceder a la cámara/micrófono:", error);
      }
    }
    startCall();

    // Ringtone en "calling"
    if (callState === "calling") {
      ringAudioRef.current = new Audio("/sounds/ringtone.mp3");
      ringAudioRef.current.loop = true;
      ringAudioRef.current.play().catch((err) => {
        console.log("Auto-play blocked:", err);
      });
    }

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (ringAudioRef.current) {
        ringAudioRef.current.pause();
        ringAudioRef.current = null;
      }
    };
  }, [callType, callState]);

  const handleSimulateAnswer = () => {
    setCallState("in-progress");
    if (ringAudioRef.current) {
      ringAudioRef.current.pause();
      ringAudioRef.current = null;
    }
    if (callType === "video" && localVideoRef.current) {
      localVideoRef.current.play().catch((err) => {
        console.log("Auto-play blocked on answer:", err);
      });
    }
  };

  const handleHangUp = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (ringAudioRef.current) {
      ringAudioRef.current.pause();
      ringAudioRef.current = null;
    }
    onClose();
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    if (stream) {
      stream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
    }
  };

  const toggleVideo = () => {
    setIsVideoOn((prev) => !prev);
    if (stream) {
      stream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
    }
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <CallHeader>
          <CallTitle>
            {callType === "video" ? "Videollamada" : "Llamada de Voz"}
          </CallTitle>
          <CallStatus>
            {callState === "calling"
              ? `Llamando a ${user?.name || "Usuario"}...`
              : `En llamada con ${user?.name || "Usuario"}`}
          </CallStatus>
        </CallHeader>
        <CallBody>
          {callType === "video" && callState === "in-progress" ? (
            <>
              <RemoteVideoArea>
                {/* El “remoto” se simula con el avatar */}
                <RemoteVideo src={user?.avatar || "/images/default-avatar.png"} alt="Remote" />
              </RemoteVideoArea>
              <SelfVideoArea>
                <SelfVideo ref={localVideoRef} autoPlay playsInline muted />
              </SelfVideoArea>
            </>
          ) : callType === "video" && callState === "calling" ? (
            <WaitingMessage>
              <p>Esperando que {user?.name || "Usuario"} conteste...</p>
              <SimulateAnswerButton onClick={handleSimulateAnswer}>
                Simular Contestación
              </SimulateAnswerButton>
            </WaitingMessage>
          ) : (
            <AudioCallMessage>
              <p>Llamada de voz en progreso con {user?.name || "Usuario"}</p>
            </AudioCallMessage>
          )}
        </CallBody>
        <CallControls>
          <ControlButton onClick={toggleMute}>
            {isMuted ? "🔇" : "🎤"}
          </ControlButton>
          {callType === "video" && (
            <ControlButton onClick={toggleVideo}>
              {isVideoOn ? "📹" : "📷"}
            </ControlButton>
          )}
          <HangUpButton onClick={handleHangUp}>❌</HangUpButton>
        </CallControls>
      </ModalContainer>
    </ModalOverlay>
  );
}

/* ---------- Styled Components Ajustados ---------- */

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  /* Que ocupe toda la pantalla, y permita scroll si es muy grande */
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Permitir scroll en pantallas pequeñas */
  overflow-y: auto;
`;

const ModalContainer = styled.div`
  background: #1a1a1a;
  border-radius: 12px;
  /* Ajustes de tamaño para que no se corte */
  width: 90%;
  max-width: 1000px;
  height: 90%;
  max-height: 90%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  /* Permite que si en pantallas pequeñas no cabe, se muestre scroll interno */
  overflow: hidden;
`;

const CallHeader = styled.div`
  padding: 1rem 2rem;
  background: #2c2c2c;
  border-bottom: 1px solid #444;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CallTitle = styled.h3`
  margin: 0;
  font-size: 1.8rem;
  color: #fff;
  font-weight: bold;
`;

const CallStatus = styled.span`
  margin-top: 0.5rem;
  font-size: 1rem;
  color: #ccc;
`;

const CallBody = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  /* Si en pantallas muy chicas no cabe, se vería scroll.
     Normalmente lo evitamos para no cortar video. */
  overflow: hidden;
`;

const RemoteVideoArea = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const RemoteVideo = styled.img`
  width: 100%;
  height: 100%;
  /* object-fit: contain para no recortar nada de la imagen remota */
  object-fit: contain;
  background: #000; /* relleno si sobra espacio */
`;

const SelfVideoArea = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
  width: 240px;
  height: 160px;
  border: 2px solid #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
`;

const SelfVideo = styled.video`
  width: 100%;
  height: 100%;
  /* Usar contain para no cortar tu video */
  object-fit: contain;
  background: #000;
`;

const WaitingMessage = styled.div`
  color: #fff;
  font-size: 1.2rem;
  text-align: center;
`;

const SimulateAnswerButton = styled.button`
  margin-top: 1rem;
  background: #59d3a5;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #45b48b;
  }
`;

const AudioCallMessage = styled.div`
  color: #fff;
  font-size: 1.5rem;
`;

const CallControls = styled.div`
  padding: 1rem;
  background: #2c2c2c;
  border-top: 1px solid #444;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
`;

const ControlButton = styled.button`
  background: #444;
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  font-size: 1.5rem;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  &:hover {
    background: #555;
    transform: scale(1.1);
  }
`;

const HangUpButton = styled(ControlButton)`
  background: #e74c3c;
  &:hover {
    background: #c0392b;
  }
`;
