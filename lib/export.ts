export function cleanHtml(html: string): string {
  // Remove null bytes and other control characters
  return html
    .replace(/\x00/g, "")
    .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F]/g, "")
    .trim();
}

export function generateFilename(productName: string): string {
  return (
    productName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim() + "-landing-page.html"
  );
}
