import { useState, useEffect, useCallback } from "react";
import { CiSun } from "react-icons/ci";
import { FaMoon } from "react-icons/fa";
import Style from './ThemeMode.module.scss'

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  },[darkMode, setDarkMode]);

  return (
    <button
      onClick={toggleTheme}
      className={Style['theme-toggle']}
      aria-label="Toggle dark or light mode"
    >
      {darkMode ? <CiSun size={26} color="black" /> : <FaMoon size={16} color="white" />}
    </button>
  );
}
