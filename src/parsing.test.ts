import { parseCookie, stringifySetCookie } from "cookie";
import { describe, expect, it } from "vitest";
import { defaultParse, defaultStringify } from "./parsing";

describe("encoding", () => {
    it("should encode and decode empty string", () => {
        const VALUE = "";

        const stringified = stringifySetCookie({ name: "foo", value: defaultStringify(VALUE) });
        const parsed = defaultParse(parseCookie(stringified).foo);
        expect(parsed).toEqual(VALUE);
    });

    it("should encode and decode non-empty string", () => {
        const VALUE = "hello";

        const stringified = stringifySetCookie({ name: "foo", value: defaultStringify(VALUE) });
        const parsed = defaultParse(parseCookie(stringified).foo);
        expect(parsed).toEqual(VALUE);
    });

    it("should encode and decode zero", () => {
        const VALUE = 0;

        const stringified = stringifySetCookie({ name: "foo", value: defaultStringify(VALUE) });
        const parsed = defaultParse(parseCookie(stringified).foo);
        expect(parsed).toEqual(VALUE);
    });

    it("should encode and decode number", () => {
        const VALUE = 42;

        const stringified = stringifySetCookie({ name: "foo", value: defaultStringify(VALUE) });
        const parsed = defaultParse(parseCookie(stringified).foo);
        expect(parsed).toEqual(VALUE);
    });

    it("should encode and decode undefined", () => {
        const VALUE = undefined;

        const stringified = stringifySetCookie({ name: "foo", value: defaultStringify(VALUE) });
        const parsed = defaultParse(parseCookie(stringified).foo);
        expect(parsed).toEqual(VALUE);
    });

    it("should encode and decode null", () => {
        const VALUE = null;

        const stringified = stringifySetCookie({ name: "foo", value: defaultStringify(VALUE) });
        const parsed = defaultParse(parseCookie(stringified).foo);
        expect(parsed).toEqual(VALUE);
    });

    it("should encode and decode object", () => {
        const VALUE = { foo: "bar" };

        const stringified = stringifySetCookie({ name: "foo", value: defaultStringify(VALUE) });
        const parsed = defaultParse(parseCookie(stringified).foo);
        expect(parsed).toEqual(VALUE);
    });

    it("should encode and decode array", () => {
        const VALUE = [1, 2, 3];

        const stringified = stringifySetCookie({ name: "foo", value: defaultStringify(VALUE) });
        const parsed = defaultParse(parseCookie(stringified).foo);
        expect(parsed).toEqual(VALUE);
    });
});
