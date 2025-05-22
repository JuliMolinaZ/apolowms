"use client";

import React from "react";
import styled from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const Container = styled.div`
  margin-top: 60px; /* Ajusta a la altura real de tu header */
  padding: 2rem;
  min-height: calc(100vh - 60px);
  background: url("/images/burbujas.png") no-repeat top right;
  background-size: 400px auto;
  position: relative;

  /* Usamos la misma tipografía que en el Sidebar */
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

const WelcomeText = styled.h2`
  font-size: 24px;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.palette.text.primary};

  /* Aseguramos la misma fuente */
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

  /* Fuente igual a la del sidebar */
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

const CardNumber = styled.div`
  margin-top: 6px;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.text.secondary};

  /* La misma tipografía */
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

const logosMapping: Record<string, string> = {
  users: "user.svg",
  picking: "pickin.svg",
  slotting: "slotting.svg",
  dashboards: "dashboard.svg",
  packing: "packing.svg",
  location: "location.svg",
  arrivals: "arrivals.svg",
  putaway: "putaway.svg",
  items: "cube.svg",
};

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();

  const cards = [
    { key: "users", number: 10, route: "/users" },
    { key: "picking", number: 27, route: "/picking" },
    { key: "slotting", number: 35, route: "/slotting" },
    { key: "dashboards", number: 10, route: "/dashboards" },
    { key: "packing", number: 10, route: "/packing" },
    { key: "location", number: 10, route: "/locations" },
    { key: "arrivals", number: 10, route: "/arrivals" },
    { key: "putaway", number: 10, route: "/putaway" },
    { key: "items", number: 10, route: "/items" },
  ];

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
              <CircleIcon
                src={`/logos/${logosMapping[c.key]}`}
                alt={t(`cards.${c.key}`)}
              />
            </GradientCircle>

            <CardContent>
              <TextContainer>
                <CardTitle>{t(`cards.${c.key}`)}</CardTitle>
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
