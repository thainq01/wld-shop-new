import { IconMoonDark, IconMoonLight } from "../assets/icon/ic_moon";
import { IconSunDark, IconSunLight } from "../assets/icon/ic_sun";
import { useTheme } from "../hooks/useTheme";
import { useCallback } from "react";

export function ThemeMode() {
  const { theme, switchTheme } = useTheme();

  const handleTheme = useCallback(
    (t: "dark" | "light") => {
      switchTheme(t);
    },
    [switchTheme]
  );

  return (
    <div className="flex flex-row items-center justify-center px-1 pt-0.5 bg-gray-100 dark:bg-gray-800 rounded-full self-stretch">
      <div
        className="p-1 cursor-pointer"
        onClick={() => {
          handleTheme("dark");
        }}
      >
        {theme == "dark" ? <IconMoonDark /> : <IconMoonLight />}
      </div>
      <div
        className="p-1 cursor-pointer"
        onClick={() => {
          handleTheme("light");
        }}
      >
        {theme == "dark" ? <IconSunDark /> : <IconSunLight />}
      </div>
    </div>
  );
}
