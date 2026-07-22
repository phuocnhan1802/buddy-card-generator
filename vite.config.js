import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT for GitHub Pages:
// If this repo is deployed at https://<user>.github.io/<repo-name>/
// set `base` to "/<repo-name>/". If it's deployed at the root
// (a user/org page, or a custom domain), set base to "/".
export default defineConfig({
  plugins: [react()],
  base: "/buddy-card-generator/", // <-- change to your repo name, or "/"
});
