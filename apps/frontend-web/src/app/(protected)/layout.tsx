// src/app/(protected)/layout.tsx
"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { Box, Toolbar } from "@mui/material";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar/Sidebar";
import DashboardHeader from "@/components/Header/DashboardHeader";
import { useThemeContext } from "@/components/ThemeContext";

interface Props { children: React.ReactNode; }

const COLLAPSED_WIDTH = 0;
const EXPANDED_WIDTH  = 240;
const HEADER_HEIGHT   = 64; // ajusta a la altura real de tu AppBar

export default function ProtectedLayout({ children }: Props) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleDrawer = () => setSidebarOpen(o => !o);
  const sidebarWidth = sidebarOpen ? EXPANDED_WIDTH : COLLAPSED_WIDTH;
  const { theme, currentTheme, changeTheme } = useThemeContext();

  return (
    <FlexContainer>
      <Sidebar
        open={sidebarOpen}
        onLogout={() => {
          localStorage.removeItem("user");
          router.push("/auth/login");
        }}
      />

      <MainContent $sidebarWidth={sidebarWidth}>
        <DashboardHeader
          toggleDrawer={toggleDrawer}
          drawerOpen={sidebarOpen}
          sidebarWidth={sidebarWidth}
          onThemeChange={changeTheme}
          currentTheme={currentTheme}
        />
        <Toolbar /> {/* reserva el espacio del AppBar */}
        <Box
          component="main"
          sx={{
            bgcolor: theme.palette.background.paper,
            flexGrow: 1,
            p: 2,
            overflowY: "auto",
          }}
        >
          {children}
        </Box>
      </MainContent>
    </FlexContainer>
  );
}

const FlexContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const MainContent = styled.div<{ $sidebarWidth: number }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: ${({ $sidebarWidth }) => $sidebarWidth}px;
  transition: margin-left 0.3s ease;
`;
