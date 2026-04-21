import type {
  CartItemRow,
  CartRow,
  LibraryRow,
  ProductRow,
  PublicLibraryRow,
  SubscriptionPlanRow,
} from "./api";

/** UI book shape used by existing components (no JSX changes). */
export interface UiBook {
  id: string;
  cartItemId?: string;
  productId?: string;
  title: string;
  author: string;
  category: string;
  image: string;
  downloadUrl?: string;
  isFlipbook?: boolean;
  fileFormat?: string;
  fileUrl?: string;
  price?: string;
  quantity?: number;
  rating?: number;
  progress?: number;
  description?: string;
  accessType?: string;
  status?: "Published" | "In Review" | "Draft";
  lastModified?: string;
  ref?: string;
}

export function formatMoney(amount: number | undefined): string {
  if (amount == null || Number.isNaN(Number(amount))) return "";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(amount));
  } catch {
    return `$${Number(amount).toFixed(2)}`;
  }
}

function hashSeed(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickCoverPalette(seed: number): { top: string; bottom: string; accent: string } {
  const palettes = [
    { top: "#0a2e3d", bottom: "#14697a", accent: "#67c7d4" },
    { top: "#0c3547", bottom: "#1a7d8a", accent: "#7fd4de" },
    { top: "#0b2f40", bottom: "#127a6e", accent: "#5ec4b6" },
    { top: "#0d3b4f", bottom: "#168e9c", accent: "#8ae0eb" },
    { top: "#0a2a38", bottom: "#0f6b7a", accent: "#60bfcc" },
    { top: "#0e3848", bottom: "#198590", accent: "#72d1db" },
  ];
  return palettes[seed % palettes.length];
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function estimateTextWidth(text: string, fontSize: number): number {
  // Approximate serif glyph widths so line breaks track visual width better than char count.
  let units = 0;
  for (const ch of text) {
    if (ch === " ") {
      units += 0.33;
    } else if (/[A-Z]/.test(ch)) {
      units += 0.66;
    } else if (/[MW]/.test(ch)) {
      units += 0.82;
    } else if (/[ilI1]/.test(ch)) {
      units += 0.34;
    } else {
      units += 0.56;
    }
  }
  return units * fontSize;
}

function wrapTitleLinesByWidth(title: string, maxLineWidth: number, fontSize: number): string[] {
  const words = (title || "Untitled").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return ["Untitled"];

  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if (!current) {
      current = word;
      continue;
    }
    const candidate = `${current} ${word}`;
    if (estimateTextWidth(candidate, fontSize) <= maxLineWidth) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function clampTitleLines(lines: string[], maxLines = 6): string[] {
  if (lines.length <= maxLines) return lines;
  const limited = lines.slice(0, maxLines);
  const last = limited[maxLines - 1] ?? "";
  limited[maxLines - 1] = last.length > 1 ? `${last.slice(0, -1)}…` : "…";
  return limited;
}

function isLikelyImageUrl(imageUrl: string): boolean {
  const value = (imageUrl || "").trim().toLowerCase();
  if (!value) return false;
  if (value.startsWith("data:image/")) return true;
  if (value.startsWith("blob:")) return true;

  const imageExt = /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i;
  if (imageExt.test(value)) return true;

  const nonImageExt = /\.(epub|pdf|mobi|azw|azw3|doc|docx|zip|rar|7z)(\?.*)?$/i;
  if (nonImageExt.test(value)) return false;

  // Keep extension-less CDN links working while still rejecting obvious document URLs above.
  return value.startsWith("http://") || value.startsWith("https://");
}

export function generateBookCoverDataUrl(title: string, author?: string): string {
  const safeTitle = (title || "Untitled").trim() || "Untitled";
  const safeAuthor = (author || "Unknown").trim() || "Unknown";
  const seed = hashSeed(`${safeTitle}|${safeAuthor}`);
  const palette = pickCoverPalette(seed);
  const maxTitleLines = 6;
  const maxTitleWidth = 276;
  let fontSize = 34;
  let titleLines = wrapTitleLinesByWidth(safeTitle, maxTitleWidth, fontSize);

  while ((titleLines.length > maxTitleLines || titleLines.some((line) => estimateTextWidth(line, fontSize) > maxTitleWidth)) && fontSize > 14) {
    fontSize -= 2;
    titleLines = wrapTitleLinesByWidth(safeTitle, maxTitleWidth, fontSize);
  }

  titleLines = clampTitleLines(titleLines, maxTitleLines);
  const lineHeight = Math.max(18, fontSize + 6);
  const maxTitleTop = 220;
  const minTitleTop = 145;
  const titleBlockHeight = Math.max(1, titleLines.length) * lineHeight;
  const titleY = Math.max(minTitleTop, Math.min(maxTitleTop, 320 - titleBlockHeight));
  const titleTspans = titleLines
    .map((line, index) => `<tspan x="38" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`)
    .join("");

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="360" height="520" viewBox="0 0 360 520" role="img" aria-label="${escapeXml(safeTitle)}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette.top}"/>
      <stop offset="100%" stop-color="${palette.bottom}"/>
    </linearGradient>
    <clipPath id="titleClip">
      <rect x="38" y="132" width="284" height="200" />
    </clipPath>
  </defs>
  <rect width="360" height="520" fill="url(#g)"/>
  <rect x="24" y="24" width="312" height="472" rx="20" fill="none" stroke="${palette.accent}" stroke-opacity="0.45"/>
  <rect x="24" y="342" width="312" height="1" fill="${palette.accent}" fill-opacity="0.35"/>
  <text x="38" y="106" fill="#F8FAFC" font-size="15" font-family="Georgia, serif" letter-spacing="2">MASUKI BOOKS</text>
  <text x="38" y="${titleY}" fill="#FFFFFF" font-size="${fontSize}" font-weight="700" font-family="Georgia, serif" clip-path="url(#titleClip)">${titleTspans}</text>
  <text x="38" y="392" fill="#E2E8F0" font-size="16" font-family="Arial, sans-serif">${escapeXml(safeAuthor)}</text>
</svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function resolveBookImage(imageUrl: string | undefined, title: string, author?: string): string {
  const candidate = (imageUrl ?? "").trim();
  if (candidate && isLikelyImageUrl(candidate)) return candidate;
  return generateBookCoverDataUrl(title, author);
}

export function publicRowToUiBook(p: PublicLibraryRow): UiBook {
  const title = p.title?.trim() || "Untitled";
  const author = p.author?.trim() || "Unknown";
  const rawUrl = normalizeDownloadUrl(p.fileUrl);
  const lowerUrl = rawUrl.toLowerCase();
  const isFlipbook =
    lowerUrl.includes("designrr.page") ||
    lowerUrl.includes("designrr.s3.amazonaws.com") ||
    lowerUrl.includes("type=fp") ||
    lowerUrl.includes("flipbook");
  const priceNum = p.price != null ? Number(p.price) : undefined;

  return {
    id: p.productId,
    productId: p.productId,
    title,
    author,
    category: p.categoryName?.trim() || "Digital",
    image: resolveBookImage(undefined, title, author),
    downloadUrl: rawUrl,
    isFlipbook,
    price: priceNum != null && !Number.isNaN(priceNum) ? formatMoney(priceNum) : undefined,
  };
}

function normalizeDownloadUrl(url: string | undefined): string {
  const trimmed = (url ?? "").trim();
  if (!trimmed) return "";

  const lower = trimmed.toLowerCase();
  if (lower.startsWith("http://") || lower.startsWith("https://")) {
    return trimmed;
  }

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  if (lower.startsWith("www.")) {
    return `https://${trimmed}`;
  }

  if (/^[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:\/.*)?$/i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return trimmed;
}

export function libraryRowToUiBook(p: LibraryRow): UiBook {
  const title = p.title?.trim() || "Untitled";
  const author = p.author?.trim() || "Unknown";
  const pct =
    p.readingPercentage != null
      ? Math.round(Number(p.readingPercentage))
      : undefined;
  const fileFormat = (p.fileFormat ?? '').trim();
  const normalizedFileUrl = normalizeDownloadUrl(p.fileUrl);
  const lowerUrl = normalizedFileUrl.toLowerCase();
  const isFlipbook =
    fileFormat.toLowerCase() === 'flipbook' ||
    lowerUrl.includes("designrr.page") ||
    lowerUrl.includes("designrr.s3.amazonaws.com") ||
    lowerUrl.includes("type=fp") ||
    lowerUrl.includes("flipbook");
  return {
    id: p.productId,
    title,
    author,
    category: "Your library",
    image: resolveBookImage(p.coverImageUrl, title, author),
    progress: pct,
    accessType: p.accessType,
    fileFormat,
    isFlipbook,
    fileUrl: normalizedFileUrl || undefined,
  };
}

export function cartItemToUiBook(item: CartItemRow): UiBook {
  const title = item.productTitle?.trim() || "Item";
  return {
    id: item.cartItemId,
    cartItemId: item.cartItemId,
    productId: item.productId,
    title,
    author: "",
    category: "",
    image: resolveBookImage(item.productImageUrl, title, ""),
    price: formatMoney(item.lineTotal),
    quantity: item.quantity,
    ref: item.productId,
  };
}

function mapProductStatus(s?: string): UiBook["status"] {
  const x = (s ?? "").toLowerCase();
  if (x.includes("review")) return "In Review";
  if (x === "draft" || x === "inactive" || x === "archived") return "Draft";
  return "Published";
}

export function productRowToVaultBook(p: ProductRow): UiBook {
  const title = p.title?.trim() || "Untitled";
  const author = p.author?.trim() || "Unknown";
  const created = p.createdAt
    ? new Date(p.createdAt).toLocaleDateString()
    : "";
  return {
    id: p.productId,
    title,
    author,
    category: p.categoryName?.trim() || "General",
    image: resolveBookImage(undefined, title, author),
    fileUrl: (p.fileUrl ?? "").trim() || undefined,
    status: mapProductStatus(p.status),
    lastModified: created,
    ref: p.sku?.trim() || String(p.productId).slice(0, 8),
  };
}

export function cartSubtotalLabel(cart: CartRow | null | undefined): string {
  if (!cart?.items?.length) return formatMoney(0);
  return formatMoney(Number(cart.subtotal ?? 0));
}

export interface UiSubscriptionPlan {
  id: string;
  title: string;
  price: string;
  features: string[];
  sub: string;
  recommended?: boolean;
}

export function subscriptionRowToUiPlan(
  row: SubscriptionPlanRow,
  index: number
): UiSubscriptionPlan {
  const desc = (row.description ?? "").trim();
  const features = desc
    ? desc
        .split(/(?<=[.!?])\s+|\n+/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [`${row.planName} plan`];
  return {
    id: row.subscriptionId,
    title: row.planName || "Plan",
    price: row.price != null ? String(row.price) : "0",
    features: features.length ? features : [`Access: ${row.accessPercentage ?? 100}%`],
    sub: row.durationDays
      ? `${row.durationDays}-day access window`
      : "SUBSCRIPTION",
    recommended: index === 1,
  };
}
