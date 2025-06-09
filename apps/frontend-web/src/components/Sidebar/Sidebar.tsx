// src/components/Sidebar/Sidebar.tsx
"use client";

import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Button,
  IconButton,
  useTheme,
  Tooltip,
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { motion, Variants } from "framer-motion";
import { SidebarItem, sidebarItems } from "./sidebarItems";

interface SidebarProps {
  open: boolean;
  onLogout: () => void;
}

const COLLAPSED_WIDTH = 0;
const EXPANDED_WIDTH = 240;

const drawerVariants: Variants = {
  open: {
    width: EXPANDED_WIDTH,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
  closed: {
    width: COLLAPSED_WIDTH,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
};

const itemHover: Variants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
};

const Sidebar: React.FC<SidebarProps> = ({ open, onLogout }) => {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation("common", { keyPrefix: "sidebar" });
  const [openSubs, setOpenSubs] = useState<Record<string, boolean>>({});

  if (!open) return null;

  const toggleSub = (label: string) =>
    setOpenSubs((prev) => ({ ...prev, [label]: !prev[label] }));
  const navigateTo = (path: string) => router.push(path);
  const handleLogout = () => {
    localStorage.removeItem("user");
    onLogout();
    router.push("/auth/login");
  };

  return (
    <Drawer
      variant="persistent"
      open={open}
      PaperProps={{
        component: motion.div,
        variants: drawerVariants,
        initial: "closed",
        animate: "open",
        sx: {
          overflowX: "hidden",
          bgcolor: "common.white",
          boxShadow: theme.shadows[4],
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Header con logo */}
      <Box
        sx={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "common.white",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <img
          src="/logos/Apoloware.svg"
          alt="Apoloware"
          style={{ height: 48, width: "auto" }}
        />
      </Box>

      {/* Lista de items */}
      <List sx={{ flexGrow: 1, p: 0 }}>
        {sidebarItems.map((item: SidebarItem, i: number) => {
          const active = pathname === item.path;
          const hasSubs = item.subItems.length > 0;
          const expanded = !!openSubs[item.label];

          return (
            <React.Fragment key={i}>
              <ListItemButton
                onClick={() =>
                  hasSubs ? toggleSub(item.label) : navigateTo(item.path)
                }
                component={motion.div}
                variants={itemHover}
                whileHover="hover"
                sx={{
                  px: 2.5,
                  py: 1.25,
                  borderRadius: 2,
                  bgcolor: active
                    ? theme.palette.action.selected
                    : "transparent",
                  "&:hover": { bgcolor: theme.palette.action.hover },
                }}
              >
                <Tooltip title={t(item.label)} placement="right">
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 2,
                      justifyContent: "center",
                      color: active
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                    }}
                  >
                    <img
                      src={`/logos/${item.icon}`}
                      alt={item.label}
                      style={{ width: 24, height: 24 }}
                    />
                  </ListItemIcon>
                </Tooltip>

                <ListItemText
                  primary={t(item.label)}
                  sx={{
                    color: theme.palette.text.primary,
                    fontWeight: 500,
                  }}
                />

                {hasSubs && (
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSub(item.label);
                    }}
                    sx={{
                      ml: "auto",
                      transform: expanded
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform .3s",
                    }}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                )}
              </ListItemButton>

              {hasSubs && (
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <List disablePadding>
                    {item.subItems.map((sub, j) => {
                      const subActive = pathname === sub.path;
                      return (
                        <ListItemButton
                          key={j}
                          onClick={() => navigateTo(sub.path)}
                          component={motion.div}
                          variants={itemHover}
                          whileHover="hover"
                          sx={{
                            pl: 6,
                            py: 1,
                            borderRadius: 2,
                            bgcolor: subActive
                              ? theme.palette.action.selected
                              : "transparent",
                            "&:hover": {
                              bgcolor: theme.palette.action.hover,
                            },
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: 2,
                              justifyContent: "center",
                              color: subActive
                                ? theme.palette.primary.main
                                : theme.palette.text.secondary,
                            }}
                          >
                            <img
                              src={`/logos/${sub.icon}`}
                              alt={sub.label}
                              style={{ width: 20, height: 20 }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={t(sub.label)}
                            sx={{ color: theme.palette.text.primary }}
                          />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          );
        })}
      </List>

      {/* Logout */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Button
          variant="outlined"
          fullWidth
          startIcon={<ExitToAppIcon />}
          onClick={handleLogout}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderColor: theme.palette.error.main,
            color: theme.palette.error.main,
            borderRadius: 2,
          }}
        >
          {t("Logout")}
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
