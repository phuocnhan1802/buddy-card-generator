/**
 * useUserData.js
 * ------------------------------------------------------------
 * Single source of truth for the app's in-memory state:
 *  - which step the user is on
 *  - the current user's card data (draft, before/after Save)
 *
 * Drafts are mirrored to localStorage on every change so a
 * refresh mid-workshop doesn't lose someone's work. The Google
 * Sheet only gets updated when the user explicitly clicks Save
 * or Download (which triggers a Save first).
 * ------------------------------------------------------------
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import config from "../config";

const UserDataContext = createContext(null);

const EMPTY_USER = {
  domain: "",
  name: "",
  avatar: "",
  interests: [],
  rituals: [],
  contribute: "",
  need: "",
};

function draftKey(domain) {
  return `${config.STORAGE_KEYS.draftPrefix}${domain}`;
}

function loadDraft(domain) {
  if (!domain) return null;
  try {
    const raw = localStorage.getItem(draftKey(domain));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveDraft(domain, data) {
  if (!domain) return;
  try {
    localStorage.setItem(draftKey(domain), JSON.stringify(data));
  } catch {
    // localStorage can fail in private/incognito modes with strict
    // quotas — safe to ignore, the in-memory state still works.
  }
}

export function UserDataProvider({ children }) {
  const [step, setStep] = useState("login"); // login | step1 | step2 | step3
  const [user, setUser] = useState(EMPTY_USER);

  // On first load, resume the last session if one exists.
  useEffect(() => {
    const lastDomain = localStorage.getItem(config.STORAGE_KEYS.currentDomain);
    if (lastDomain) {
      const draft = loadDraft(lastDomain);
      if (draft) {
        setUser(draft);
        setStep("step1");
      }
    }
  }, []);

  const startSession = useCallback((baseUser) => {
    const merged = { ...EMPTY_USER, ...baseUser };
    const draft = loadDraft(merged.domain);
    const finalUser = draft ? { ...merged, ...draft, name: merged.name } : merged;
    setUser(finalUser);
    localStorage.setItem(config.STORAGE_KEYS.currentDomain, merged.domain);
    saveDraft(merged.domain, finalUser);
    setStep("step1");
  }, []);

  const updateUser = useCallback((patch) => {
    setUser((prev) => {
      const next = { ...prev, ...(typeof patch === "function" ? patch(prev) : patch) };
      saveDraft(next.domain, next);
      return next;
    });
  }, []);

  const resetSession = useCallback(() => {
    localStorage.removeItem(config.STORAGE_KEYS.currentDomain);
    setUser(EMPTY_USER);
    setStep("login");
  }, []);

  const value = useMemo(
    () => ({ step, setStep, user, updateUser, startSession, resetSession }),
    [step, user, updateUser, startSession, resetSession]
  );

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
}

export function useUserData() {
  const ctx = useContext(UserDataContext);
  if (!ctx) throw new Error("useUserData must be used within a UserDataProvider");
  return ctx;
}
