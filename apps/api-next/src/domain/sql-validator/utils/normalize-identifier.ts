// Normaliza identificadores SQL para comparaciones semanticas consistentes.
export function normalizeIdentifier(identifier: string): string {
  return identifier.trim().toLowerCase();
}

