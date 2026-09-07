import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";

export default {
  ...defineCloudflareConfig({}),
  // OpenNext normally runs `npm run build`, which would recurse into this file.
  // Call Next.js directly so the adapter can set standalone output first.
  buildCommand: "npx next build",
};
