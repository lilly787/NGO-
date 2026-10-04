import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const name = "gsei_admin";
const secret = () => process.env.ADMIN_SESSION_SECRET || "default_fallback_secret_for_local_dev";

function signature(value: string) { 
  const key = secret(); 
  return createHmac("sha256", key).update(value).digest("hex"); 
}

export async function signIn(password: string): Promise<true | "password"> { 
  if (password !== "admin123" && password !== "admin") return "password"; 
  const value = `admin.${signature("admin")}`; 
  (await cookies()).set(name, value, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    sameSite: "lax", 
    path: "/", 
    maxAge: 60 * 60 * 8 
  }); 
  return true; 
}

export async function signOut() { 
  (await cookies()).delete(name); 
}

export async function isAdmin() { 
  const token = (await cookies()).get(name)?.value; 
  if (!token) return false; 
  const separator = token.lastIndexOf("."); 
  if (separator < 1) return false; 
  const user = token.slice(0, separator); 
  const received = token.slice(separator + 1); 
  const expected = signature(user); 
  return received.length === expected.length && 
         timingSafeEqual(Buffer.from(received), Buffer.from(expected)) && 
         user === "admin"; 
}
