import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    build: { target: "esnext" },
    base: "/one-pool-street-replica/",
    plugins: [
        VitePWA({
            registerType: "autoUpdate",

            manifest: {
                name: "One Pool Street Digital Replica",
                short_name: "One Pool St",
                description: "Digital replica of One Pool Street with room metadata.",
                theme_color: "#2A1520",
                background_color: "#2A1520",
                display: "standalone",

                icons: [
                    {
                        src: "icon/android-chrome-192x192.png",
                        sizes: "192x192",
                        type: "image/png"
                    },
                    {
                        src: "icon/android-chrome-512x512.png",
                        sizes: "512x512",
                        type: "image/png"
                    }
                ]
            },

            workbox: {
                maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
                globPatterns: ["**/*.{js,css,html,png,svg,glb}"]
            }
        })
    ]
});
