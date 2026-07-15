// Simple paper-plane-like geometric aircraft icons rendered to PNG data URLs
// (north up, point up). Used as MapLibre symbol-layer icons.

function planeSvg(size: number, color: string, outline = "#34332F"): string {
  const c = (size - 1) / 2;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <filter id="s"><feDropShadow dx="0" dy="0.5" stdDeviation="0.4" flood-color="#34332F" flood-opacity="0.18"/></filter>
  </defs>
  <g filter="url(#s)">
    <path d="M ${c},${1} L ${c + 1.6},${c - 0.2} L ${c + 6},${c + 5.4} L ${c + 2.4},${c + 6.5} L ${c + 1.4},${size - 1} L ${c - 0.6},${size - 1} L ${c - 1.4},${c + 7.5} L ${c - 5},${c + 5.6} L ${c - 5.2},${c + 4.6} L ${c - 1.6},${c + 3.4} L ${c - 1.6},${c + 1.0} Z"
          fill="${color}" stroke="${outline}" stroke-width="0.6" stroke-linejoin="round" />
  </g>
</svg>`.trim();
}

function circleSvg(size: number, fill: string, outline = "#FFFDF7"): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 2}" fill="${fill}" stroke="${outline}" stroke-width="1.4"/></svg>`;
}

const enc = (s: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(s.trim())}`;

export function planeIconUrl(color: string, size = 22): string {
  return enc(planeSvg(size, color));
}

export function planeSelectedUrl(): string {
  return enc(planeSvg(28, "#EF8E7D"));
}

export function planeHoverUrl(): string {
  return enc(planeSvg(26, "#F4C95D"));
}

export function airportIconUrl(): string {
  return enc(circleSvg(22, "#78AFC8"));
}

export function locArrowUrl(): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
  <circle cx="20" cy="20" r="12" fill="rgba(120,175,200,0.18)" />
  <circle cx="20" cy="20" r="6" fill="#78AFC8" stroke="#FFFDF7" stroke-width="2" />
</svg>`;
}

export function locArrowUrlData(): string {
  return enc(locArrowUrl());
}
