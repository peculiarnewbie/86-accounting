import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import solidJs from "@astrojs/solid-js";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
    output: "server",
    adapter: cloudflare({
        runtime: {
            mode: "local",
            type: "pages",
            bindings: {
                D1: {
                    type: "d1",
                },
            },
        },
    }),
    integrations: [solidJs(), tailwind({ applyBaseStyles: true })],
});
