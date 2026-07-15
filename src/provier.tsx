"use client";

import type { PropsWithChildren } from "react";
import { useState } from "react";
import { CookiesContext } from "./context";
import { CookieStore, type CookieStoreConfig } from "./store";

export function CookiesProvider(props: PropsWithChildren<CookieStoreConfig>) {
    const [store] = useState(() => new CookieStore(props));

    return <CookiesContext.Provider value={store}>{props.children}</CookiesContext.Provider>;
}
