import sanitizeHtml from "sanitize-html";
import { prisma } from "@/lib/prisma";
import type { News, Voice } from "@prisma/client";
export type Kind = "news" | "voice";
export function toSlug(value:string){return value.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")}
export function cleanContent(value:string){return sanitizeHtml(value,{allowedTags:["p","h2","h3","strong","em","ul","ol","li","a","blockquote","img","br"],allowedAttributes:{a:["href","target","rel"],img:["src","alt"]},allowedSchemes:["http","https","mailto"]})}
export function list(kind:"news"):Promise<News[]>;
export function list(kind:"voice"):Promise<Voice[]>;
export async function list(kind:Kind){return kind==="news"?prisma.news.findMany({orderBy:{updatedAt:"desc"}}):prisma.voice.findMany({orderBy:{updatedAt:"desc"}})}
export function published(kind:"news"):Promise<News[]>;
export function published(kind:"voice"):Promise<Voice[]>;
export async function published(kind:Kind){return kind==="news"?prisma.news.findMany({where:{status:"PUBLISHED"},orderBy:{publishedAt:"desc"}}):prisma.voice.findMany({where:{status:"PUBLISHED"},orderBy:{publishedAt:"desc"}})}
