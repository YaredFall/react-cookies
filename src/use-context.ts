"use client";

import { useContext } from "react";
import { CookiesContext } from "./context";

export function useCookieStore() {
    const context = useContext(CookiesContext);
    if (!context) {
        throw new Error("useCookieStore must be used within a CookiesProvider");
    }
    return context;
}
