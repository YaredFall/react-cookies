/** biome-ignore-all lint/suspicious/noDocumentCookie: <CookieStore api is too new to be used in production> */
import { parseCookie, type SetCookie, stringifySetCookie } from "cookie";
import { defaultParse, defaultStringify, type ParseCookieValue, type StringifyCookieValue } from "./parsing";

type Listener = () => void;

type SetCookieOptions = Omit<SetCookie, "name" | "value" | "httpOnly">;
type DeleteCookieOptions = Omit<SetCookieOptions, "maxAge" | "expires">;

type CookieString = string | null | undefined;

type CookieStoreConfig = SetCookieOptions & {
    initialCookieString?: CookieString;
    /** Polling interval to pick up external cookie changes @default 1000 */
    pollingInterval?: number;
    stringify?: StringifyCookieValue;
    parse?: ParseCookieValue;
};

class CookieStore {
    private listeners = new Set<Listener>();

    private defaults: SetCookieOptions;
    private stringify: StringifyCookieValue;
    private parse: ParseCookieValue;

    private cookieString?: CookieString;
    private cache: Record<string, unknown> = {};

    private pollingInterval?: number;
    private poller?: ReturnType<typeof setInterval>;

    private isAutoupdating: boolean = false;

    constructor({
        initialCookieString,
        pollingInterval = 1000,
        stringify = defaultStringify,
        parse = defaultParse,
        ...defaults
    }: CookieStoreConfig = {}) {
        this.defaults = defaults;
        this.cookieString = initialCookieString;
        this.pollingInterval = pollingInterval;
        this.stringify = stringify;
        this.parse = parse;
    }

    private notify() {
        this.listeners.forEach((l) => void l());
    }

    private sync() {
        if (this.cookieString === document.cookie) return;

        this.cookieString = document.cookie;
        this.cache = {};
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

    getCookie = <T = unknown>(name: string, parse = this.parse as ParseCookieValue<T>): T => {
        if (this.cache[name] !== undefined) return this.cache[name] as T;

        const value = parse(parseCookie(this.cookieString ?? "")[name]);
        this.cache[name] = value;

        return value;
    };

    setCookie = <T>(
        name: string,
        value: T,
        options: SetCookieOptions = {},
        stringify = this.stringify as StringifyCookieValue<T>,
    ): void => {
        document.cookie = stringifySetCookie({
            ...this.defaults,
            ...options,
            name,
            value: stringify(value),
        });

        this.sync();
    };

    deleteCookie = (name: string, options: DeleteCookieOptions = {}): void => {
        document.cookie = stringifySetCookie({
            ...this.defaults,
            ...options,
            name,
            value: "",
            maxAge: -1,
            expires: undefined,
        });

        this.sync();
    };
}

export type { CookieStoreConfig, DeleteCookieOptions, SetCookieOptions };
export { CookieStore };
