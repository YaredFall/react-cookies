"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { ParseCookieValue, StringifyCookieValue } from "./parsing";
import type { SetCookieOptions } from "./store";
import { useCookieStore } from "./use-context";

export type UseCookieOptions<T = unknown> = SetCookieOptions & {
    /**  The function to parse the cookie value */
    parse?: ParseCookieValue<T>;
    /**  The function to stringify the cookie value */
    stringify?: StringifyCookieValue<T>;
};

export type UseCookieReturn<T> = [T, (value: T) => void, () => void];

// biome-ignore format: more readable
export function useCookie<T>(name: string, defaultValue?: undefined, options?: UseCookieOptions<T>): UseCookieReturn<T | undefined>;
// biome-ignore format: more readable
export function useCookie<T>(name: string, defaultValue: undefined, options?: UseCookieOptions<T> ): UseCookieReturn<unknown>;
// biome-ignore format: more readable
export function useCookie<T>(name: string, defaultValue?: T, options?: UseCookieOptions<T>): UseCookieReturn<T>;

export function useCookie<T>(name: string, defaultValue?: T, options?: UseCookieOptions<T>) {
    const store = useCookieStore();

    const getSnapshot = () => store.getCookie(name);

    const rawValue = useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);

    const value = useMemo(() => {
        const parse = options?.parse ?? store.parse;
        return parse(rawValue) ?? defaultValue;
    }, [rawValue, options?.parse, store.parse, defaultValue]);

    const set = useCallback(
        (value: T) => {
            const stringify = options?.stringify ?? store.stringify;
            store.setCookie(name, stringify(value), options);
        },
        [store, name, options?.stringify, store.stringify, options],
    );

    const remove = useCallback(() => store.deleteCookie(name, options), [store, name, options]);

    return [value, set, remove] as const;
}
