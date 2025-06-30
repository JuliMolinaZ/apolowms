// src/components/DashboardMenuPage.tsx
"use client";

import React from "react";
import styled from "styled-components";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const Container = styled.div`
  margin-top: 60px;
  padding: 2rem;
  min-height: calc(100vh - 60px);
  background: url("/images/burbujas.png") no-repeat top right;
  background-size: 400px auto;
  position: relative;
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

const PageTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.palette.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 20px;
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

export interface MenuCard {
  key: string;
  number: number;
  route: string;
}

export interface DashboardMenuPageProps {
  /**
   * Título de la página.
   * Si no lo quieres mostrar, basta con pasar showWelcome={false}.
   */
  title?: string;
  cards: MenuCard[];
  logosMapping: Record<string, string>;
  showWelcome?: boolean;
}

export default function DashboardMenuPage({
  title,
  cards,
  logosMapping,
  showWelcome = true,
}: DashboardMenuPageProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();

  return (
    <Container>
      {showWelcome && (
        <PageTitle>
          {t("welcome", { name: user?.username ?? "Juli" })}
        </PageTitle>
      )}

      {title && !showWelcome && <PageTitle>{title}</PageTitle>}

      <CardsGrid>
        {cards.map((c) => {
          // Capitalizamos si no tienes traducción disponible
          const label =
            t(`cards.${c.key}`) !== `cards.${c.key}`
              ? t(`cards.${c.key}`)
              : c.key.charAt(0).toUpperCase() + c.key.slice(1);

          return (
            <Card key={c.key} onClick={() => router.push(c.route)}>
              <GradientCircle>
                <CircleIcon
                  src={`/logos/${logosMapping[c.key]}`}
                  alt={label}
                />
              </GradientCircle>

              <CardContent>
                <CardTitle>{label}</CardTitle>
                <CardNumber>{c.number}</CardNumber>
              </CardContent>

              <BarsContainer>
                <Bar height={50} />
                <Bar height={25} />
              </BarsContainer>
            </Card>
          );
        })}
      </CardsGrid>
    </Container>
  );
}
