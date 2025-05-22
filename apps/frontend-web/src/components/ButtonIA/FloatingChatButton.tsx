"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useThemeContext } from "../ThemeContext";
import { usePathname } from "next/navigation";

// ===================== Tipado de Mensajes =====================
interface Message {
  sender: "user" | "bot";
  text: string;
}

// ===================== Preguntas Predefinidas =====================
const predefinedQueries = {
  "Gestión de Ítems": {
    "Consultas": [
      "Quiero saber el ítem con SKU-001",
      "Necesito información del producto Producto A",
      "Consulta el ítem ABC",
    ],
    "Listados": [
      "Muéstrame todos los productos",
      "Lista todos los ítems",
      "Enséñame el catálogo completo",
    ],
    "Creación": [
      "Crea un producto con SKU 504-002, nombre Sudadera, descripción Sudadera grande, precio 100 y stock 20",
    ],
    "Edición": [
      "Edita el producto SKU-001 y cambia su nombre a ProductoBotTest",
      "Modifica el ítem Producto A y actualiza su precio a 29.99 y stock a 100",
    ],
    "Eliminación": [
      "Elimina el producto Zapatos",
      "Borra el ítem Producto B",
    ],
  },
  "Informes Gerenciales": {
    "Inventario": [
      "¿Cuál es el valor total de todos los productos?",
      "¿Cuántos productos hay en total?",
      "¿Cuántas unidades hay en total?",
    ],
    "Stock": [
      "¿Cuál es el producto con más stock?",
      "¿Cuál es el producto con menos stock?",
    ],
    "Precios": [
      "¿Cuál es el producto con mayor precio?",
      "¿Cuál es el producto con menor precio?",
      "¿Cuál es el precio promedio de los productos?",
    ],
    "Valoración": [
      "¿Cuál es el producto más valioso del inventario?",
    ],
  },
  "Otras preguntas": {
    "Básicas": [
      "Hola",
      "¿Eres un bot?",
      "¿Cómo te llamas?",
      "Adiós",
    ],
  },
};

// ===================== Imágenes del Botón según el Tema =====================
// Indice 0 → theme1, indice 1 → theme2, indice 2 → theme3
const TitanChatImages = [
  "/images/titan-chat-blue.png",    // Para theme1
  "/images/titan-chat-green.png",   // Para theme2
  "/images/titan-chat-violet.png",  // Para theme3
];

// ===================== Componente Principal: TitanChatButton =====================
export default function TitanChatButton() {
  // Para saber la ruta actual (Next.js). Si NO usas Next, omite esto.
  const pathname = usePathname();

  // Ejemplo: ocultar el botón si la ruta es "/login" o "/titan"
  if (pathname === "/login" || pathname === "/titan") {
    return null; // No renderiza nada
  }

  // Obtenemos el índice del tema actual (0, 1 o 2)
  const { currentTheme } = useThemeContext();

  // Estado para abrir/cerrar el chat
  const [chatOpen, setChatOpen] = useState(false);

  // Determinamos la imagen a usar según el tema
  const chatIcon = TitanChatImages[currentTheme] || TitanChatImages[0];

  // Reiniciar la conversación
  const handleRestart = () => {
    localStorage.removeItem("chatMessages");
    setChatOpen(false);
  };

  return (
    <>
      {/* BOTÓN FLOTANTE TRANSPARENTE con la imagen */}
      <FloatingButton onClick={() => setChatOpen(!chatOpen)}>
        <IconImage src={chatIcon} alt="Titan Chat" />
      </FloatingButton>

      {/* Ventana de Chat */}
      {chatOpen && (
        <ChatWindow onClose={() => setChatOpen(false)} onRestart={handleRestart} />
      )}
    </>
  );
}

// ===================== Ventana de Chat (Misma lógica de Titan) =====================
const ChatWindow: React.FC<{ onClose: () => void; onRestart: () => void }> = ({
  onClose,
  onRestart,
}) => {
  // Mensajes en el chat
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("chatMessages");
    return saved
      ? JSON.parse(saved)
      : [
          {
            sender: "bot",
            text:
              "¡Hola, soy Titan! Estoy aquí para ayudarte con la plataforma APOLO. ¿En qué puedo ayudarte?",
          },
        ];
  });
  const [input, setInput] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  // Guardar conversación en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Enviar mensaje al backend (Rasa, etc.)
  const sendMessage = async (msg: string) => {
    // Agregar mensaje del usuario al state
    setMessages((prev) => [...prev, { sender: "user", text: msg }]);

    try {
      // Ajusta la URL a la de tu servidor Rasa (o tu endpoint de IA)
      const response = await fetch("http://localhost:5005/webhooks/rest/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: "usuario", message: msg }),
      });
      const data = await response.json();

      data.forEach((botResp: { recipient_id: string; text: string }) => {
        setMessages((prev) => [...prev, { sender: "bot", text: botResp.text }]);
      });
    } catch (error) {
      console.error("Error al enviar el mensaje a Rasa:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error de conexión con el chatbot." },
      ]);
    }
  };

  const handleSend = () => {
    if (input.trim() !== "") {
      sendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  // Copia la consulta al input al hacer clic en un botón
  const handlePredefinedClick = (query: string) => {
    setInput(query);
  };

  // Renderiza categorías y subcategorías de preguntas
  const renderPredefinedQueries = () => {
    return Object.entries(predefinedQueries).map(([category, subcats]) => (
      <CategoryContainer key={category}>
        <CategoryTitle>{category}</CategoryTitle>
        {Object.entries(subcats).map(([subcategory, queries]) => (
          <SubcategoryContainer key={subcategory}>
            <SubcategoryTitle>{subcategory}</SubcategoryTitle>
            <ButtonGroup>
              {queries.map((query, index) => (
                <QueryButton key={index} onClick={() => handlePredefinedClick(query)}>
                  {query}
                </QueryButton>
              ))}
            </ButtonGroup>
          </SubcategoryContainer>
        ))}
      </CategoryContainer>
    ));
  };

  return (
    <ChatContainer>
      {/* Header del Chat */}
      <ChatHeader>
        <h3>TITAN</h3>
        <HeaderButtons>
          <HelpButton onClick={() => setShowHelp((prev) => !prev)}>Ayuda</HelpButton>
          <RestartButton onClick={onRestart}>Reiniciar</RestartButton>
          <CloseButton onClick={onClose}>X</CloseButton>
        </HeaderButtons>
      </ChatHeader>

      {/* Panel de Ayuda / Preguntas Predefinidas */}
      {showHelp && (
        <HelpWrapper>
          <HelpContainer>
            <HelpTitle>Preguntas Disponibles</HelpTitle>
            <HelpInfo>
              APOLO es una plataforma integral para la gestión de inventarios y
              operaciones logísticas. Con Titan, puedes gestionar ítems
              (consultar, crear, editar, eliminar) y obtener informes gerenciales.
            </HelpInfo>
            {renderPredefinedQueries()}
          </HelpContainer>
        </HelpWrapper>
      )}

      {/* Lista de Mensajes */}
      <ChatMessages>
        {messages.map((msg, index) => (
          <MessageBubble key={index} $isUser={msg.sender === "user"}>
            {msg.text}
          </MessageBubble>
        ))}
      </ChatMessages>

      {/* Input y Botón "Enviar" */}
      <ChatInputContainer>
        <ChatInput
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu mensaje..."
        />
        <SendButton onClick={handleSend}>Enviar</SendButton>
      </ChatInputContainer>
    </ChatContainer>
  );
};

/* ===================== Styled Components ===================== */

// BOTÓN FLOTANTE TRANSPARENTE
const FloatingButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 2000;
  outline: none;
  height: 60px;
  width: 60px;
  border: none;
  border-radius: 50%;
  background-color: transparent;  /* Sin fondo */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
`;

// Imagen que se muestra dentro del botón
const IconImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none; /* para que el click pase al botón */
`;

// Contenedor principal del Chat
const ChatContainer = styled.div`
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 400px;
  height: 550px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  z-index: 2100;
`;

// Header del Chat
const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2e67f8;
  color: white;
  padding: 0.5rem 1rem;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;

  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
  }
`;

// Botones en el Header
const HeaderButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const HelpButton = styled.button`
  background: transparent;
  border: 1px solid white;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
`;

const RestartButton = styled.button`
  background: transparent;
  border: 1px solid white;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
`;

// Sección de Ayuda
const HelpWrapper = styled.div`
  padding: 0 1rem;
`;

const HelpContainer = styled.div`
  background: #f0f0f0;
  color: #333;
  padding: 0.5rem;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  max-height: 180px;
  overflow-y: auto;
`;

const HelpTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  font-weight: bold;
`;

const HelpInfo = styled.p`
  margin: 0 0 0.5rem 0;
  font-size: 0.8rem;
`;

const CategoryContainer = styled.div`
  margin-bottom: 0.5rem;
`;

const CategoryTitle = styled.h5`
  margin: 0 0 0.3rem 0;
  font-size: 0.85rem;
  font-weight: bold;
  color: #555;
`;

const SubcategoryContainer = styled.div`
  margin-bottom: 0.3rem;
`;

const SubcategoryTitle = styled.p`
  margin: 0 0 0.2rem 0;
  font-size: 0.8rem;
  font-weight: bold;
  color: #777;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const QueryButton = styled.button`
  background: #2e67f8;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.3rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #1f4cbc;
  }
`;

// Área de mensajes
const ChatMessages = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  background: #f5f5f5;
`;

// Burbuja de mensaje
const MessageBubble = styled.div<{ $isUser: boolean }>`
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: ${(props) => (props.$isUser ? "blue" : "#333")};
  text-align: ${(props) => (props.$isUser ? "right" : "left")};
  padding: 0.5rem;
  background: ${(props) => (props.$isUser ? "#e0f7fa" : "#fff")};
  border-radius: 8px;
  max-width: 80%;
  align-self: ${(props) => (props.$isUser ? "flex-end" : "flex-start")};
`;

// Input + Botón "Enviar"
const ChatInputContainer = styled.div`
  display: flex;
  padding: 0.5rem;
  border-top: 1px solid #ccc;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: none;
  outline: none;
  color: black;
  background: #fff;
`;

const SendButton = styled.button`
  padding: 0.5rem 1rem;
  background: #2e67f8;
  color: white;
  border: none;
  cursor: pointer;
  margin-left: 0.5rem;
`;
