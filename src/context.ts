"use client";

import { createContext } from "react";
import type { CookieStore } from "./store";

export const CookiesContext = createContext<CookieStore | null>(null);
