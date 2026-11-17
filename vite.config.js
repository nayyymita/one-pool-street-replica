import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    build: { target: "esnext" },
    base: "/gaugeviz/",
    plugins: [
        VitePWA({
            registerType: "autoUpdate",

            manifest: {
                name: "Gauge Digital Replica",
                short_name: "GaugeViz",
                description: "Digital replica of a 3D gauge prototype with sensor data.",
                theme_color: "#121212",
                background_color: "#121212",
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
