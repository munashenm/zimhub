import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isSafeCallbackUrl, loginRoleMismatch, postLoginPath } from "./auth-redirect";

describe("postLoginPath", () => {
  it("sends each role to its dashboard by default", () => {
    assert.equal(postLoginPath("BUYER"), "/dashboard");
    assert.equal(postLoginPath("SELLER"), "/seller");
    assert.equal(postLoginPath("ADMIN"), "/admin");
  });

  it("honors a safe in-app callback instead of the home page", () => {
    assert.equal(postLoginPath("BUYER", "/cart"), "/cart");
    assert.equal(postLoginPath("SELLER", "/product/phone"), "/product/phone");
    assert.equal(postLoginPath("BUYER", "/"), "/dashboard");
  });

  it("rejects open redirects", () => {
    assert.equal(isSafeCallbackUrl("https://evil.example"), false);
    assert.equal(isSafeCallbackUrl("//evil.example"), false);
    assert.equal(postLoginPath("BUYER", "//evil.example"), "/dashboard");
  });

  it("does not send buyers to seller or admin callbacks", () => {
    assert.equal(postLoginPath("BUYER", "/seller"), "/dashboard");
    assert.equal(postLoginPath("BUYER", "/admin"), "/dashboard");
    assert.equal(postLoginPath("SELLER", "/admin"), "/seller");
    assert.equal(postLoginPath("SELLER", "/seller"), "/seller");
  });
});

describe("loginRoleMismatch", () => {
  it("blocks using the wrong portal", () => {
    assert.equal(
      loginRoleMismatch("SELLER", "BUYER"),
      "This email is a buyer account. Use buyer login instead."
    );
    assert.equal(
      loginRoleMismatch("BUYER", "SELLER"),
      "This email is a seller account. Use seller login instead."
    );
    assert.equal(loginRoleMismatch("SELLER", "ADMIN"), null);
  });
});
