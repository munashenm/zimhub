import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  canonicalZimhubHost,
  cookieDomainForAuthUrl,
  shouldUseSecureAuthCookies,
} from "./auth-env";

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

describe("shouldUseSecureAuthCookies", () => {
  function withEnv(
    env: { NODE_ENV?: string; NEXTAUTH_URL?: string; AUTH_URL?: string },
    fn: () => void
  ) {
    const keys = ["NODE_ENV", "NEXTAUTH_URL", "AUTH_URL"] as const;
    const prev: Record<(typeof keys)[number], string | undefined> = {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      AUTH_URL: process.env.AUTH_URL,
    };
    try {
      for (const key of keys) {
        const value = env[key];
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
      fn();
    } finally {
      for (const key of keys) {
        const value = prev[key];
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
    }
  }

  it("forces secure cookies in production", () => {
    withEnv({ NODE_ENV: "production", NEXTAUTH_URL: "http://localhost:3000" }, () => {
      assert.equal(shouldUseSecureAuthCookies(), true);
    });
  });

  it("uses HTTPS public URL outside production", () => {
    withEnv({ NODE_ENV: "development", NEXTAUTH_URL: "https://www.zimhub.co.zw" }, () => {
      assert.equal(shouldUseSecureAuthCookies(), true);
    });
    withEnv({ NODE_ENV: "development", NEXTAUTH_URL: "http://localhost:3000" }, () => {
      assert.equal(shouldUseSecureAuthCookies(), false);
    });
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
