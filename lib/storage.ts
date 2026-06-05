export const storage = {
  get: async (key: string): Promise<{ value: string } | null> => {
    if (typeof window === "undefined") return null;
    const v = localStorage.getItem(key);
    return v ? { value: v } : null;
  },
  set: async (key: string, value: string): Promise<void> => {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, value);
  },
};

export const STATE_KEY = "lineup-mvp:state";
