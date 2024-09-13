export default function truncate(str: string, length = 10): string {
  return str.length > length ? str.slice(0, length) + "..." : str;
}
