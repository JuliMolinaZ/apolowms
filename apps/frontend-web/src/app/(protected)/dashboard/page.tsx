"use client";

import React from "react";
import styled from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { sidebarItems } from "@/components/Sidebar/sidebarItems";

const Container = styled.div`
  margin-top: 60px; /* Ajusta a la altura real de tu header */
  padding: 2rem;
  min-height: calc(100vh - 60px);
  background: url("/images/burbujas.png") no-repeat top right;
  background-size: 400px auto;
  position: relative;
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

const WelcomeText = styled.h2`
  font-size: 24px;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.palette.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 160px);
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
`;

const Card = styled.div`
  position: relative;
  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: 16px;
  box-shadow: 0 12px 12px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-3px);
  }
`;

const GradientCircle = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.palette.secondary.main} 0%,
    ${({ theme }) => theme.palette.primary.main} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CircleIcon = styled.img`
  width: 36px;
  height: 36px;
  filter: brightness(0) invert(1);
`;

const CardContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 64px;
`;

const TextContainer = styled.div`
  text-align: center;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.palette.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

const CardNumber = styled.div`
  margin-top: 6px;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.text.secondary};
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

const BarsContainer = styled.div`
  position: absolute;
  top: 12px;
  right: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
`;

const Bar = styled.div<{ height: number }>`
  width: 10px;
  height: ${(p) => p.height}px;
  border-radius: 4px;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.palette.secondary.main} 0%,
    ${({ theme }) => theme.palette.primary.main} 100%
  );
`;

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();

  // Usamos las mismas rutas principales del sidebar
  const cards = sidebarItems.map((item) => ({
    key: item.label,
    route: item.path,
    icon: item.icon,
    title: t(item.label),
    number: item.count ?? 0,
  }));

  const handleCardClick = (route: string) => {
    router.push(route);
  };

  return (
    <Container>
      <WelcomeText>
        {t("welcome", { name: user?.username ?? "Juli" })}
      </WelcomeText>

      <CardsGrid>
        {cards.map((c) => (
          <Card key={c.key} onClick={() => handleCardClick(c.route)}>
            <GradientCircle>
              <CircleIcon src={`/logos/${c.icon}`} alt={c.title} />
            </GradientCircle>

            <CardContent>
              <TextContainer>
                <CardTitle>{c.title}</CardTitle>
                <CardNumber>{c.number}</CardNumber>
              </TextContainer>
            </CardContent>

            <BarsContainer>
              <Bar height={50} />
              <Bar height={25} />
            </BarsContainer>
          </Card>
        ))}
      </CardsGrid>
    </Container>
  );
}
