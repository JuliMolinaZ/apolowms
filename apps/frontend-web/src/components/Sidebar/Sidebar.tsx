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
  Divider,
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

const COLLAPSED_WIDTH = 96;
const EXPANDED_WIDTH  = 240;

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
  const { t } = useTranslation();
  const [openSubs, setOpenSubs] = useState<Record<string, boolean>>({});

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
        animate: open ? "open" : "closed",
        sx: {
          overflowX: "hidden",
          bgcolor: theme.palette.grey[50],
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
          justifyContent: open ? "center" : "flex-start",
          px: open ? 0 : 2,
        }}
      >
        <img
          src="/logos/Apoloware.svg"
          alt="Apoloware"
          style={{
            height: 48,
            width: open ? "auto" : 32,
            transition: "width .2s",
          }}
        />
      </Box>

      <Divider />

      {/* Lista de items */}
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <List disablePadding>
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
                    borderLeft: active
                      ? `4px solid ${theme.palette.primary.main}`
                      : "4px solid transparent",
                    pl: open ? 3 : 2,
                    py: open ? 1.5 : 1,
                    borderRadius: 2,
                    bgcolor: active
                      ? theme.palette.action.selected
                      : "transparent",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Tooltip
                    title={t(item.label)}
                    placement="right"
                    disableHoverListener={open}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : 0,
                        justifyContent: "center",
                        "& svg, & img": {
                          fontSize: open ? 32 : 28,
                          width: open ? 32 : 28,
                          height: open ? 32 : 28,
                        },
                      }}
                    >
                      <img
                        src={`/logos/${item.icon}`}
                        alt={item.label}
                      />
                    </ListItemIcon>
                  </Tooltip>

                  <ListItemText
                    primary={t(item.label)}
                    primaryTypographyProps={{
                      noWrap: true,
                      style: {
                        opacity: open ? 1 : 0,
                        width: open ? "auto" : 0,
                        transition: "opacity .2s, width .2s",
                        letterSpacing: "0.5px",
                        fontWeight: 500,
                      },
                    }}
                  />

                  {hasSubs && open && (
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
                      <ExpandMoreIcon fontSize="small" />
                    </IconButton>
                  )}
                </ListItemButton>

                {/* Sub-items */}
                {hasSubs && (
                  <Collapse in={expanded && open} timeout="auto" unmountOnExit>
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
                              borderLeft: subActive
                                ? `4px solid ${theme.palette.primary.main}`
                                : "4px solid transparent",
                              pl: open ? 6 : 2,
                              py: 1,
                              borderRadius: 2,
                              bgcolor: subActive
                                ? theme.palette.action.selected
                                : "transparent",
                              "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 0,
                                mr: open ? 2 : 0,
                                justifyContent: "center",
                                "& svg, & img": {
                                  fontSize: open ? 20 : 18,
                                  width: open ? 20 : 18,
                                  height: open ? 20 : 18,
                                },
                              }}
                            >
                              <img
                                src={`/logos/${sub.icon}`}
                                alt={sub.label}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={t(sub.label)}
                              primaryTypographyProps={{
                                noWrap: true,
                                style: {
                                  opacity: open ? 1 : 0,
                                  width: open ? "auto" : 0,
                                  transition: "opacity .2s, width .2s",
                                  letterSpacing: "0.5px",
                                },
                              }}
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
      </Box>

      <Divider />

      {/* Logout */}
      <Box sx={{ p: 2 }}>
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
            justifyContent: open ? "flex-start" : "center",
            pl: open ? 3 : 0,
          }}
        >
          <Box
            component="span"
            sx={{
              opacity: open ? 1 : 0,
              width: open ? "auto" : 0,
              transition: "opacity .2s, width .2s",
            }}
          >
            {t("Logout")}
          </Box>
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
