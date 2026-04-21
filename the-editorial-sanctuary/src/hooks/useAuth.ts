import { useCallback, useEffect, useRef, useState } from "react";
import { emitAppError } from "../services/errorBus";
import { supabase, isSupabaseConfigured } from "../services/supabaseClient";
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
  const [googleAuthLoading, setGoogleAuthLoading] = useState(false);
  const supabaseListenerAttached = useRef(false);

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

  // Listen for Supabase auth state changes (handles Google OAuth redirect callback)
  useEffect(() => {
    if (!isSupabaseConfigured || supabaseListenerAttached.current) return;
    supabaseListenerAttached.current = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (
          (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') &&
          session?.user
        ) {
          const supaUser = session.user;
          const meta = supaUser.user_metadata ?? {};
          const fullName = (meta.full_name ?? meta.name ?? '').trim();
          const nameParts = fullName.split(/\s+/);
          const firstName = nameParts[0] ?? supaUser.email?.split('@')[0] ?? 'User';
          const lastName = nameParts.slice(1).join(' ') || firstName;

          // Only apply if no backend JWT session is already active
          const existingToken = getStoredToken();
          if (!existingToken) {
            resetAuthSessionGate();
            setSessionExpired(false);
            // Store the Supabase access token as the session token
            setStoredToken(session.access_token);
            const stored: StoredUser = {
              userId: supaUser.id,
              email: supaUser.email ?? '',
              firstName,
              lastName,
              role: 'USER',
            };
            setStoredUser(stored);
            setUser(storedToUser(stored));
          }
          setGoogleAuthLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
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

  const signInWithGoogle = useCallback(async () => {
    if (!isSupabaseConfigured) {
      emitAppError({
        topic: 'auth',
        message: 'Supabase is not configured. Cannot sign in with Google.',
        cause: 'signInWithGoogle',
      });
      throw new Error('Supabase is not configured for Google sign-in.');
    }
    setGoogleAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) {
        setGoogleAuthLoading(false);
        emitAppError({
          topic: 'auth',
          message: error.message,
          cause: 'signInWithGoogle',
        });
        throw new Error(error.message);
      }
      // The browser will redirect to Google; on return, onAuthStateChange handles the session.
    } catch (e) {
      setGoogleAuthLoading(false);
      const msg = e instanceof Error ? e.message : String(e);
      throw new Error(msg);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      // Sign out from Supabase as well (for Google OAuth users)
      if (isSupabaseConfigured) {
        await supabase.auth.signOut().catch(() => {});
      }
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
    signInWithGoogle,
    googleAuthLoading,
    signOut,
  };
}
