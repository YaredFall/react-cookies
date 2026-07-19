"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { ParseCookieValue, StringifyCookieValue } from "./parsing";
import type { SetCookieOptions } from "./store";
import { useCookieStore } from "./use-context";

export type UseCookieOptions<T = unknown> = SetCookieOptions & {
    /**  The function to parse the cookie value */
    parse?: ParseCookieValue<T>;
    /**  The function to stringify the cookie value */
    stringify?: StringifyCookieValue<T>;
};

export function useCookie<T>(name: string, defaultValue?: T, options?: UseCookieOptions<T>) {
    const store = useCookieStore();

    const getSnapshot = () => store.getCookie(name, options?.parse) ?? defaultValue;

    const value = useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);

    const set = useCallback(
        (value: T) => store.setCookie(name, value, options, options?.stringify),
        [store, name, options],
    );

    const remove = useCallback(() => store.deleteCookie(name, options), [store, name, options]);

    return [value, set, remove] as const;
}
