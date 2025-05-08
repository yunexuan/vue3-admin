import { defineConfig, presetIcons, presetAttributify, presetUno } from "unocss";

export default defineConfig({
  presets: [
    presetIcons({
      scale: 1.2,
      warn: true
    }),
    presetAttributify({
      /* preset options */
    }),
    presetUno()
    // ...custom presets
  ],
  variants: [
    {
      match: s => {
        if (s.startsWith("i-")) {
          return {
            matcher: s,
            selector: s => {
              return s.startsWith(".") ? `${s.slice(1)},${s}` : s;
            }
          };
        }
      }
    }
  ]
});
