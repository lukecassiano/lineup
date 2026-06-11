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

// v2: migrated Spot from x/y screen coords to real lat/lng. Bumping the key
// cleanly drops any pre-migration state (MVP — no data-migration concern).
export const STATE_KEY = "lineup-mvp:state:v2";
