// Simple paper-plane-like geometric aircraft icons. Icons are converted to
// ImageData via a canvas to avoid MapLibre's "source width is 0" race when
// calling addImage before the underlying <img> has decoded.

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

function locArrowSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="12" fill="rgba(120,175,200,0.18)" /><circle cx="20" cy="20" r="6" fill="#78AFC8" stroke="#FFFDF7" stroke-width="2" /></svg>`;
}

const enc = (s: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(s.trim())}`;

const planeSvgUrl = (color: string, size = 22) => enc(planeSvg(size, color));
const planeSelectedSvgUrl = () => enc(planeSvg(28, "#EF8E7D"));
const planeHoverSvgUrl = () => enc(planeSvg(26, "#F4C95D"));
const airportSvgUrl = () => enc(circleSvg(22, "#78AFC8"));
const locArrowSvgUrl = () => enc(locArrowSvg());

// Decode an SVG data URL into fully-rendered ImageData. Resolves only when the
// image is ready so addImage() never sees a 0×0 canvas.
export async function svgUrlToImageData(
  url: string,
  width: number,
  height: number,
): Promise<ImageData> {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.decoding = "async";
  img.src = url;
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = (e) => reject(new Error("icon decode failed"));
  });
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: false });
  if (!ctx) throw new Error("no 2d context");
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height);
}

export async function loadAllAircraftIcons(): Promise<Record<string, { data: ImageData; width: number; height: number }>> {
  const make = async (url: string, w: number, h: number) => {
    const data = await svgUrlToImageData(url, w, h);
    return { data, width: w, height: h };
  };
  const PLANE_W = 22;
  const PLANE_H = 22;

  const colors: { id: string; hex: string }[] = [
    { id: "base", hex: "#A7B8C9" },
    { id: "yellow", hex: "#F4C95D" },
    { id: "coral", hex: "#EF8E7D" },
    { id: "green", hex: "#8CC7A1" },
    { id: "blue", hex: "#78AFC8" },
    { id: "lavender", hex: "#B8A7D9" },
    { id: "orange", hex: "#E6A15C" },
    { id: "danger", hex: "#D96C6C" },
  ];

  const entries: [string, { data: ImageData; width: number; height: number }][] = [];
  for (const c of colors) {
    const def = await make(planeSvgUrl(c.hex, 22), PLANE_W, PLANE_H);
    entries.push([`plane-${c.id}`, def]);
  }
  const sel = await make(planeSelectedSvgUrl(), 28, 28);
  entries.push(["plane-selected", sel]);
  const hov = await make(planeHoverSvgUrl(), 26, 26);
  entries.push(["plane-hovered", hov]);
  const loc = await make(locArrowSvgUrl(), 40, 40);
  entries.push(["loc-arrow-img", loc]);

  return Object.fromEntries(entries);
}
