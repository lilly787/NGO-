import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { list } from "@/lib/cms";
import { remove } from "@/app/admin/actions";
export default async function NewsAdmin(){if(!await isAdmin())redirect("/admin/login");const items=await list("news");return <><p className="eyebrow">Content management</p><h1>News &amp; Stories</h1><p><Link className="button primary" href="/admin/news/new">Add news</Link></p>{items.length?<div className="admin-list">{items.map(item=><article className="feature" key={item.id}><p className="eyebrow">{item.status.toLowerCase()}</p><h2>{item.title}</h2><div className="actions"><Link className="button" href={`/admin/news/${item.id}/edit`}>Edit</Link><form action={remove.bind(null,"news",item.id)}><button className="button danger">Delete</button></form></div></article>)}</div>:<div className="empty">No News &amp; Stories have been created yet.</div>}</>}
