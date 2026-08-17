import type { ApiResult } from "./types";

export async function apiCall<T = unknown>(
    baseUrl: string,
    path: string,
    options: RequestInit = {}
): Promise<ApiResult<T>> {
    const url = baseUrl.replace(/\/+$/, "") + path;
    try {
        const res = await fetch(url, {
            headers: { "Content-Type": "application/json", ...(options.headers || {}) },
            ...options,
        });
        const text = await res.text();
        let json: T | null = null;
        try {
            json = text ? (JSON.parse(text) as T) : null;
        } catch {
        }
        return { ok: res.ok, status: res.status, raw: text, json };
    } catch (err) {
        return { ok: false, status: 0, raw: String(err), json: null, networkError: true };
    }
}

export function formatRon(amount: number): string {
    return new Intl.NumberFormat("ro-RO", {
        style: "currency",
        currency: "RON",
    }).format(amount);
}