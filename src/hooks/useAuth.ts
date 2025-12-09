// src/hooks/useAuth.ts
import { useState, useEffect } from "react";

interface AuthState {
  isAuthenticated: boolean;
  isModerator: boolean;
}

export function useAuth(): AuthState {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    isModerator: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const isModerator = localStorage.getItem("isModerator") === "true";

    setAuth({
      isAuthenticated: !!token,
      isModerator: !!token && isModerator, // Модератор только если есть токен и флаг
    });
  }, []); // Пустой массив зависимостей, чтобы хук выполнился один раз при монтировании

  return auth;
}
