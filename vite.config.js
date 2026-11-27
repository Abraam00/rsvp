import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	// Set to '/YOUR_REPOSITORY_NAME/' for a project GitHub Pages site.
	base: "/rsvp/",
	plugins: [react()],
	server: {
		proxy: { "/api": { target: "http://localhost:10000", changeOrigin: true } },
	},
});
