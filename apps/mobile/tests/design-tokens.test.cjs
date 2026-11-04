const test = require("node:test"),
  assert = require("node:assert/strict");
const t = require("../../../design/tokens.json");
function luminance(hex) {
  const rgb = hex
    .slice(1)
    .match(/../g)
    .map((x) => parseInt(x, 16) / 255)
    .map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
function contrast(a, b) {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
test("cores semânticas mantêm contraste de texto AA nos pares efetivamente usados", () => {
  for (const [fg, bg] of [
    ["text", "background"],
    ["textMuted", "background"],
    ["textMuted", "surface"],
    ["text", "accent"],
    ["inverse", "navigation"],
    ["onDarkMuted", "navigation"],
    ["error", "surface"],
  ])
    assert.ok(contrast(t.colors[fg], t.colors[bg]) >= 4.5, `${fg}/${bg}`);
  for (const bg of ["surface", "background"])
    assert.ok(contrast(t.colors.border, t.colors[bg]) >= 3, `border/${bg}`);
});
test("escala e controles preservam alvos de toque e hierarquia legível", () => {
  const values = Object.values(t.space);
  assert.ok(
    values.every((v, i) => v > 0 && v % 4 === 0 && (!i || v > values[i - 1])),
  );
  assert.ok(t.size.control >= t.size.touch && t.size.touch >= 44);
  assert.ok(
    t.type.body >= 16 && t.type.caption >= 12 && t.type.title > t.type.subtitle,
  );
});
