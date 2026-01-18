"use client";
import * as React from "react";
import {
  ThemeProvider as NextThemesProvider
} from "next-themes";
function ThemeProvider({ children, ...props }) {
  return /* @__PURE__ */ React.createElement(NextThemesProvider, { ...props }, children);
}
export {
  ThemeProvider
};
