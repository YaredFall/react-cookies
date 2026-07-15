"use client";

import type { ParseOptions, SetCookie, StringifyOptions } from "cookie";
import { useCallback, useSyncExternalStore } from "react";
import { useCookieStore } from "./use-context";

export type UseCookieOptions = Omit<SetCookie, "name" | "value"> & {
    decode?: ParseOptions["decode"];
    encode?: StringifyOptions["encode"];
};

export function useCookie(name: string, options: UseCookieOptions = {}) {
    const store = useCookieStore();

    const getSnapshot = useCallback(() => store.getCookie(name, options.decode), [store, name, options.decode]);
    const getServerSnapshot = useCallback(() => undefined, []);

    const value = useSyncExternalStore(store.subscribe, getSnapshot, getServerSnapshot);

    const set = useCallback(
        (value: string) => store.setCookie({ name, value, ...options }, options.encode),
        [store, name, options],
    );

    const remove = useCallback(
        (options?: Pick<SetCookie, "domain" | "path">) => store.deleteCookie({ name, ...options }),
        [store, name],
    );

    return [value, set, remove] as const;
}
