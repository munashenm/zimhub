import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { resolveCategorySlug } from "./category-routes";

describe("resolveCategorySlug", () => {
  it("maps nested Bob Shop-style paths to ZimHub slugs", () => {
    assert.equal(resolveCategorySlug(["computing-office", "laptops"]), "computers");
    assert.equal(resolveCategorySlug(["digital", "smartphones"]), "phones");
    assert.equal(resolveCategorySlug(["automotive"]), "car-parts");
  });

  it("accepts native category slugs", () => {
    assert.equal(resolveCategorySlug(["phones"]), "phones");
    assert.equal(resolveCategorySlug(["home-appliances"]), "home-appliances");
    assert.equal(resolveCategorySlug(["farming-supplies"]), "farming-supplies");
  });

  it("uses the last matching segment when possible", () => {
    assert.equal(resolveCategorySlug(["anything", "laptops"]), "computers");
  });

  it("returns null for unknown or empty paths", () => {
    assert.equal(resolveCategorySlug(["not-a-category"]), null);
    assert.equal(resolveCategorySlug([]), null);
    assert.equal(resolveCategorySlug(undefined), null);
  });
});
