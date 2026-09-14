export function isCustomerRoute(pathname: string) {
  const path = pathname.toLowerCase();
  return (
    path.startsWith("/app/customers") ||
    /^\/customers\/[^/]+\/update$/.test(path)
  );
}
