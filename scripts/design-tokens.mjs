import fs from "node:fs";
const root = new URL("../", import.meta.url),
  tokens = JSON.parse(
    fs.readFileSync(new URL("design/tokens.json", root), "utf8"),
  );
const kebab = (s) => s.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
const css = [
  "/* Generated from design/tokens.json; npm run design:tokens. */",
  ":root {",
];
for (const [group, values] of Object.entries(tokens)) {
  if (group === "font") continue;
  for (const [key, value] of Object.entries(values))
    css.push(
      `  --ds-${kebab(group)}-${kebab(key)}: ${value}${["space", "radius", "size", "type"].includes(group) ? "px" : group === "motion" ? "ms" : ""};`,
    );
}
for (const [name, key] of Object.entries({
  brown: "text",
  "brown-light": "textMuted",
  cream: "background",
  pink: "accent",
  white: "surface",
}))
  css.push(`  --reuse-${name}: var(--ds-colors-${kebab(key)});`);
css.push("  --reuse-beige: var(--ds-colors-text-muted);", "}", "");
const outputs = {
  "apps/web/src/app/design-tokens.css": css.join("\n"),
  "apps/mobile/src/design/tokens.ts":
    "// Generated from design/tokens.json; npm run design:tokens.\nexport const tokens = " +
    JSON.stringify(tokens, null, 2) +
    " as const;\nexport const { colors, space, radius, size, font } = tokens;\n",
};
let ok = true;
for (const [path, text] of Object.entries(outputs)) {
  const url = new URL(path, root);
  if (process.argv.includes("--check")) {
    if (!fs.existsSync(url) || fs.readFileSync(url, "utf8") !== text) {
      ok = false;
      console.error("Tokens desatualizados: " + path);
    }
  } else {
    fs.mkdirSync(new URL("./", url), { recursive: true });
    fs.writeFileSync(url, text);
  }
}
if (!ok) process.exitCode = 1;
