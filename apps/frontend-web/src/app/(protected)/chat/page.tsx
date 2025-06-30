// src/app/(protected)/chat/page.tsx
'use client';

import React, {
  useState,
  useEffect,
  useRef,
  KeyboardEvent,
  ChangeEvent,
} from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import {
  FaComments,
  FaPaperPlane,
  FaSmile,
  FaPaperclip,
  FaVideo,
  FaTimes,
  FaCircle,
} from 'react-icons/fa';
import type { User, ChatMessage, ChatRoom } from '@/lib/types/chat';

// ———————————————————————————————
// Global Styles & Theme
// ———————————————————————————————
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: "Segoe UI", sans-serif;
    background: #e8f7ff;
    color: #222;
    overflow: hidden;
  }
`;
const theme = {
  primary: '#4BBF73',
  secondary: '#5CE1E6',
  bg: '#FFFFFF',
  border: '#C1DCE7',
  hover: '#DFF8FF',
  notif: '#FFCF00',
};

// ———————————————————————————————
// Animations
// ———————————————————————————————
const pulse = keyframes`
  0%,100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
`;
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ———————————————————————————————
// Styled Components
// ———————————————————————————————
const DemoBanner = styled.div`
  position: fixed; top: 0; left: 50%; transform: translateX(-50%);
  background: linear-gradient(90deg,#ff6ec4,#7873f5);
  color: #fff; padding: 6px 20px; border-radius: 0 0 12px 12px;
  font-weight: bold; text-transform: uppercase;
  animation: ${pulse} 2s ease-in-out infinite;
  z-index: 1000;
`;

const Container = styled.div`
  display: flex;
  height: 100vh;
  padding-top: 40px; /* space for banner */
`;

const Sidebar = styled.div`
  width: 280px;
  background: ${theme.bg};
  border-right: 1px solid ${theme.border};
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${theme.border};
  font-weight: bold;
  color: ${theme.primary};
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  flex: 1;
`;

const ListItem = styled.li<{ $selected?: boolean }>`
  padding: 10px 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  background: ${({ $selected }) => ($selected ? theme.hover : 'transparent')};
  transition: background .2s;
  &:hover { background: ${theme.hover}; }
`;

const RoomName = styled.span`
  margin-left: 10px;
  flex: 1;
  font-size: 0.95rem;
`;

const StatusDot = styled(FaCircle)<{ $online: boolean }>`
  color: ${({ $online }) => ($online ? theme.secondary : '#ccc')};
  font-size: 0.6rem;
`;

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${theme.secondary};
  color: #fff;
`;

const ChatTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
`;

const ChatActions = styled.div`
  display: flex;
  gap: 16px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  font-size: 1.4rem;
  transition: transform .2s;
  &:hover { transform: scale(1.2); }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f0fcff;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const MessageRow = styled.div<{ $self?: boolean }>`
  display: flex;
  margin-bottom: 14px;
  ${({ $self }) => $self && 'justify-content: flex-end;'}
`;

const Bubble = styled.div<{ $self?: boolean }>`
  max-width: 65%;
  padding: 12px 16px;
  background: ${({ $self }) => ($self ? theme.primary : theme.bg)};
  color: ${({ $self }) => ($self ? '#fff' : '#222')};
  border-radius: 12px;
  position: relative;
  animation: ${fadeIn} .3s ease;
  &:hover { transform: scale(1.01); transition: transform .2s; }
  &::after {
    content: '';
    position: absolute;
    top: 12px;
    ${({ $self }) =>
      $self
        ? `right: -6px; border-left: 6px solid ${theme.primary}`
        : `left: -6px; border-right: 6px solid ${theme.bg}`};
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
  }
`;

const Meta = styled.div`
  font-size: 0.75rem;
  color: rgba(0,0,0,0.5);
  margin-bottom: 6px;
`;

const TypingIndicator = styled.div`
  padding-left: 16px;
  font-style: italic;
  color: #666;
`;

const InputArea = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border-top: 1px solid ${theme.border};
  background: ${theme.bg};
`;

const Textarea = styled.textarea`
  flex: 1;
  padding: 10px;
  border: 1px solid ${theme.border};
  border-radius: 6px;
  resize: none;
  outline: none;
  font-size: 1rem;
  color: #222;
  &::placeholder { color: #888; }
`;

const FileInput = styled.input` display: none; `;
const EmojiButton = styled(IconButton)` color: #888; `;
const SendButton = styled(IconButton)` color: ${theme.primary}; `;

// Video modal
const Overlay = styled.div`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex; align-items: center; justify-content: center;
  z-index: 2000;
`;

const VideoModal = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  width: 560px;
  max-width: 95%;
  position: relative;
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2,1fr);
  gap: 12px;
  margin-top: 12px;
`;

const VideoBox = styled.video`
  width: 100%;
  height: 140px;
  background: #000;
  border-radius: 8px;
  object-fit: cover;
`;

const CloseButton = styled(IconButton)`
  position: absolute; top: 12px; right: 12px; color: #333;
`;

// ———————————————————————————————
// Demo Data & Helpers
// ———————————————————————————————
const now = Date.now();
const DEMO_USERS: User[] = [
  { id: 1, username: 'Alice', isOnline: true },
  { id: 2, username: 'Bob',   isOnline: false },
  { id: 3, username: 'Carol', isOnline: true },
  { id: 4, username: 'Dave',  isOnline: true },
  { id: 5, username: 'Eve',   isOnline: false },
];

const DEMO_ROOMS: ChatRoom[] = [
  {
    id: 'general',
    name: '# General',
    participantIds: DEMO_USERS.map(u => u.id),
    messages: [
      {
        id: 'g1',
        roomId: 'general',
        senderId: 1,
        senderName: 'Alice',
        text: '👋 Welcome to the super WOW demo!',
        timestamp: now - 3600000,
      },
    ],
  },
  {
    id: 'dev',
    name: '# Developers',
    participantIds: DEMO_USERS.map(u => u.id),
    messages: [
      {
        id: 'd1',
        roomId: 'dev',
        senderId: 3,
        senderName: 'Carol',
        text: '🚀 Deployed v1.3.0!',
        timestamp: now - 3000000,
      },
    ],
  },
  {
    id: 'dm-1-2',
    name: 'Alice ↔ Bob',
    participantIds: [1, 2],
    messages: [],
  },
];

const BOT_RESPONSES = [
  '👍 Great!',
  'Understood.',
  "I'll check it out.",
  'Here is the info.',
  'Excellent point.',
  'Can you elaborate more?',
];
function randomResponse() {
  return BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
}

// ———————————————————————————————
// Main Component
// ———————————————————————————————
export default function ChatPage() {
  const user = DEMO_USERS[0];
  const [rooms, setRooms] = useState<ChatRoom[]>(DEMO_ROOMS);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom>(DEMO_ROOMS[0]);
  const [messageText, setMessageText] = useState('');
  const [typing, setTyping] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when messages or room change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [rooms, selectedRoom]);

  const handleSend = () => {
    if (!messageText.trim()) return;
    const msg: ChatMessage = {
      id: `${Date.now()}`,
      roomId: selectedRoom.id,
      senderId: user.id,
      senderName: user.username,
      text: messageText.trim(),
      timestamp: Date.now(),
    };
    setRooms(rs =>
      rs.map(r =>
        r.id === msg.roomId
          ? { ...r, messages: [...r.messages, msg] }
          : r
      )
    );
    setMessageText('');
    // simulate typing & response
    setTyping('Carol');
    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        roomId: selectedRoom.id,
        senderId: 3,
        senderName: 'Carol',
        text: randomResponse(),
        timestamp: Date.now(),
      };
      setTyping(null);
      setRooms(rs =>
        rs.map(r =>
          r.id === botMsg.roomId
            ? { ...r, messages: [...r.messages, botMsg] }
            : r
        )
      );
    }, 1500 + Math.random() * 2000);
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setMessageText(e.target.value);

  const startVideo = async () => {
    setShowVideo(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play();
      }
    } catch {
      setShowVideo(false);
    }
  };

  const usersInRoom = DEMO_USERS.filter(u =>
    selectedRoom.participantIds.includes(u.id)
  );

  return (
    <>
      <GlobalStyle />
      <DemoBanner>🌟 DEMO WOW MODE ACTIVATED 🌟</DemoBanner>
      <Container>
        <Sidebar>
          <SectionTitle>Channels</SectionTitle>
          <List>
            {rooms.map(r => (
              <ListItem
                key={r.id}
                $selected={r.id === selectedRoom.id}
                onClick={() => setSelectedRoom(r)}
              >
                <FaComments />
                <RoomName>{r.name}</RoomName>
              </ListItem>
            ))}
          </List>
          <SectionTitle>Users</SectionTitle>
          <List>
            {usersInRoom.map(u => (
              <ListItem key={u.id}>
                <StatusDot $online={u.isOnline} />
                <RoomName>{u.username}</RoomName>
              </ListItem>
            ))}
          </List>
        </Sidebar>

        <Main>
          <ChatHeader>
            <ChatTitle>{selectedRoom.name}</ChatTitle>
            <ChatActions>
              <IconButton onClick={startVideo}>
                <FaVideo />
              </IconButton>
            </ChatActions>
          </ChatHeader>

          <MessagesContainer>
            {selectedRoom.messages.map(msg => {
              const self = msg.senderId === user.id;
              return (
                <MessageRow key={msg.id} $self={self}>
                  <Bubble $self={self}>
                    <Meta>
                      {msg.senderName} •{' '}
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </Meta>
                    {msg.text}
                  </Bubble>
                </MessageRow>
              );
            })}

            {typing && (
              <TypingIndicator>{typing} is typing...</TypingIndicator>
            )}

            <div ref={messagesEndRef} />
          </MessagesContainer>

          <InputArea>
            <EmojiButton>
              <FaSmile />
            </EmojiButton>
            <label>
              <EmojiButton as="span">
                <FaPaperclip />
              </EmojiButton>
              <FileInput type="file" />
            </label>
            <Textarea
              rows={1}
              placeholder="Type a message..."
              value={messageText}
              onChange={handleChange}
              onKeyDown={(e: KeyboardEvent) =>
                e.key === 'Enter' && !e.shiftKey
                  ? (e.preventDefault(), handleSend())
                  : undefined
              }
            />
            <SendButton onClick={handleSend}>
              <FaPaperPlane />
            </SendButton>
          </InputArea>
        </Main>
      </Container>

      {showVideo && (
        <Overlay onClick={() => setShowVideo(false)}>
          <VideoModal onClick={e => e.stopPropagation()}>
            <CloseButton onClick={() => setShowVideo(false)}>
              <FaTimes />
            </CloseButton>
            <h3>Demo Video Call</h3>
            <VideoGrid>
              <VideoBox ref={localVideoRef} muted />
              {usersInRoom
                .filter(u => u.id !== user.id)
                .slice(0, 3)
                .map((_, i) => (
                  <VideoBox key={i} />
                ))}
            </VideoGrid>
          </VideoModal>
        </Overlay>
      )}
    </>
  );
}
