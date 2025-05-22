"use client";

import React, { useState, useEffect } from "react";
import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import styled, { keyframes } from "styled-components";
import DashboardHeader from "@/components/Header/DashboardHeader";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { themes } from "@/theme/themes"; // Sin getDailyTheme

const drawerOpenWidth = 200;
const collapsedWidth = 60;
const gapBetweenSidebarAndContent = -200;
const headerHeight = 64;

const fadeInSlide = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

interface MainContentProps {
  open: boolean;
}

const MainContent = styled.main<MainContentProps>`
  flex-grow: 1;
  padding: 24px;
  margin-top: ${headerHeight}px;
  margin-left: ${({ open }) =>
    open ? `${drawerOpenWidth + gapBetweenSidebarAndContent}px` : `${collapsedWidth}px`};
  transition: margin 0.3s ease;
  animation: ${fadeInSlide} 0.5s ease-out;
`;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [themeIndex, setThemeIndex] = useState<number>(0); // Empieza en 0
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("selectedThemeIndex");
      if (stored) {
        const parsed = Number(stored);
        // Verifica que sea válido
        if (!isNaN(parsed) && parsed >= 0 && parsed < themes.length) {
          setThemeIndex(parsed);
        } else {
          // Si no es válido, simplemente usamos 0 (tema1)
          setThemeIndex(0);
        }
      } else {
        // No había nada guardado => usamos 0
        setThemeIndex(0);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedThemeIndex", themeIndex.toString());
    }
  }, [themeIndex]);

  if (!mounted) return null;

  const toggleDrawer = () => setDrawerOpen((prev) => !prev);
  const currentTheme = themes[themeIndex]; // Toma el tema según el índice

  const handleLogout = () => {
    window.location.href = "/auth/login";
  };

  const currentSidebarWidth = drawerOpen ? drawerOpenWidth : collapsedWidth;

  return (
    <MuiThemeProvider theme={currentTheme}>
      <StyledThemeProvider theme={currentTheme}>
        <CssBaseline />

        <DashboardHeader
          toggleDrawer={toggleDrawer}
          drawerOpen={drawerOpen}
          sidebarWidth={currentSidebarWidth}
          onThemeChange={(newIndex: number) => setThemeIndex(newIndex)}
          currentTheme={themeIndex}
        />

        <Box sx={{ display: "flex", marginTop: `${headerHeight}px` }}>
          <Sidebar open={drawerOpen} onLogout={handleLogout} />
          <MainContent open={drawerOpen}>{children}</MainContent>
        </Box>
      </StyledThemeProvider>
    </MuiThemeProvider>
  );
}
