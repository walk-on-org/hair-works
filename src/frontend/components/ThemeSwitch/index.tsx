"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => {
    if (theme != "light") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
    console.log(theme);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      className="rounded-md focus:outline-none focus:shadow-outline-purple"
      onClick={toggleTheme}
      aria-label="Toggle color mode"
    >
      {/* click toggleTheme */}
      {theme == "light" && <MoonIcon className="w-5 h-5" />}
      {theme != "light" && <SunIcon className="w-5 h-5" />}
    </button>
  );
}
