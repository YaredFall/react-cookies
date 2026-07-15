/** biome-ignore-all lint/suspicious/noDocumentCookie: <CookieStore api is too new to be used in production> */
import { type ParseOptions, parseCookie, type SetCookie, type StringifyOptions, stringifySetCookie } from "cookie";

type Listener = () => void;

type DefaultCookieOptions = Partial<Omit<SetCookie, "name" | "value">>;

type CookieStoreConfig = DefaultCookieOptions & {
    /** Enable polling to pick up external cookie changes */
    polling?: number;
};

const DEFAULT_CONFIG: CookieStoreConfig = {
    path: "/",
};

class CookieStore {
    private listeners = new Set<Listener>();

    private defaults: DefaultCookieOptions;
    private polling?: number;

    private cache?: string;
    private pollTimer?: ReturnType<typeof setInterval>;

    constructor(config: CookieStoreConfig = {}) {
        const { polling, ...defaults } = { ...DEFAULT_CONFIG, ...config };

        this.defaults = defaults;
        this.polling = polling;
    }

    private notify() {
        this.listeners.forEach((l) => void l());
    }

    private handleFocus = () => this.sync();

    private sync() {
        if (this.cache === document.cookie) return;

        this.cache = document.cookie;
        this.notify();
    }

    private createPollingInterval() {
        if (this.polling) {
            window.addEventListener("focus", this.handleFocus);

            return setInterval(() => this.sync(), this.polling);
        }
        return undefined;
    }
    private cleanupPolling() {
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
            window.removeEventListener("focus", this.handleFocus);
            this.pollTimer = undefined;
        }
    }

    subscribe = (listener: Listener) => {
        this.listeners.add(listener);

        this.cache ??= document.cookie;
        this.pollTimer ??= this.createPollingInterval();

        return () => {
            this.listeners.delete(listener);

            if (this.listeners.size === 0) {
                this.cleanupPolling();
            }
        };
    };

    getCookie = (name: string, decode?: ParseOptions["decode"]): string | undefined => {
        this.cache ??= document.cookie;

        return parseCookie(this.cache, { decode })[name];
    };

    setCookie = (cookie: SetCookie, encode?: StringifyOptions["encode"]): void => {
        this.cache ??= document.cookie;

        document.cookie = stringifySetCookie({ ...this.defaults, ...cookie }, { encode });

        this.cache = document.cookie;
        this.notify();
    };

    deleteCookie = (cookie: string | Pick<SetCookie, "name" | "domain" | "path">): void => {
        const target = typeof cookie === "string" ? { name: cookie } : cookie;
        document.cookie = stringifySetCookie({
            ...this.defaults,
            ...target,
            value: "",
            maxAge: -1,
        });

        this.cache = document.cookie;
        this.notify();
    };
}

export type { CookieStoreConfig, DefaultCookieOptions };
export { CookieStore };
