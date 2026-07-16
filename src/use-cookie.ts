"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { CookieDecoder, CookieEncoder, CookieOptions } from "./store";
import { useCookieStore } from "./use-context";

export type UseCookieOptions = CookieOptions & {
    default?: string;
    decode?: CookieDecoder;
    encode?: CookieEncoder;
};

export function useCookie(name: string, options: UseCookieOptions = {}) {
    const store = useCookieStore();

    const getSnapshot = () => store.getCookie(name, options.decode) ?? options.default;
    const getServerSnapshot = () => options.default;

    const value = useSyncExternalStore(store.subscribe, getSnapshot, getServerSnapshot);

    const set = useCallback(
        (value: string) => store.setCookie(name, value, options, options.encode),
        [store, name, options],
    );

    const remove = useCallback(() => store.deleteCookie(name, options), [store, name, options]);

    return [value, set, remove] as const;
}
