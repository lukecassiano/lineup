import type { Condition } from "./types";

export const initials = (n: string) =>
  n.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

export const condColor = (c: Condition): string =>
  c === "firing" ? "var(--mustard)" : c === "fair" ? "var(--teal)" : "var(--faint)";

export const condLabel = (c: Condition): string =>
  c === "firing" ? "FIRING" : c === "fair" ? "FAIR" : "FLAT";
