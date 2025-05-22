// components/Chat/styles.ts
"use client";

import styled, { keyframes } from "styled-components";

/* 
   1) Animaciones 
   - glowPulse: animación suave en el borde.
   - floatUp: un ligero movimiento vertical para los items.
*/
const glowPulse = keyframes`
  0% {
    box-shadow: 0 0 0px rgba(255,255,255,0.2);
  }
  50% {
    box-shadow: 0 0 12px rgba(255,255,255,0.4);
  }
  100% {
    box-shadow: 0 0 0px rgba(255,255,255,0.2);
  }
`;

const floatUp = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-2px); }
  100% { transform: translateY(0px); }
`;

/* 
   2) Contenedor Principal
   - Fondo con un degradado sutil + overlay “grain” (opcional).
   - Tipografía elegante.
*/
export const Container = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  /* Fondo degradado y overlay */
  background: linear-gradient(135deg, #ecf1f6, #ffffff);
  display: flex;
  flex-direction: column;
  color: #333;
  overflow: hidden;
`;

/*
   3) HEADER
   - Panel glassmorphism con “backdrop-filter”
   - Ícono y texto con transiciones suaves
*/
export const Header = styled.div`
  position: relative;
  padding: 1.5rem 2rem;
  background: rgba(255, 255, 255, 0.7);
  border-bottom: 1px solid rgba(255,255,255,0.3);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.07);
`;

export const HeaderIconCircle = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #b2ecd3 0%, #59d3a5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  /* Sutil sombra y pulso */
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  animation: ${glowPulse} 4s ease-in-out infinite;
`;

export const ChatIcon = styled.img`
  width: 28px;
  height: 28px;
  filter: brightness(0) invert(1); /* Si tu ícono es oscuro y quieres blanco */
`;

export const HeaderTitle = styled.h2`
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  color: #444;
  /* Sutil transición en hover */
  transition: color 0.3s;
  &:hover {
    color: #222;
  }
`;

/* Barras decorativas en la esquina superior derecha */
export const BarsContainer = styled.div`
  position: absolute;
  top: 8px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Bar = styled.div<{ height: number }>`
  width: 10px;
  height: ${(p) => p.height}px;
  border-radius: 4px;
  background: linear-gradient(135deg, #b2ecd3 0%, #59d3a5 100%);
`;

/*
   4) MAIN CONTENT
   - Usamos “display: flex” con gap, 
     y el panel de usuarios y el chat se benefician del glassmorphism.
*/
export const MainContent = styled.div`
  flex: 1;
  display: flex;
  margin: 1.5rem 2rem;
  gap: 1.5rem;
  position: relative;
`;

/*
   5) PANEL IZQUIERDO (USUARIOS)
   - Efecto glass + sombras + animaciones en hover
*/
export const LeftPanel = styled.div`
  width: 280px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  backdrop-filter: blur(10px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255,255,255,0.3);
`;

export const UsersTitle = styled.div`
  padding: 1rem;
  font-weight: 700;
  font-size: 1.1rem;
  color: #333;
  border-bottom: 1px solid rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.2);
`;

export const UsersList = styled.div`
  flex: 1;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }
`;

export const UserItem = styled.div<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
  background-color: ${({ $selected }) => ($selected ? "rgba(255,255,255,0.4)" : "transparent")};

  &:hover {
    background-color: rgba(255,255,255,0.4);
    transform: translateX(2px);
  }
`;

export const AvatarWrapper = styled.div`
  position: relative;
  min-width: 40px;
  min-height: 40px;
`;

export const UserAvatarImg = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
  display: block;
  border: 2px solid #fff;
`;

export const StatusDot = styled.span<{ $online: boolean }>`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background-color: ${(p) => (p.$online ? "#34c759" : "#bbb")};
  border: 2px solid #fff;
  border-radius: 50%;
`;

export const UserText = styled.div`
  display: flex;
  flex-direction: column;
`;

export const UserName = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
`;

export const UserStatus = styled.span<{ $online: boolean }>`
  font-size: 0.8rem;
  color: ${(p) => (p.$online ? "#34c759" : "#999")};
`;

/*
   6) PANEL CENTRAL (CHAT)
   - También glassmorphism
   - Sombra y transiciones
*/
export const ChatPanel = styled.div`
  flex: 1;
  background: rgba(255,255,255,0.6);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.3);
`;

/* Header del Chat */
export const ChatHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background: rgba(255,255,255,0.3);
  border-bottom: 1px solid rgba(255,255,255,0.3);
`;

export const UserHeader = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const HeaderAvatarImg = styled.img`
  width: 45px;
  height: 45px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 0.75rem;
  border: 2px solid #fff;
`;

export const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const HeaderName = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: #333;
`;

export const HeaderTime = styled.span`
  font-size: 0.8rem;
  color: #666;
`;

/* Tarjeta flotante de perfil */
export const ProfileCard = styled.div`
  position: absolute;
  top: 60px;
  left: 1rem;
  width: 220px;
  background-color: rgba(255,255,255,0.8);
  border-radius: 0.75rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(8px);
  padding: 1rem;
  z-index: 10;
  color: #333;
  border: 1px solid rgba(255,255,255,0.4);
`;

export const ProfileImg = styled.img`
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 50%;
  display: block;
  margin: 0 auto 0.5rem auto;
  border: 2px solid #fff;
`;

export const ProfileName = styled.div`
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.2rem;
  color: #333;
`;

export const ProfileRole = styled.div`
  font-size: 0.85rem;
  text-align: center;
  margin-bottom: 0.5rem;
  color: #777;
`;

export const ProfileLocalTime = styled.div`
  font-size: 0.8rem;
  text-align: center;
  margin-bottom: 0.75rem;
  color: #999;
`;

export const ProfileActions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
`;

/* Fondo claro y texto oscuro para ver emojis negros */
export const ProfileActionButton = styled.button`
  flex: 1;
  background: #f3f3f3; 
  border: none;
  border-radius: 0.3rem;
  padding: 0.4rem 0.6rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  transition: background 0.15s, transform 0.15s;

  &:hover {
    background: #e6e6e6;
    transform: scale(1.05);
  }
`;

/* Área de mensajes */
export const MessagesArea = styled.div`
  flex: 1;
  background: transparent;
  padding: 1rem;
  overflow-y: auto;
  /* Animación leve flotante de los mensajes */
  animation: ${floatUp} 4s ease-in-out infinite alternate;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }
`;

export const MessageRow = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
  transition: transform 0.2s;

  &:hover {
    transform: translateX(2px);
  }
`;

export const MsgAvatarImg = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 0.75rem;
  border: 2px solid #fff;
`;

export const MsgBubble = styled.div`
  background: rgba(255,255,255,0.8);
  border-radius: 0.75rem;
  padding: 0.6rem 0.8rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  max-width: 60%;
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255,255,255,0.3);
  transition: box-shadow 0.2s, transform 0.2s;

  &:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    transform: scale(1.01);
  }
`;

export const MsgHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 0.2rem;
`;

export const MsgUserName = styled.span`
  font-size: 0.9rem;
  font-weight: 700;
  color: #2a2a2a;
`;

export const MsgTime = styled.span`
  font-size: 0.75rem;
  color: #999;
  margin-left: 0.5rem;
`;

export const MsgText = styled.div`
  font-size: 0.9rem;
  color: #333;
  line-height: 1.4;
`;

/* Barra inferior para escribir mensaje */
export const MessageInputArea = styled.div`
  display: flex;
  align-items: center;
  padding: 0.6rem 1rem;
  background-color: rgba(255,255,255,0.4);
  backdrop-filter: blur(6px);
  border-top: 1px solid rgba(255,255,255,0.3);
`;

export const InputField = styled.input`
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 2rem;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  color: #333;
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(2px);
  transition: border-color 0.2s, background 0.2s;

  &:focus {
    outline: none;
    border-color: #bbb;
    background: rgba(255,255,255,1);
  }
`;

export const ReloadIcon = styled.div`
  margin-left: 1rem;
  font-size: 1.2rem;
  color: #666;
  cursor: pointer;
  transition: color 0.2s, transform 0.2s;

  &:hover {
    color: #333;
    transform: rotate(90deg);
  }
`;

export const NoUserSelected = styled.div`
  flex: 1;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;

  p {
    color: #666;
    font-size: 1rem;
  }
`;
