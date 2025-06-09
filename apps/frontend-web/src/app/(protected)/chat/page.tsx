// app/(protected)/chat/page.tsx
"use client";

import React, { useState, useEffect } from "react";
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
import { API_URL } from "@/lib/config";
import { useSocket } from "@/context/socketContext";
import { useAuth } from "@/context/AuthContext";

interface User {
  id: number;
  username: string;
  isOnline: boolean;
  profileImage?: string;
}

interface ChatMessage {
  room: string;
  sender: string;
  recipient: string;
  text: string;
  timestamp: number;
}

type CallType = "audio" | "video" | null;

export default function ChatPage() {
  const { socket } = useSocket();
  const { user } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [room, setRoom] = useState<string>("");
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [callType, setCallType] = useState<CallType>(null);

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/users`);
        const data = await res.json();
        setUsers(data);
        setSelectedUser((prev) => prev || data[0] || null);
      } catch (err) {
        console.error("Error fetching users", err);
      }
    };
    fetchUsers();
  }, []);

  // Join room and listen for messages
  useEffect(() => {
    if (!socket || !user || !selectedUser) return;
    const newRoom = [user.username, selectedUser.username].sort().join("-");
    setRoom(newRoom);
    socket.emit("joinRoom", { room: newRoom, username: user.username });

    const handleHistory = (msgs: ChatMessage[]) => {
      setMessages(msgs);
    };
    const handleNewMessage = (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("roomHistory", handleHistory);
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("roomHistory", handleHistory);
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, user, selectedUser]);

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setShowProfileCard(false);
  };

  const handleToggleProfileCard = () => {
    setShowProfileCard((prev) => !prev);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !socket || !user || !selectedUser) return;
    socket.emit("chatMessage", {
      room,
      sender: user.username,
      recipient: selectedUser.username,
      text: inputMessage.trim(),
    });
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
            {users.map((user) => (
              <UserItem
                key={user.id}
                onClick={() => handleSelectUser(user)}
                $selected={selectedUser?.id === user.id}
              >
                <AvatarWrapper>
                  <UserAvatarImg
                    src={user.profileImage || "/logos/default-avatar.png"}
                    alt={user.username}
                  />
                  <StatusDot $online={user.isOnline} />
                </AvatarWrapper>
                <UserText>
                  <UserName>{user.username}</UserName>
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
                  <HeaderAvatarImg
                    src={selectedUser.profileImage || "/logos/default-avatar.png"}
                    alt={selectedUser.username}
                  />
                  <HeaderInfo>
                    <HeaderName>{selectedUser.username}</HeaderName>
                    <HeaderTime>4:00 PM local time</HeaderTime>
                  </HeaderInfo>
                </UserHeader>

                {showProfileCard && (
                  <ProfileCard>
                    <ProfileImg
                      src={selectedUser.profileImage || "/logos/default-avatar.png"}
                      alt={selectedUser.username}
                    />
                    <ProfileName>{selectedUser.username}</ProfileName>
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
                {messages.map((msg) => {
                  const isSelf = msg.sender === user?.username;
                  const senderUser = isSelf
                    ? user
                    : users.find((u) => u.username === msg.sender) || selectedUser;
                  return (
                    <MessageRow key={msg.timestamp}>
                      <MsgAvatarImg
                        src={senderUser?.profileImage || "/logos/default-avatar.png"}
                        alt={senderUser?.username || "user"}
                      />
                      <MsgBubble>
                        <MsgHeader>
                          <MsgUserName>{senderUser?.username}</MsgUserName>
                          <MsgTime>
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </MsgTime>
                        </MsgHeader>
                        <MsgText>{msg.text}</MsgText>
                      </MsgBubble>
                    </MessageRow>
                  );
                })}
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
