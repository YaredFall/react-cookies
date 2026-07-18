import destr from "destr";

export type StringifyCookieValue<T = unknown> = (value: T) => string;
export type ParseCookieValue<T = unknown> = (value: string | null | undefined) => T;

export const defaultStringify: StringifyCookieValue = (v) => (v ? JSON.stringify(v) : String(v));
export const defaultParse: ParseCookieValue = (v) => (v ? destr(v) : v);
