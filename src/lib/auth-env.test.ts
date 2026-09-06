import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { cookieDomainForAuthUrl } from "./auth-env";

describe("cookieDomainForAuthUrl", () => {
  it("shares cookies across zimhub apex and www", () => {
    assert.equal(cookieDomainForAuthUrl("https://www.zimhub.co.zw"), ".zimhub.co.zw");
    assert.equal(cookieDomainForAuthUrl("https://zimhub.co.zw"), ".zimhub.co.zw");
  });

  it("keeps host-only cookies on localhost and railway preview URLs", () => {
    assert.equal(cookieDomainForAuthUrl("http://localhost:3000"), undefined);
    assert.equal(cookieDomainForAuthUrl("https://zimhub.up.railway.app"), undefined);
  });

  it("honors an explicit override", () => {
    assert.equal(
      cookieDomainForAuthUrl("https://www.zimhub.co.zw", ".example.com"),
      ".example.com"
    );
  });
});
