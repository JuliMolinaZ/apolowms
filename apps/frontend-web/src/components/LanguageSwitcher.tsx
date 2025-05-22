// src/components/LanguageSwitcher.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const lang = i18n.resolvedLanguage;          // "es" o "en"
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Cierra el dropdown al hacer clic fuera
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const changeLanguage = (lng: "es" | "en") => {
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  const flagIcon = lang === "es" ? "🇲🇽" : "🇺🇸";

  return (
    <div className="relative inline-block" ref={ref}>
      {/* Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="p-1 ml-2 bg-white dark:bg-gray-800 rounded focus:outline-none focus:ring"
      >
        <span className="text-xl">{flagIcon}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded shadow-lg z-20"
        >
          <button
            onClick={() => changeLanguage("es")}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            🇲🇽 ES
          </button>
          <button
            onClick={() => changeLanguage("en")}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            🇺🇸 EN
          </button>
        </div>
      )}
    </div>
  );
}
