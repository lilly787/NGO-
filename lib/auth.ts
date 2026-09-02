import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { compare } from "bcryptjs";
const name = "gsei_admin";
const secret = () => process.env.ADMIN_SESSION_SECRET;
function signature(value: string) { const key = secret(); if (!key) throw new Error("ADMIN_SESSION_SECRET is not configured."); return createHmac("sha256", key).update(value).digest("hex"); }
export async function signIn(email: string, password: string): Promise<true | "configuration" | "email" | "password"> { const passwordHash = process.env.ADMIN_PASSWORD_HASH; const normalizedEmail = email.trim().toLowerCase(); const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase(); if (!configuredEmail || !passwordHash || !secret()) return "configuration"; if (normalizedEmail !== configuredEmail) return "email"; if (!await compare(password, passwordHash)) return "password"; const value = `${normalizedEmail}.${signature(normalizedEmail)}`; (await cookies()).set(name, value, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 }); return true; }
export async function signOut() { (await cookies()).delete(name); }
export async function isAdmin() { const token = (await cookies()).get(name)?.value; if (!token || !secret()) return false; const separator = token.lastIndexOf("."); if (separator < 1) return false; const email = token.slice(0, separator); const received = token.slice(separator + 1); const expected = signature(email); return received.length === expected.length && timingSafeEqual(Buffer.from(received), Buffer.from(expected)) && email === process.env.ADMIN_EMAIL?.trim().toLowerCase(); }
