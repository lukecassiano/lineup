"use client";

import { useMemo } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Spot } from "@/lib/types";
import { condColor } from "@/lib/utils";

interface Props {
  spots: Spot[];
  discovered: string[];
  dropMode: boolean;
  pendingPin: { lat: number; lng: number } | null;
  center: [number, number];
  zoom: number;
  onSpot: (spot: Spot) => void;
  onPlacePin: (lat: number, lng: number) => void;
}

const CREAM = "#f3e8d2";
const INK = "#2a1f15";

const LOCK_SVG = `<svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="${CREAM}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`;

/** Build the catalog-styled DivIcon HTML for a spot. */
function pinIcon(spot: Spot, known: boolean): L.DivIcon {
  const firing = spot.cond === "firing" && !spot.secret && known;
  const fill = spot.secret ? INK : known ? condColor(spot.cond) : "var(--faint)";

  const ring = firing
    ? "0 0 0 4px rgba(217,168,71,.28), 0 2px 4px rgba(42,31,21,.35)"
    : spot.secret
    ? "0 0 0 3px rgba(42,31,21,.32), 0 2px 4px rgba(42,31,21,.35)"
    : "0 2px 4px rgba(42,31,21,.3)";

  const inner = spot.secret
    ? LOCK_SVG
    : firing
    ? `<span style="width:5px;height:5px;border-radius:50%;background:${CREAM}"></span>`
    : "";

  const label =
    known && !spot.userDropped
      ? `<span class="lu-label">${spot.name}</span>`
      : spot.userDropped
      ? `<span class="lu-label lu-label--mine">${spot.name}</span>`
      : "";

  const html = `
    <div class="lu-pin${dropClass(spot)}">
      <span class="lu-dot" style="background:${fill};box-shadow:${ring}">${inner}</span>
      ${label}
    </div>`;

  return L.divIcon({
    html,
    className: "lu-pin-wrap",
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

function dropClass(spot: Spot) {
  return spot.userDropped ? " lu-pin--mine" : "";
}

function pendingIcon(): L.DivIcon {
  return L.divIcon({
    html: `<span class="lu-pending"></span>`,
    className: "lu-pin-wrap",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

function ClickCatcher({
  dropMode,
  onPlacePin,
}: {
  dropMode: boolean;
  onPlacePin: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      if (dropMode) onPlacePin(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapCanvas({
  spots,
  discovered,
  dropMode,
  pendingPin,
  center,
  zoom,
  onSpot,
  onPlacePin,
}: Props) {
  const markers = useMemo(
    () =>
      spots.map((s) => {
        const known = discovered.includes(s.id) || !!s.userDropped;
        return (
          <Marker
            key={s.id}
            position={[s.lat, s.lng]}
            icon={pinIcon(s, known)}
            eventHandlers={{ click: () => !dropMode && onSpot(s) }}
          />
        );
      }),
    [spots, discovered, dropMode, onSpot]
  );

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      zoomControl={false}
      attributionControl={false}
      scrollWheelZoom
      style={{ width: "100%", height: "100%", background: "var(--cream)" }}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      <ClickCatcher dropMode={dropMode} onPlacePin={onPlacePin} />
      {markers}
      {pendingPin && (
        <Marker position={[pendingPin.lat, pendingPin.lng]} icon={pendingIcon()} interactive={false} />
      )}
    </MapContainer>
  );
}
