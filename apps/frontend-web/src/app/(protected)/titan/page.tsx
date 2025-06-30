// src/app/(protected)/titan/page.tsx
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  FaMicrophone,
  FaVolumeUp,
  FaVolumeMute,
  FaChartBar,
} from 'react-icons/fa';

// ———————————————————————————————
// Left‐panel questions (in English)
// ———————————————————————————————
const leftPanelQuestions = [
  {
    category: 'Inventory',
    questions: [
      'What is the total value of all products?',
      'How many distinct products are there?',
      'What is the total number of units in inventory?',
    ],
  },
  {
    category: 'Stock Levels',
    questions: [
      'Which product has the highest stock?',
      'Which product has the lowest stock?',
    ],
  },
  {
    category: 'Pricing',
    questions: [
      'Which product has the highest price?',
      'Which product has the lowest price?',
    ],
  },
  {
    category: 'Valuation',
    questions: ['What is the most valuable product in the inventory?'],
  },
  {
    category: 'Additional Queries',
    questions: [
      'When should we reorder a given product?',
      'What is the current storage capacity across our 3 warehouses?',
      'Who are our most active collaborators?',
      'What has been our cycle count accuracy rate?',
    ],
  },
];

// ———————————————————————————————
// Message type & chart kinds
// ———————————————————————————————
interface Message {
  sender: 'user' | 'bot';
  text: string;
  chart?: 'inventory' | 'stock' | 'prices' | 'valuation' | 'warehouses' | 'collaborators' | 'accuracy';
}

// ———————————————————————————————
// Demo data for charts
// ———————————————————————————————
const inventoryData = [
  { category: 'Electronics', value: 120000 },
  { category: 'Apparel', value: 70000 },
  { category: 'Home', value: 50000 },
  { category: 'Sports', value: 30000 },
];
const stockData = [
  { name: 'Prod A', value: 320 },
  { name: 'Prod B', value: 210 },
  { name: 'Prod C', value: 80 },
  { name: 'Prod D', value: 150 },
];
const priceData = [
  { name: 'Max Price', value: 1200 },
  { name: 'Min Price', value: 50 },
];
const valuationData = [
  { category: 'High Value', value: 50000 },
  { category: 'Mid Value', value: 30000 },
  { category: 'Low Value', value: 10000 },
];
const warehouseData = [
  { name: 'Warehouse 1', value: 5000 },
  { name: 'Warehouse 2', value: 3000 },
  { name: 'Warehouse 3', value: 4000 },
];
const collaboratorData = [
  { name: 'Alice', value: 120 },
  { name: 'Bob', value: 80 },
  { name: 'Carol', value: 100 },
];
const accuracyData = [
  { name: 'Accuracy %', value: 95 },
];

// ———————————————————————————————
// Theme & global styles
// ———————————————————————————————
const theme = {
  primary:   '#5CE1E6', // light blue
  secondary: '#4BBF73',
  accent:    '#FFCF00',
  bg:        '#FFFFFF',
  border:    '#DDEEFF',
  hover:     '#F0FCFF',
  text:      '#222222',
};
const GlobalStyle = createGlobalStyle`
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: "Segoe UI", sans-serif;
    background: #F4F9FF;
    color: ${theme.text};
    overflow: hidden;
  }
`;
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ———————————————————————————————
// Styled components
// ———————————————————————————————
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Header = styled.header`
  height: 60px;
  background: ${theme.primary};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  font-size: 1.5rem;
  font-weight: bold;
`;

const VoiceToggle = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
`;

const Main = styled.div`
  flex: 1;
  display: flex;
  height: calc(100% - 60px); /* fill under header */
`;

const LeftPanel = styled.aside`
  width: 300px;
  background: ${theme.bg};
  border-right: 1px solid ${theme.border};
  padding: 1rem;
  overflow-y: auto;
  height: 100%;
`;

const CategoryBox = styled.div`
  margin-bottom: 1.5rem;
`;
const CategoryTitle = styled.h2`
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  color: ${theme.secondary};
`;
const Question = styled.div`
  background: ${theme.hover};
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: ${theme.primary};
    color: #fff;
  }
`;

const ChatArea = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #F0FCFF;
  height: 100%;
`;

const Messages = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Row = styled.div<{ $me?: boolean }>`
  display: flex;
  justify-content: ${({ $me }) => ($me ? 'flex-end' : 'flex-start')};
`;

const Bubble = styled.div<{ $me?: boolean }>`
  max-width: 70%;
  background: ${({ $me }) => ($me ? theme.secondary : theme.bg)};
  color: ${({ $me }) => ($me ? '#fff' : theme.text)};
  padding: 0.7rem 1rem;
  border-radius: 10px;
  position: relative;
  animation: ${fadeIn} 0.3s ease;
  &:after {
    content: '';
    position: absolute;
    top: 12px;
    ${({ $me }) =>
      $me
        ? `right: -6px; border-left: 6px solid ${theme.secondary}`
        : `left: -6px; border-right: 6px solid ${theme.bg}`};
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
  }
`;

const Text = styled.div`
  font-size: 0.95rem;
  line-height: 1.4;
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 200px;
  margin-top: 0.5rem;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: ${theme.bg};
  border-top: 1px solid ${theme.border};
`;

const Input = styled.input`
  flex: 1;
  padding: 0.6rem 1rem;
  font-size: 0.93rem;
  border: 1px solid ${theme.border};
  border-radius: 6px;
  margin-right: 0.5rem;
  outline: none;
`;

const IconBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: ${theme.primary};
  margin-right: 0.5rem;
`;

// ———————————————————————————————
// Main component
// ———————————————————————————————
export default function TitanPage() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Hello! Select or type a question to see insights.' },
  ]);
  const [input, setInput] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  // autoscroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // text-to-speech
  const speak = (txt: string) => {
    if (!voiceEnabled) return;
    const u = new SpeechSynthesisUtterance(txt);
    u.lang = 'en-US';
    u.rate = 0.9;
    u.pitch = 1.0;
    window.speechSynthesis.speak(u);
  };

  // send logic with improved responses
  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = { sender: 'user', text: input.trim() };
    setMessages(ms => [...ms, userMsg]);
    setInput('');

    const q = input.toLowerCase();
    let botMsg: Message;

    if (q.includes('total value')) {
      botMsg = {
        sender: 'bot',
        text: 'Total inventory value is $270,000 across categories.',
        chart: 'inventory',
      };
    } else if (q.includes('distinct products')) {
      botMsg = {
        sender: 'bot',
        text: 'We have 350 distinct products in the catalog.',
      };
    } else if (q.includes('total number of units')) {
      botMsg = {
        sender: 'bot',
        text: 'Total units in inventory: 48,000 units.',
      };
    } else if (q.includes('highest stock')) {
      botMsg = {
        sender: 'bot',
        text: 'Product A leads with 320 units in stock.',
        chart: 'stock',
      };
    } else if (q.includes('lowest stock')) {
      botMsg = {
        sender: 'bot',
        text: 'Product C has the lowest stock at 80 units.',
        chart: 'stock',
      };
    } else if (q.includes('highest price')) {
      botMsg = {
        sender: 'bot',
        text: 'Max price is $1,200 for the premium model.',
        chart: 'prices',
      };
    } else if (q.includes('lowest price')) {
      botMsg = {
        sender: 'bot',
        text: 'Min price is $50 for the clearance items.',
        chart: 'prices',
      };
    } else if (q.includes('most valuable')) {
      botMsg = {
        sender: 'bot',
        text: 'High‐value products account for 50% of inventory value.',
        chart: 'valuation',
      };
    } else if (q.includes('reorder')) {
      botMsg = {
        sender: 'bot',
        text: 'Recommend reorder when stock falls below 100 units.',
        chart: 'stock',
      };
    } else if (q.includes('storage capacity')) {
      botMsg = {
        sender: 'bot',
        text: 'Current capacity usage by warehouse (in units):',
        chart: 'warehouses',
      };
    } else if (q.includes('active collaborators')) {
      botMsg = {
        sender: 'bot',
        text: 'Top collaborators by activity count:',
        chart: 'collaborators',
      };
    } else if (q.includes('accuracy rate')) {
      botMsg = {
        sender: 'bot',
        text: 'Cycle count accuracy is at 95%.',
        chart: 'accuracy',
      };
    } else {
      botMsg = {
        sender: 'bot',
        text: 'Here’s a quick overview of your inventory.',
        chart: 'inventory',
      };
    }

    setTimeout(() => {
      setMessages(ms => [...ms, botMsg]);
      speak(botMsg.text);
    }, 600);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      send();
    }
  };

  const startListening = () => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) return alert('Voice recognition not supported');
    const rec = new SR();
    rec.lang = 'en-US';
    rec.onresult = (ev: any) => setInput(ev.results[0][0].transcript);
    rec.start();
  };

  const renderChart = (type?: Message['chart']) => {
    if (type === 'inventory') {
      return (
        <ChartWrapper>
          <ResponsiveContainer>
            <BarChart data={inventoryData}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill={theme.primary} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      );
    }
    if (type === 'stock') {
      return (
        <ChartWrapper>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={stockData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {stockData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={[theme.primary, theme.secondary, theme.accent, '#888'][i % 4]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartWrapper>
      );
    }
    if (type === 'prices') {
      return (
        <ChartWrapper>
          <ResponsiveContainer>
            <BarChart data={priceData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill={theme.accent} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      );
    }
    if (type === 'valuation') {
      return (
        <ChartWrapper>
          <ResponsiveContainer>
            <BarChart data={valuationData}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill={theme.secondary} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      );
    }
    if (type === 'warehouses') {
      return (
        <ChartWrapper>
          <ResponsiveContainer>
            <BarChart data={warehouseData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill={theme.primary} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      );
    }
    if (type === 'collaborators') {
      return (
        <ChartWrapper>
          <ResponsiveContainer>
            <BarChart data={collaboratorData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill={theme.secondary} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      );
    }
    if (type === 'accuracy') {
      return (
        <ChartWrapper>
          <ResponsiveContainer>
            <BarChart data={accuracyData}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="value" fill={theme.accent} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      );
    }
    return null;
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          TITAN INSIGHTS
          <VoiceToggle onClick={() => setVoiceEnabled(v => !v)}>
            {voiceEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
          </VoiceToggle>
        </Header>
        <Main>
          <LeftPanel>
            {leftPanelQuestions.map((blk, i) => (
              <CategoryBox key={i}>
                <CategoryTitle>{blk.category}</CategoryTitle>
                {blk.questions.map((q, j) => (
                  <Question key={j} onClick={() => setInput(q)}>
                    {q}
                  </Question>
                ))}
              </CategoryBox>
            ))}
          </LeftPanel>
          <ChatArea>
            <Messages>
              {messages.map((m, idx) => (
                <Row key={idx} $me={m.sender === 'user'}>
                  <Bubble $me={m.sender === 'user'}>
                    <Text>{m.text}</Text>
                    {renderChart(m.chart)}
                  </Bubble>
                </Row>
              ))}
              <div ref={endRef} />
            </Messages>
            <Controls>
              <IconBtn onClick={startListening}>
                <FaMicrophone />
              </IconBtn>
              <Input
                value={input}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                onKeyDown={onKey}
                placeholder="Type or select a question..."
              />
              <IconBtn onClick={send}>
                <FaChartBar />
              </IconBtn>
            </Controls>
          </ChatArea>
        </Main>
      </Container>
    </>
  );
}
