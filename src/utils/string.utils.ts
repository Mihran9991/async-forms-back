export function toUnderscoreCase(text: string) {
  return text.toLowerCase().trim().replace(/ /g, "_");
}
