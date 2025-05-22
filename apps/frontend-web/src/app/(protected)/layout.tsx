// src/app/(protected)/layout.tsx
"use client";

import React, { useState } from "react";
import styled from "styled-components";
import Box from "@mui/material/Box";
import Sidebar from "@/components/Sidebar/Sidebar";
import DashboardHeader from "@/components/Header/DashboardHeader";
import { useThemeContext } from "@/components/ThemeContext";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

// Ancho cuando el sidebar está cerrado vs abierto
const COLLAPSED_WIDTH = 0;
const EXPANDED_WIDTH  = 240;
// Altura de tu header
const HEADER_HEIGHT   = 130;

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleDrawer = () => setSidebarOpen(o => !o);

  const sidebarWidth = sidebarOpen ? EXPANDED_WIDTH : COLLAPSED_WIDTH;
  const { currentTheme, changeTheme, theme } = useThemeContext();

  return (
    <Container>
      {/* El sidebar se monta solo si open===true */}
      <Sidebar
        open={sidebarOpen}
        onLogout={() => {
          localStorage.removeItem("user");
          // router.push("/auth/login") si lo necesitas
        }}
      />

      {/* Aquí usamos la prop transitoria $sidebarWidth */}
      <MainContent $sidebarWidth={sidebarWidth}>
        {/* Tu header original */}
        <DashboardHeader
          toggleDrawer={toggleDrawer}
          drawerOpen={sidebarOpen}
          sidebarWidth={sidebarWidth}
          onThemeChange={changeTheme}
          currentTheme={currentTheme}
        />

        {/* Contenido bajo el header */}
        <Box
          component="main"
          sx={{
            pt: `${HEADER_HEIGHT}px`,
            bgcolor: theme.palette.background.paper,
            flexGrow: 1,
            p: 2,
            overflowY: "auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 2,
          }}
        >
          {children}
        </Box>
      </MainContent>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

/** 
 * Usamos `$sidebarWidth` para que styled-components no lo envíe al DOM
 */
const MainContent = styled.div<{ $sidebarWidth: number }>`
  flex: 1;
  display: flex;
  flex-direction: column;

  /* desplaza el contenido según el ancho del sidebar */
  margin-left: ${({ $sidebarWidth }) => $sidebarWidth}px;
  transition: margin-left 0.3s ease;
`;
