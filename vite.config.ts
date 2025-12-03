import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
	plugins: [
		react(),

		viteStaticCopy({
			targets: [
				{ src: "src/ui/manifest.json", dest: "" },
				{ src: "public", dest: "" },
				{
					src: "src/ui/windows/background/background.html",
					dest: "windows/background",
				},
				{
					src: "src/ui/windows/in_game/in_game.html",
					dest: "windows/in_game",
				},
			],
		}),
	],
	build: {
		outDir: "dist",
		emptyOutDir: true,
		cssCodeSplit: false,
		rollupOptions: {
			input: {
				background: path.resolve(__dirname, "src/ui/windows/background/background.ts"),
				in_game: path.resolve(__dirname, "src/ui/windows/in_game/in_game.tsx"),
				main: path.resolve(__dirname, "src/main.tsx"),
			},
			output: {
				entryFileNames: "windows/[name]/[name].js",
				assetFileNames: (assetInfo) => {
					if (assetInfo.name && assetInfo.name.endsWith(".css")) {
						return "assets/styles.css";
					}
					return "assets/[name]-[hash][extname]";
				},
			},
		},
	},
});
