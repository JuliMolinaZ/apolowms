// app/(protected)/chat/page.tsx
"use client";

import React, { useState } from "react";
import CallModal from "@/components/Chat/CallModal";
import {
  Container,
  Header,
  HeaderIconCircle,
  ChatIcon,
  HeaderTitle,
  BarsContainer,
  Bar,
  MainContent,
  LeftPanel,
  UsersTitle,
  UsersList,
  UserItem,
  AvatarWrapper,
  UserAvatarImg,
  StatusDot,
  UserText,
  UserName,
  UserStatus,
  ChatPanel,
  ChatHeader,
  UserHeader,
  HeaderAvatarImg,
  HeaderInfo,
  HeaderName,
  HeaderTime,
  ProfileCard,
  ProfileImg,
  ProfileName,
  ProfileRole,
  ProfileLocalTime,
  ProfileActions,
  ProfileActionButton,
  MessagesArea,
  MessageRow,
  MsgAvatarImg,
  MsgBubble,
  MsgHeader,
  MsgUserName,
  MsgTime,
  MsgText,
  MessageInputArea,
  InputField,
  ReloadIcon,
  NoUserSelected,
} from "@/components/Chat/styles";

/* Tipos y datos mock */
interface User {
  id: number;
  name: string;
  isOnline: boolean;
  avatar: string;
}

const mockUsers: User[] = [
  {
    id: 1,
    name: "Julimz",
    isOnline: true,
    avatar: "/images/user1.jpg",
  },
  {
    id: 2,
    name: "Offline",
    isOnline: false,
    avatar: "/images/user2.jpg",
  },
  {
    id: 3,
    name: "UserX",
    isOnline: true,
    avatar: "/images/user3.jpg",
  },
];

interface Message {
  id: number;
  userId: number;
  text: string;
  time: string;
}

const mockMessages: Message[] = [
  {
    id: 101,
    userId: 1,
    text: "Hola, ¿en qué puedo ayudarte?",
    time: "3:40 pm",
  },
];

type CallType = "audio" | "video" | null;

export default function ChatPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(mockUsers[0]);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [callType, setCallType] = useState<CallType>(null);

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setShowProfileCard(false);
  };

  const handleToggleProfileCard = () => {
    setShowProfileCard((prev) => !prev);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    alert(`Mensaje enviado: ${inputMessage}`);
    setInputMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceCall = () => {
    setCallType("audio");
  };

  const handleVideoCall = () => {
    setCallType("video");
  };

  const handleCloseCall = () => {
    setCallType(null);
  };

  return (
    <Container>
      {/* Header estilo “segunda imagen” */}
      <Header>
        {/* Círculo degradado con ícono */}
        <HeaderIconCircle>
          <ChatIcon src="/logos/chat.svg" alt="Chat" />
        </HeaderIconCircle>

        {/* Texto Chat */}
        <HeaderTitle>Chat</HeaderTitle>

        {/* Barras decorativas en la esquina superior derecha */}
        <BarsContainer>
          <Bar height={50} />
          <Bar height={30} />
          <Bar height={15} />
        </BarsContainer>
      </Header>

      <MainContent>
        {/* Panel Izquierdo: Lista de Usuarios */}
        <LeftPanel>
          <UsersTitle>Usuarios</UsersTitle>
          <UsersList>
            {mockUsers.map((user) => (
              <UserItem
                key={user.id}
                onClick={() => handleSelectUser(user)}
                $selected={selectedUser?.id === user.id}
              >
                <AvatarWrapper>
                  <UserAvatarImg src={user.avatar} alt={user.name} />
                  <StatusDot $online={user.isOnline} />
                </AvatarWrapper>
                <UserText>
                  <UserName>{user.name}</UserName>
                  <UserStatus $online={user.isOnline}>
                    {user.isOnline ? "Online" : "Offline"}
                  </UserStatus>
                </UserText>
              </UserItem>
            ))}
          </UsersList>
        </LeftPanel>

        {/* Panel Central (Chat) */}
        <ChatPanel>
          {selectedUser ? (
            <>
              <ChatHeader>
                <UserHeader onClick={handleToggleProfileCard}>
                  <HeaderAvatarImg src={selectedUser.avatar} alt={selectedUser.name} />
                  <HeaderInfo>
                    <HeaderName>{selectedUser.name}</HeaderName>
                    <HeaderTime>4:00 PM local time</HeaderTime>
                  </HeaderInfo>
                </UserHeader>

                {showProfileCard && (
                  <ProfileCard>
                    <ProfileImg src={selectedUser.avatar} alt={selectedUser.name} />
                    <ProfileName>{selectedUser.name}</ProfileName>
                    <ProfileRole>Operator</ProfileRole>
                    <ProfileLocalTime>4:00 PM local time</ProfileLocalTime>
                    <ProfileActions>
                      <ProfileActionButton onClick={() => alert("Mensaje directo")}>
                        Message
                      </ProfileActionButton>
                      <ProfileActionButton onClick={handleVoiceCall}>
                        📞
                      </ProfileActionButton>
                      <ProfileActionButton onClick={handleVideoCall}>
                        🎥
                      </ProfileActionButton>
                    </ProfileActions>
                  </ProfileCard>
                )}
              </ChatHeader>

              {/* Mensajes */}
              <MessagesArea>
                {mockMessages
                  .filter((m) => m.userId === selectedUser.id)
                  .map((msg) => (
                    <MessageRow key={msg.id}>
                      <MsgAvatarImg src={selectedUser.avatar} alt={selectedUser.name} />
                      <MsgBubble>
                        <MsgHeader>
                          <MsgUserName>{selectedUser.name}</MsgUserName>
                          <MsgTime>{msg.time}</MsgTime>
                        </MsgHeader>
                        <MsgText>{msg.text}</MsgText>
                      </MsgBubble>
                    </MessageRow>
                  ))}
              </MessagesArea>

              {/* Barra de input para escribir mensaje */}
              <MessageInputArea>
                <InputField
                  placeholder="Escribe un mensaje..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <ReloadIcon>⟳</ReloadIcon>
              </MessageInputArea>
            </>
          ) : (
            <NoUserSelected>
              <p>Selecciona un usuario para chatear</p>
            </NoUserSelected>
          )}
        </ChatPanel>
      </MainContent>

      {/* Modal de llamada (audio / video) */}
      {callType && (
        <CallModal
          callType={callType}
          user={selectedUser}
          onClose={handleCloseCall}
        />
      )}
    </Container>
  );
}
