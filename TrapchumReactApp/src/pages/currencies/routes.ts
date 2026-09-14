export function isCurrencyRoute(pathname: string) {
  const path = pathname.toLowerCase();
  return (
    path.startsWith("/app/currencies") ||
    path.startsWith("/account/currencies/") ||
    path === "/app/notes/currencycounter"
  );
}
