/** biome-ignore-all lint/suspicious/noDocumentCookie: <CookieStore api is too new to be used in production> */
import { type ParseOptions, parseCookie, type SetCookie, type StringifyOptions, stringifySetCookie } from "cookie";

type Listener = () => void;

type DefaultCookieOptions = Partial<Omit<SetCookie, "name" | "value">>;

type CookieStoreConfig = DefaultCookieOptions & {
    /** Polling interval to pick up external cookie changes @default 1000 */
    pollingInterval?: number;
    decode?: ParseOptions["decode"];
    encode?: StringifyOptions["encode"];
};

const DEFAULT_CONFIG: CookieStoreConfig = {
    pollingInterval: 1000,
    path: "/",
};

class CookieStore {
    private listeners = new Set<Listener>();

    private defaults: DefaultCookieOptions;
    private decode: CookieStoreConfig["decode"];
    private encode: CookieStoreConfig["encode"];

    private cache?: string;

    private pollingInterval?: number;
    private poller?: ReturnType<typeof setInterval>;

    private isAutoupdating: boolean = false;

    constructor(config: CookieStoreConfig = {}) {
        const { pollingInterval, encode, decode, ...defaults } = { ...DEFAULT_CONFIG, ...config };

        this.defaults = defaults;
        this.pollingInterval = pollingInterval;
        this.decode = decode;
        this.encode = encode;
    }

    private notify() {
        this.listeners.forEach((l) => void l());
    }

    private sync() {
        if (this.cache === document.cookie) return;

        this.cache = document.cookie;
        this.notify();
    }

    private setPoller() {
        if (this.pollingInterval) {
            this.poller ??= setInterval(() => this.sync(), this.pollingInterval);
        }
    }
    private clearPoller() {
        if (this.poller) {
            clearInterval(this.poller);
            this.poller = undefined;
        }
    }

    private startAutoupdate() {
        if (this.isAutoupdating) return;

        this.isAutoupdating = true;

        const autoupdate = () => {
            const visible = document.visibilityState === "visible";

            if (visible) {
                this.sync();
                this.setPoller();
            } else {
                this.clearPoller();
            }
        };

        autoupdate();
        document.addEventListener("visibilitychange", autoupdate);

        return () => {
            this.isAutoupdating = false;

            this.clearPoller();
            document.removeEventListener("visibilitychange", autoupdate);
        };
    }

    subscribe = (listener: Listener) => {
        this.listeners.add(listener);

        this.sync();
        const stopAutoupdate = this.startAutoupdate();

        return () => {
            this.listeners.delete(listener);

            if (this.listeners.size === 0) stopAutoupdate?.();
        };
    };

    getCookie = (name: string, decode = this.decode): string | undefined => {
        this.cache ??= document.cookie;

        return parseCookie(this.cache, { decode })[name];
    };

    setCookie = (cookie: SetCookie, encode = this.encode): void => {
        this.cache ??= document.cookie;

        document.cookie = stringifySetCookie({ ...this.defaults, ...cookie }, { encode });

        this.cache = document.cookie;
        this.notify();
    };

    deleteCookie = (cookie: string | Omit<SetCookie, "value" | "maxAge" | "expires">): void => {
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
