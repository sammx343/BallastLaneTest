// src/context/AuthContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthContextType } from "../types";

// Inicializamos con null, pero forzamos el tipo para evitar chequeos constantes de undefined
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("poke_token")
  );

  const login = (token: string) => {
    localStorage.setItem("poke_token", token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("poke_token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
