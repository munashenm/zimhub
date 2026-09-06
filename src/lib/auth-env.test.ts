import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { canonicalZimhubHost, cookieDomainForAuthUrl } from "./auth-env";

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

describe("canonicalZimhubHost", () => {
  it("sends apex to www when that is the public origin", () => {
    assert.equal(
      canonicalZimhubHost("zimhub.co.zw", "https://www.zimhub.co.zw"),
      "www.zimhub.co.zw"
    );
  });

  it("does not touch localhost or Railway preview hosts", () => {
    assert.equal(canonicalZimhubHost("localhost:3000", "https://www.zimhub.co.zw"), null);
    assert.equal(
      canonicalZimhubHost("zimhub-production.up.railway.app", "https://www.zimhub.co.zw"),
      null
    );
  });
});
