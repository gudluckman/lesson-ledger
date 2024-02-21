import React, { PropsWithChildren, createContext, useState } from "react";
import { ThemeProvider } from "@pankod/refine-mui";
import { LightTheme } from "@pankod/refine-mui";

type ColorModeContextType = {
  mode: string;
  setMode: () => void;
};

export const ColorModeContext = createContext<ColorModeContextType>(
  {} as ColorModeContextType
);

export const ColorModeContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  // Always set the mode to "light" by default
  const [mode] = useState("light");

  // We don't need to use localStorage or system preference here
  const setColorMode = () => {
    // No need to change mode since it's always light
  };

  return (
    <ColorModeContext.Provider
      value={{
        setMode: setColorMode,
        mode,
      }}
    >
      <ThemeProvider theme={LightTheme}>
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
