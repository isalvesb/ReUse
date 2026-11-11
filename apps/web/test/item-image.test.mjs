import test from "node:test";
import assert from "node:assert/strict";
import { getItemImage } from "../src/lib/item-image.mjs";

test("preserva a foto gravada no anúncio", () => {
    assert.equal(
        getItemImage({ images: [{ url: "https://cdn.example/item.jpg" }] }),
        "https://cdn.example/item.jpg"
    );
});

test("usa uma imagem coerente quando um anúncio antigo não tem foto", () => {
    assert.equal(
        getItemImage({ title: "Tênis - TAM 35", category: { slug: "sapatos" }, images: [] }),
        "/images/itens/tenis-adidas.png"
    );
    assert.equal(
        getItemImage({ title: "iPhone 17 - Lavanda", category: { slug: "eletronicos" }, images: [] }),
        "/images/itens/iphone-17.jpg"
    );
    assert.equal(
        getItemImage({ title: "Mesa de apoio", category: { slug: "moveis" }, images: [] }),
        "/images/categorias/sofa.png"
    );
});
