# @yaredfall/react-cookies

Simple client-side cookie management for React

## Features

- **Type-safe**: Full TypeScript support
- **Lightweight**: Minimal api with no bloat
- **Shared storage**: All consumers get notified when a cookie is set or removed
- **Syncronization**: External cookie changes are picked up automatically
- **Automatic serialization**: Built-in JSON parsing and stringification
- **SSR support**: Works with Next.js and other React frameworks

## Installation

```bash
npm add @yaredfall/react-cookies
```

## Quick Start

### Wrap your app with `CookiesProvider`

```tsx
import { CookiesProvider } from "@yaredfall/react-cookies";

function App({ children }: { children: React.ReactNode }) {
    return (
        <CookiesProvider path="/">
            {children}
        </CookiesProvider>
    );
}
```

### Use the `useCookie` hook to read and write cookies

```tsx
import { useCookie } from "@yaredfall/react-cookies";

function CookieDemo() {
    const [cookie, setCookie, removeCookie] = useCookie("test", "default value", { maxAge: 60 });

    return (
        <div>
            <p>Cookie: {cookie}</p>
            <button onClick={() => setCookie("new value")}>Set cookie</button>
            <button onClick={() => removeCookie()}>Remove cookie</button>
        </div>
    );
}
```

## API


### `<CookiesProvider />`

Provides the cookie store to the app.

Props:
- `pollingInterval` - polling interval in ms to pick up external cookie changes (default: 1000)
- `initialCookieString` - initial cookie string. Use it to provide cookie header during server-side rendering
- `domain` - default [domain attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie#domaindomain-value) of cookie setter
- `expires` - default [expires attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie#expiresdate) of cookie setter
- `maxAge` - default [max-age attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie#max-agenumber) of cookie setter
- `partitioned` - default [partitioned attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie#partitioned) of cookie setter
- `path` - default [path attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie#pathpath-value) of cookie setter
- `sameSite` - default [same-site attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie#samesitesamesite-value) of cookie setter
- `secure` - [secure attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie#secure) of the cookie
- `parse` - default function to parse the cookie value
- `stringify` - default function to stringify the cookie value

### `useCookie<T>(name, defaultValue, options)`

`name` - name of the cookie

`defaultValue` - value to return if the cookie is not defined

`options` - (optional) Options to control cookie behavior. The object can have the following properties
- `domain` - [domain attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie#domaindomain-value) of the cookie 
- `expires` - [expires attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie#expiresdate) of the cookie
- `maxAge` - [max-age attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie#max-agenumber) of the cookie
- `partitioned` - [partitioned attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie#partitioned) of the cookie
- `path` - [path attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie#pathpath-value) of the cookie
- `sameSite` - [same-site attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie#samesitesamesite-value) of the cookie
- `secure` - [secure attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie#secure) of the cookie
- `parse` - function to parse the cookie value
- `stringify` - function to stringify the cookie value

Returns a tuple `[value, set, remove]` where:
- `value` is the current cookie value or the default value if not undefined
- `set(value)` sets the cookie value with the provided options
- `remove()` removes the cookie with the provided options

By default, the cookie value is parsed and stringified as a JSON string. You can override this by providing custom `parse` and `stringify` functions.

### SSR

To provide cookies during server-side rendering, set the `initialCookieString` prop of `CookiesProvider` to the cookie header value.

Example with Next.js 15+:

```tsx
import { CookiesProvider } from "@yaredfall/react-cookies";
import { headers } from "next/headers";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const headerList = await headers();
    
    return (
        <html lang="en">
            <body>
                <CookiesProvider initialCookieString={headerList.get("cookie")}>
                    {children}
                </CookiesProvider>
            </body>
        </html>
    );
}
```