"use client";

import { useCookie } from "@yaredfall/react-cookies";
import { useState } from "react";

export function CookieDemo() {
    return (
        <div className="flex flex-col gap-8">
            <div className="text-2xl font-bold">Demo</div>
            <Consumer />
            <SecondConsumer />
            <AnotherConsumer />
        </div>
    );
}

function Consumer() {
    const [value, setValue] = useState("");
    const [cookie, setCookie, removeCookie] = useCookie("test", { maxAge: 5 });

    return (
        <div className="space-y-3">
            <div className="text-xl font-bold">Consumer</div>
            <div className="space-y-1">
                <div>Cookie value: {String(cookie)}</div>
                <div className="flex gap-2">
                    <input
                        className="border border-gray-300 rounded px-2 py-1"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                    <button type="button" className="bg-gray-100 px-4 rounded" onClick={() => setCookie(value)}>
                        Update from input value
                    </button>
                    <button
                        type="button"
                        className="bg-gray-100 px-4 rounded"
                        onClick={() => {
                            removeCookie();
                            setValue("");
                        }}
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
}

function SecondConsumer() {
    const [cookie] = useCookie("test");

    return (
        <div className="space-y-3">
            <div className="text-xl font-bold">Second consumer</div>
            <div>This component reads the same cookie: {String(cookie)}</div>
        </div>
    );
}

function AnotherConsumer() {
    const [cookie] = useCookie("another");

    return (
        <div className="space-y-3">
            <div className="text-xl font-bold">Another Consumer</div>
            <div>This component reads another cookie: {String(cookie)}</div>
        </div>
    );
}
