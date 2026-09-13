export const BRAND_NAME = "MessageLab";

export function normalizeBrandText(value: string): string {
  const pattern = /\b(?:Messages Lab|messages lab|MessagesLab|MessagLab|MessageLab)\b/g;
  return value.replace(pattern, (match, offset: number, source: string) => {
    const before = source[offset - 1];
    const after = source[offset + match.length];
    const extension = after === "." ? source.slice(offset + match.length + 1).match(/^[a-z0-9]+/i)?.[0] : undefined;
    const isTechnicalReference = before === "/" || before === "@" || after === "/" || ["apk", "png", "jpg", "jpeg", "webp", "tech", "com", "net", "org"].includes(extension?.toLowerCase() || "");
    return isTechnicalReference ? match : BRAND_NAME;
  });
}

export function normalizeBrandContent<T>(value: T): T {
  if (typeof value === "string") return normalizeBrandText(value) as T;
  if (Array.isArray(value)) return value.map(normalizeBrandContent) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, normalizeBrandContent(entry)])
    ) as T;
  }
  return value;
}
