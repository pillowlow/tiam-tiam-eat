/** Path to a file in public/assets, respecting Vite's base URL. */
export function asset(name: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");
  return `${base}assets/${name}`;
}
