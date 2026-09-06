import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { findSessionCookieName } from "./session-cookie";

function jar(entries: Record<string, string>) {
  return {
    get: (name: string) => {
      const value = entries[name];
      return value ? { value } : undefined;
    },
  };
}

describe("findSessionCookieName", () => {
  it("prefers the Secure cookie used on HTTPS", () => {
    assert.equal(
      findSessionCookieName(
        jar({
          "__Secure-next-auth.session-token": "enc",
          "next-auth.session-token": "plain",
        })
      ),
      "__Secure-next-auth.session-token"
    );
  });

  it("falls back to the non-prefixed local-dev cookie", () => {
    assert.equal(
      findSessionCookieName(jar({ "next-auth.session-token": "enc" })),
      "next-auth.session-token"
    );
  });

  it("returns undefined when no session cookie is present", () => {
    assert.equal(findSessionCookieName(jar({ csrf: "x" })), undefined);
  });
});
