import { useCallback, useEffect, useState } from "react";
import { emitAppError } from "../services/errorBus";
import {
  clearStoredToken,
  getStoredToken,
  getStoredUser,
  postAdminLogin,
  postLogin,
  postRegister,
  resetAuthSessionGate,
  SESSION_INVALID_EVENT,
  setStoredToken,
  setStoredUser,
  type AuthPayload,
  type StoredUser,
} from "../services/api";

export interface AuthUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

function payloadToStored(auth: AuthPayload): StoredUser {
  return {
    userId: auth.userId,
    email: auth.email,
    firstName: auth.firstName,
    lastName: auth.lastName,
    role: auth.role,
  };
}

function storedToUser(s: StoredUser): AuthUser {
  return {
    userId: s.userId,
    email: s.email,
    firstName: s.firstName,
    lastName: s.lastName,
    role: s.role,
  };
}

/**
 * Backend JWT only. `sessionExpired` flips true on {@link SESSION_INVALID_EVENT} to gate UX/toasts later.
 */
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  const applyAuthPayload = useCallback((auth: AuthPayload) => {
    resetAuthSessionGate();
    setSessionExpired(false);
    setStoredToken(auth.accessToken);
    const stored = payloadToStored(auth);
    setStoredUser(stored);
    setUser(storedToUser(stored));
  }, []);

  const clearSession = useCallback(() => {
    resetAuthSessionGate();
    clearStoredToken();
    setUser(null);
    setSessionExpired(false);
  }, []);

  useEffect(() => {
    const token = getStoredToken();
    const stored = getStoredUser();
    if (token && stored) {
      setUser(storedToUser(stored));
    } else {
      setUser(null);
    }
    setInitializing(false);

    const onInvalid = () => {
      setUser(null);
      setSessionExpired(true);
    };
    window.addEventListener(SESSION_INVALID_EVENT, onInvalid);
    return () => {
      window.removeEventListener(SESSION_INVALID_EVENT, onInvalid);
    };
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const trimmed = email.trim();
      if (!trimmed || !password) {
        throw new Error("Email and password are required.");
      }
      try {
        const auth = await postLogin(trimmed, password);
        applyAuthPayload(auth);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        emitAppError({
          topic: "auth",
          message: msg,
          cause: "signIn",
        });
        throw new Error(msg);
      }
    },
    [applyAuthPayload]
  );

  const signInAdmin = useCallback(
    async (email: string, password: string) => {
      const trimmed = email.trim();
      if (!trimmed || !password) {
        throw new Error("Email and password are required.");
      }
      try {
        const auth = await postAdminLogin(trimmed, password);
        applyAuthPayload(auth);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        emitAppError({
          topic: "auth",
          message: msg,
          cause: "signInAdmin",
        });
        throw new Error(msg);
      }
    },
    [applyAuthPayload]
  );

  const signUp = useCallback(
    async (
      fullName: string,
      email: string,
      password: string,
      phone: string
    ) => {
      const parts = fullName.trim().split(/\s+/);
      const firstName = parts[0] ?? "";
      const lastName = parts.slice(1).join(" ") || firstName;
      const em = email.trim();
      const normalizedPhone = (phone ?? "").replace(/\D+/g, "").trim();
      if (!em || !password || password.length < 8) {
        throw new Error(
          "Valid email and password (8+ characters) are required."
        );
      }
      try {
        const auth = await postRegister({
          email: em,
          password,
          firstName,
          lastName,
          phoneNumber: normalizedPhone.length > 0 ? normalizedPhone : undefined,
          piiConsent: true,
        });
        applyAuthPayload(auth);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        emitAppError({
          topic: "auth",
          message: msg,
          cause: "signUp",
        });
        throw new Error(msg);
      }
    },
    [applyAuthPayload]
  );

  const signOut = useCallback(async () => {
    try {
      clearSession();
    } catch (e) {
      console.warn("[auth] signOut:", e);
    }
  }, [clearSession]);

  return {
    user,
    initializing,
    sessionExpired,
    isAuthenticated: !!user,
    isAdmin: (user?.role ?? "").toUpperCase() === "ADMIN",
    signIn,
    signInAdmin,
    signUp,
    signOut,
  };
}
