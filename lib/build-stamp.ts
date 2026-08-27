/**
 * Build provenance is overwritten by the GitHub Actions workflow immediately
 * before the native Android bundle is generated. The defaults keep local Expo
 * development readable and do not require network access.
 */
export const BUILD_STAMP = {
  commit: "local-development",
  run: "local",
  builtAt: "local",
} as const;
