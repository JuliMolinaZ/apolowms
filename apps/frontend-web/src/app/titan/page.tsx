"use client";
import React, { useState } from "react";
import styled from "styled-components";
import { FaVolumeUp, FaMicrophone } from "react-icons/fa";

// ====================== PREGUNTAS DEL PANEL IZQUIERDO ======================
const leftPanelQuestions = [
  {
    category: "Inventario",
    questions: [
      "¿Cuál es el valor total de todos los productos?",
      "¿Cuántos productos hay en total?",
      "¿Cuántas unidades hay en total?",
    ],
  },
  {
    category: "Stock",
    questions: [
      "¿Cuál es el producto con más stock?",
      "¿Cuál es el producto con menos stock?",
    ],
  },
  {
    category: "Precios",
    questions: [
      "¿Cuál es el producto con mayor precio?",
      "¿Cuál es el producto con menor precio?",
    ],
  },
  {
    category: "Valoración",
    questions: ["¿Cuál es el producto más valioso del inventario?"],
  },
  {
    category: "Consultas Adicionales",
    questions: [
      "¿Cuándo es momento de pedir para este producto?",
      "¿Cuál es la capacidad actual de almacenaje de mis 3 centros de distribución?",
      "¿Quiénes son mis colaboradores más activos?",
      "¿Cuál ha sido mi porcentaje de coincidencia en los últimos conteos cíclicos?",
    ],
  },
];

// ====================== TIPADO PARA MENSAJES ======================
interface Message {
  sender: "user" | "bot";
  text: string;
  image?: string;
}

// ====================== COMPONENTE PRINCIPAL ======================
export default function TitanPage() {
  // Estado de la conversación
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "¡Hola! ¿En qué puedo ayudarte?" },
  ]);
  // Estado del input del mensaje
  const [input, setInput] = useState("");

  // Función de voz mejorada: divide el texto en oraciones y las reproduce secuencialmente.
  const speakText = (text: string) => {
    const sentences = text.split(/(?<=[.?!])\s+/);
    if (!sentences.length) return;
    let index = 0;
    const speakNext = () => {
      if (index < sentences.length) {
        const utterance = new SpeechSynthesisUtterance(sentences[index]);
        // Usamos "es-MX" para un acento más latino; ajusta rate y pitch para conseguir un tono más natural
        utterance.lang = "es-US";
        utterance.rate = 0.92; // Un poco más lento para mayor claridad
        utterance.pitch = 1.0; // Tono normal
        utterance.onend = () => {
          index++;
          speakNext();
        };
        window.speechSynthesis.speak(utterance);
      }
    };
    speakNext();
  };

  // Función para iniciar el reconocimiento de voz
  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Tu navegador no soporta el reconocimiento de voz.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "es-MX";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.onerror = (event: { error: any }) => {
      console.error("Error en reconocimiento de voz:", event.error);
    };
    recognition.start();
  };

  // Función para enviar el mensaje y llamar la API REST de Rasa
  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Agregar el mensaje del usuario
    const userMsg: Message = { sender: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);

    const payload = { sender: "usuario123", message: trimmed };

    try {
      const response = await fetch("http://localhost:5005/webhooks/rest/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      data.forEach((reply: any) => {
        const botMsg: Message = {
          sender: "bot",
          text: reply.text ? reply.text : "GRAFICO:",
          image: reply.image || null,
        };
        setMessages((prev) => [...prev, botMsg]);
      });
    } catch (error) {
      console.error("Error al conectar con Rasa:", error);
      const errorMsg: Message = { sender: "bot", text: "Hubo un error al obtener la respuesta." };
      setMessages((prev) => [...prev, errorMsg]);
    }
    setInput("");
  };

  // Permite enviar el mensaje con la tecla Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  // Al hacer clic en alguna pregunta del panel izquierdo
  const handleQuestionClick = (question: string) => {
    setInput(question);
  };

  return (
    <Container>
      <Header>
        <Logo>TITAN</Logo>
        <BubbleContainer>
          <Bubble />
        </BubbleContainer>
      </Header>

      <MainContent>
        <LeftPanel>
          {leftPanelQuestions.map((block, idx) => (
            <CategoryBox key={idx}>
              <CategoryTitle>{block.category}</CategoryTitle>
              {block.questions.map((q, i) => (
                <QuestionItem key={i} onClick={() => handleQuestionClick(q)}>
                  {q}
                </QuestionItem>
              ))}
            </CategoryBox>
          ))}
        </LeftPanel>

        <ChatContainer>
          <MessagesContainer>
            {messages.map((msg, index) => (
              <MessageRow key={index} $isUser={msg.sender === "user"}>
                <MessageBubble $isUser={msg.sender === "user"}>
                  <MessageContent>
                    <TextContent>{msg.text}</TextContent>
                    {msg.sender === "bot" && (
                      <ReadButton onClick={() => speakText(msg.text)}>
                        <FaVolumeUp />
                      </ReadButton>
                    )}
                  </MessageContent>
                  {msg.image && (
                    <MessageImage src={msg.image} alt="Reporte de Stock" />
                  )}
                </MessageBubble>
              </MessageRow>
            ))}
          </MessagesContainer>
          <InputRow>
            <MessageInput
              placeholder="Escribe un mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <MicButton onClick={startListening}>
              <FaMicrophone />
            </MicButton>
            <SendButton onClick={handleSend}>Enviar</SendButton>
          </InputRow>
        </ChatContainer>
      </MainContent>
    </Container>
  );
}

// ====================== ESTILOS ======================
const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
`;
const Header = styled.header`
  position: relative;
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  z-index: 1;
`;
const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0;
  position: relative;
  z-index: 2;
`;
const BubbleContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 60px;
  width: 60px;
  overflow: visible;
  z-index: 1;
`;
const Bubble = styled.div`
  position: absolute;
  top: -20px;
  left: -20px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a1f3c3, #4bbf73);
  opacity: 0.7;
  z-index: -1;
`;
const MainContent = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;
const LeftPanel = styled.div`
  width: 300px;
  background-color: #fff;
  border-right: 1px solid #ddd;
  padding: 1rem;
  overflow-y: auto;
`;
const CategoryBox = styled.div`
  margin-bottom: 1.5rem;
`;
const CategoryTitle = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.5rem 0;
`;
const QuestionItem = styled.div`
  background-color: #f2f2f2;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.5rem;
  color: #555;
  font-size: 0.9rem;
  cursor: pointer;
  &:hover {
    background-color: #e6e6e6;
  }
`;
const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f0f0f0;
`;
const MessagesContainer = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
interface MessageRowProps {
  $isUser: boolean;
}
const MessageRow = styled.div<MessageRowProps>`
  display: flex;
  justify-content: ${(p) => (p.$isUser ? "flex-end" : "flex-start")};
`;
interface MessageBubbleProps {
  $isUser: boolean;
}
const MessageBubble = styled.div<MessageBubbleProps>`
  max-width: 60%;
  background-color: ${(p) => (p.$isUser ? "#d7ebff" : "#ffffff")};
  color: #333;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  font-size: 0.9rem;
  line-height: 1.4;
  white-space: pre-wrap;
  position: relative;
`;
const MessageContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
const TextContent = styled.div`
  flex: 1;
  margin-right: 0.5rem;
`;
const ReadButton = styled.button`
  background-color: transparent;
  border: none;
  color: #2e67f8;
  cursor: pointer;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
`;
const MessageImage = styled.img`
  max-width: 100%;
  margin-top: 0.5rem;
  border-radius: 8px;
`;
const MicButton = styled.button`
  background-color: #2e67f8;
  color: #fff;
  border: none;
  border-radius: 50%;
  padding: 0.5rem;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #1f4cbc;
  }
`;
const InputRow = styled.div`
  display: flex;
  padding: 0.5rem;
  gap: 0.5rem;
  background-color: #fff;
  border-top: 1px solid #ddd;
`;
const MessageInput = styled.input`
  flex: 1;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0.5rem;
  font-size: 0.9rem;
  background-color: #fff;
  color: #333;
  &::placeholder {
    color: #999;
  }
  &:focus {
    outline: none;
    border-color: #999;
  }
`;
const SendButton = styled.button`
  background-color: #2e67f8;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background-color: #1f4cbc;
  }
`;
