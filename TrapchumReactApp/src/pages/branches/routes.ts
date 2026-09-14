export function isBranchRoute(pathname: string) {
  return /^\/app\/branches(\/(create|details\/[^/]+|edit\/[^/]+))?$/.test(
    pathname.toLowerCase(),
  );
}
