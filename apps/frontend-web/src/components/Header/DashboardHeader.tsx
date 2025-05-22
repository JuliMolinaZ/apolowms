// src/components/Header/DashboardHeader.tsx
"use client";

import React, { useState } from "react";
import styled from "styled-components";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import IconButton from "@mui/material/IconButton";
import { useAuth } from "@/context/AuthContext";
import EditProfileModal from "./EditProfileModal";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

interface DashboardHeaderProps {
  toggleDrawer: () => void;
  drawerOpen: boolean;
  sidebarWidth: number;
  onThemeChange: (index: number) => void;
  currentTheme: number;
}

const HeaderContainer = styled.header<{ $sidebarWidth: number }>`
  position: fixed;
  top: 0;
  left: ${({ $sidebarWidth }) => $sidebarWidth}px;
  width: calc(100% - ${({ $sidebarWidth }) => $sidebarWidth}px);
  height: 60px;
  background: linear-gradient(45deg, #8391ff, #a5c1ff);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1100;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserPill = styled.div`
  display: flex;
  align-items: center;
  background: linear-gradient(45deg, #6adbef, #5ce1e6);
  border-radius: 30px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
`;

const AvatarImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 0.5rem;
  object-fit: cover;
`;

const UserName = styled.span`
  color: #fff;
  font-weight: 500;
  font-size: 14px;
`;

const ThemeCircle = styled.div`
  width: 24px;
  height: 24px;
  background: #fff;
  border-radius: 50%;
  margin-left: 0.5rem;
  cursor: pointer;
`;

export default function DashboardHeader({
  toggleDrawer,
  drawerOpen,
  sidebarWidth,
  onThemeChange,
  currentTheme,
}: DashboardHeaderProps) {
  const { user } = useAuth();
  const [openProfile, setOpenProfile] = useState(false);

  return (
    <>
      <HeaderContainer $sidebarWidth={sidebarWidth}>
        <LeftSection>
          <IconButton sx={{ color: "#fff" }} onClick={toggleDrawer}>
            {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </LeftSection>

        <RightSection>
          <UserPill onClick={() => setOpenProfile(true)}>
            <AvatarImage
              src="/logos/default-avatar.png"
              alt={user?.username || "Juli"}
            />
            <UserName>{user?.username || "Juli"}</UserName>
            <ThemeCircle
              onClick={(e) => {
                e.stopPropagation();
                onThemeChange((currentTheme + 1) % 3);
              }}
            />
          </UserPill>

          {/* Aquí va el selector de idioma */}
          <LanguageSwitcher />
        </RightSection>
      </HeaderContainer>

      {openProfile && (
        <EditProfileModal
          user={
            user || {
              id: "",
              username: "Juli",
              email: "",
              role: "",
            }
          }
          onClose={() => setOpenProfile(false)}
        />
      )}
    </>
  );
}
